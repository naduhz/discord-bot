const Discord = require('discord.js');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'search',
    description: 'Search for a song',
    
    async execute(message, args) {
        const searchString = args.join(' ');
        
        const filters = await ytsr.getFilters(searchString);
        const filterVideo = filters.get('Type').get('Video');
        const searchResults = await ytsr(filterVideo.url, {limit: 10});

        let desc = '';
        for (i = 0; i < searchResults.items.length; i++) {
            if (searchResults.items[i].title.length > 40) {
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 37)}...](${searchResults.items[i].url})\n`
            } else {
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 40)}](${searchResults.items[i].url})\n`
            }
        };

        const embed = new Discord.MessageEmbed()
                // Descriptors
                .setTitle(`Results for "${searchString}":`)
                .setColor(3447003)
                .setDescription(desc)
                .setThumbnail(searchResults.items[0].bestThumbnail.url)
                .setFooter('Type the number of the song to add it to the queue.')
        
        message.channel.send(embed);


        // TODO: After search actions
        message.client.on('message', message => {
            if (message.content.length < 3 && parseInt(message.content) <= 10) {
                // Fetch globalqueue and serverqueue
                const globalQueue = message.client.queue;
                const serverQueue = globalQueue.get(message.guild.id);

                // Check bot has permissions
                const voiceChannel = message.member.voice.channel;
                const permissions = voiceChannel.permissionsFor(message.client.user);
                if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
                    return message.channel.send(
                        'I need permissions to join and speak in your voice channel!'
                    )
                };

                // Get song info from ytdl
                let songInfo;
                try { 
                    songInfo = ytdl.getInfo(searchResults.items[parseInt(message.content)].url);
                } catch (error) {
                    console.error(error);
                };
                const song = {
                            title : songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                            thumbnail: songInfo.videoDetails.thumbnails[0].url,
                            length: new Date (parseInt(songInfo.videoDetails.lengthSeconds) * 1000).toISOString().substr(11, 8)
                        };

                // Add to queue from search
                // Check for an existing server queue
                if (!serverQueue) {
                    // Instantiate a server queue
                    const queueConstruct = {
                        textChannel: message.channel,
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        playing: true
                    };
                    
                    // Set the server queue into the global queue
                    globalQueue.set(message.guild.id, queueConstruct);
                    
                    // Push songs 
                    queueConstruct.songs.push(song);
                    console.log(queueConstruct.songs);

                    // Join user's voice channel
                    try {
                        const connection = voiceChannel.join();
                        queueConstruct.connection = connection;
                    } catch (error) {
                        console.log(error);
                        globalQueue.delete(message.guild.id);
                        return message.channel.send(error);
                    };

                    // TODO: Embed and beautify
                    const embed = new Discord.MessageEmbed()
                        // Set the title of the field
                        .setTitle('Song added:')
                        .setColor(3447003)
                        .setDescription(`${song.title}`)
                        .setThumbnail(song.thumbnail)
                        .addFields(
                            {name: 'Length:', value: `${song.length}`})
                    message.channel.send(embed);

                } else {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);

                    // Join voice channel if not in voice channel
                    if (!serverQueue.connection) {
                        try {
                            const connection = voiceChannel.join();
                            queueConstruct.connection = connection;
                        } catch (error) {
                            console.log(error);
                            globalQueue.delete(message.guild.id);
                            return message.channel.send(error);
                        };
                    };

                     // TODO: Embed and beautify
                     const embed = new Discord.MessageEmbed()
                     // Set the title of the field
                     .setTitle('Song added:')
                     .setColor(3447003)
                     .setDescription(`${song.title}`)
                     .setThumbnail(song.thumbnail)
                     .addFields(
                         {name: 'Length:', value: `${song.length}`})
                 message.channel.send(embed);
                    }
        };
        })
    }
}