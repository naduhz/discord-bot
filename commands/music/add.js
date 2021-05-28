const ytsr = require('ytsr');
const Discord = require('discord.js')

module.exports = {
    name: "add",
    description: "Add a song to the queue.",
    async execute(message, args) {
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

        const searchString = args.join(' ')
        const filters = await ytsr.getFilters(searchString);
        const filterVideo = filters.get('Type').get('Video');
        const searchResult = await ytsr(filterVideo.url, {limit: 1});
        
        // Get song info from ytsr
        const song = {
            title : searchResult.items[0].title,
            url: searchResult.items[0].url,
            thumbnail: searchResult.items[0].bestThumbnail.url,
            length: searchResult.items[0].duration
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

            // Join user's voice channel
            try {
                const connection = await voiceChannel.join();
                queueConstruct.connection = connection;
            } catch (error) {
                console.error(error);
                globalQueue.delete(message.guild.id);
                return message.channel.send(error);
            };

            const embed = new Discord.MessageEmbed()
                .setTitle('Song added!')
                .setColor(3447003)
                .setDescription(`${song.title}`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    {name: 'Length:', value: `${song.length}`})
            message.channel.send(embed);

        } else {
            serverQueue.songs.push(song);

            // Join voice channel if not in voice channel
            if (!serverQueue.connection) {
                try {
                    const connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                } catch (error) {
                    console.error(error);
                    globalQueue.delete(message.guild.id);
                    return message.channel.send(error);
                };
            };

            const embed = new Discord.MessageEmbed()
                // Set the title of the field
                .setTitle('Song added!')
                .setColor(3447003)
                .setDescription(`${song.title}`)
                .setThumbnail(song.thumbnail)
                .addFields(
                    {name: 'Length:', value: `${song.length}`})
            message.channel.send(embed);
        }
    }
}