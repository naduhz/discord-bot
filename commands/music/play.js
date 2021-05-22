const ytdl = require('ytdl-core');

module.exports = {
    name: "play",
    description: "Start playing from the queue.",
    
    async execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);
        
        // Check user in voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send(
                'You need to be in a voice channel for me to play music!'
            )
        };
        
        // Check bot has permissions
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
            return message.channel.send(
                'I need permissions to join and speak in your voice channel!'
            )
        };
        
        // Get song info from ytdl
        const songInfo = await ytdl.getInfo(args);
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
            
            // Join user's voice channel
            try {
                const connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                // Play song
                play(message.guild, queueConstruct.songs[0])
            } catch (error) {
                console.log(error);
                globalQueue.delete(message.guild.id);
                return message.channel.send(error);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`"${song.title}" has been added to the queue!`)
        }

        // Play function
        function play(guild, song) {
            // If serverQueue is empty, leave the voice channel and delete the queue.
            const serverQueue = globalQueue.get(guild.id);
            if (!song) {
                message.channel.send('There are no songs left in the queue!')
                serverQueue.voiceChannel.leave();
                globalQueue.delete(guild.id);
                return;
            }

            // Song dispatcher
            const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            }).on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Now playing: "${song.title}"`);
          }

        }
    }