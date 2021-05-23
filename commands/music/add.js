const ytdl = require('ytdl-core');

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

        // Get song info from ytdl
        let songInfo;
        try { 
            songInfo = await ytdl.getInfo(args) 
        } catch (error) {
            return message.channel.send('I need a song to play!')
        };
        const song = {
                    title : songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url
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
            message.channel.send(`"${song.title}" has been added to the queue!`)
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`"${song.title}" has been added to the queue!`)
        }
    }
}