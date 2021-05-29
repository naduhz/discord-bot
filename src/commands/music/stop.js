const Discord = require('discord.js');

module.exports = {
    name: "stop",
    description: "Stops the music player and removes all songs from the queue.",
    execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);

        // Check that user is in the voice channel
        const userVoiceChannel = message.member.voice.channel
        if (!userVoiceChannel) {
            return message.channel.send(
                'You have to be in a voice channel for me to stop the music!'
            );
        };

        // Check that bot is in the voice channel
        if (message.guild.voice == undefined || userVoiceChannel !== message.guild.voice.channel) {
            return message.channel.send(
                'I\'m not in your voice channel!'
                );
        } else {
            // Check for song in queue
            if (!serverQueue) {
                const embed = new Discord.MessageEmbed()
                    // Set the title of the field
                    .setTitle('There are no songs for me to stop!')
                    .setColor(3447003)
                    .setDescription('Bye bye!')
                    message.channel.send(embed);
                message.guild.voice.setChannel(null);
                return;
            }
            // Remove songs from queue, stop connecting to voice channel
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            message.guild.voice.setChannel(null);
        }
    }
}