const Discord = require('discord.js');
const ytsr = require('ytsr');

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
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 37).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}...](${searchResults.items[i].url})\n`
            } else {
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 40).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}](${searchResults.items[i].url})\n`
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

        // Add to queue from search
        const listener = async message => {
            if (message.content.length < 3 && parseInt(message.content) <= 10) {
                // Fetch globalqueue and serverqueue
                const globalQueue = message.client.queue;
                const serverQueue = globalQueue.get(message.guild.id);

                // Check user in voice channel
                const voiceChannel = message.member.voice.channel;
                if (!voiceChannel) {
                    return message.channel.send(
                        'You need to be in a voice channel for me to add music!'
                    )
                };

                // Check bot has permissions
                const permissions = voiceChannel.permissionsFor(message.client.user);
                if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
                    return message.channel.send(
                        'I need permissions to join and speak in your voice channel!'
                    )
                };

                // Get song info
                const song = {
                            title : searchResults.items[parseInt(message.content) - 1].title,
                            url: searchResults.items[parseInt(message.content) - 1].url,
                            thumbnail: searchResults.items[parseInt(message.content) - 1].bestThumbnail.url,
                            length: searchResults.items[parseInt(message.content) - 1].duration
                        };

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
                        const connection = await voiceChannel.join();
                        queueConstruct.connection = connection;
                    } catch (error) {
                        console.log(error);
                        globalQueue.delete(message.guild.id);
                        return message.channel.send(error);
                    };

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
                            const connection = await voiceChannel.join();
                            serverQueue.connection = connection;
                        } catch (error) {
                            console.log(error);
                            globalQueue.delete(message.guild.id);
                            return message.channel.send(error);
                        };
                    };

                     const embed = new Discord.MessageEmbed()
                     // Set the title of the field
                     .setTitle('Song added:')
                     .setColor(3447003)
                     .setDescription(`${song.title}`)
                     .setThumbnail(song.thumbnail)
                     .addFields(
                         {name: 'Length:', value: `${song.length}`})
                 message.channel.send(embed);
                    }}};

        message.client.on('message', listener);
        message.client.setTimeout(() => message.client.removeListener('message', listener), 3000);
                }
            }