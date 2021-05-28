const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const Discord = require('discord.js');

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

        // Recursive play function
        function play(guild, song) {
            // If serverQueue is empty, leave the voice channel and delete the queue.
            const serverQueue = globalQueue.get(guild.id);
            if (!song) {
                const embed = new Discord.MessageEmbed()
                    // Set the title of the field
                    .setTitle('There are no songs left in the queue!')
                    .setColor(3447003)
                    .setDescription('Bye bye!')
                message.channel.send(embed);
                serverQueue.voiceChannel.leave();
                globalQueue.delete(guild.id);
                return;
            };

            // Song dispatcher
            const dispatcher = serverQueue.connection.play(ytdl(song.url, {highWaterMark: 1 << 25}));
            serverQueue.dispatcher = dispatcher;
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

             // Displays current track when song is changed.
             const embed = new Discord.MessageEmbed()
                        // Set the title of the field
                        .setTitle('Now Playing:')
                        .setColor(3447003)
                        .setDescription(`${song.title}`)
                        .setThumbnail(song.thumbnail)
                        .addFields(
                            {name: 'Length:', value: `${song.length}`})
            serverQueue.textChannel.send(embed);

            dispatcher.on("finish", () => {
                // Change song on finish
                serverQueue.songs.shift();
                console.log(serverQueue.songs);
                play(guild, serverQueue.songs[0]);
            });
            
            dispatcher.on("error", error => {
                console.error(error);
                serverQueue.textChannel.send(`Sorry, "${song.title}" could not be played!!`);
                serverQueue.songs.shift();
                console.log(serverQueue.songs);
                play(guild, serverQueue.songs[0]);
            });
          }

        if (args == '') {
            play(message.guild, serverQueue.songs[0]);
        } else {
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
                    playing: true,
                    dispatcher: null
                };
                
                // Set the server queue into the global queue
                globalQueue.set(message.guild.id, queueConstruct);
                
                // Push songs 
                queueConstruct.songs.push(song);
                console.log(queueConstruct.songs);
                const embed = new Discord.MessageEmbed()
                            // Set the title of the field
                            .setTitle('Song added!')
                            .setColor(3447003)
                            .setDescription(`${song.title}`)
                            .setThumbnail(song.thumbnail)
                            .addFields(
                                {name: 'Length:', value: `${song.length}`})
                    message.channel.send(embed);
                
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
                // If add is used before play
                if (serverQueue.songs) {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
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
                // If there are no more songs left in the queue
                else {
                    serverQueue.songs.push(song);
                    console.log(serverQueue.songs);
                    const embed = new Discord.MessageEmbed()
                            // Set the title of the field
                            .setTitle('Song added!')
                            .setColor(3447003)
                            .setDescription(`${song.title}`)
                            .setThumbnail(song.thumbnail)
                            .addFields(
                                {name: 'Length:', value: `${song.length}`})
                    message.channel.send(embed);
                    play(message.guild, serverQueue.songs[0]);
                };
            };
            }}
    }