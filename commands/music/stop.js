module.exports = {
    name: "stop",
    description: "Stops the music player and removes all songs from the queue.",
    execute(message, args) {

        // Check that user is in the voice channel
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send(
                'You have to be in a voice channel for me to stop the music!'
            );
        };

        // Check that bot is in a voice channel
        const botVoiceStatus = message.guild.voice
        if (!botVoiceStatus) {
            return message.channel.send(
                'I\'m not in a voice channel!'
            );
        }

        // Match voice channel IDs
        if (voiceChannel !== botVoiceStatus.channel) {
            return message.channel.send(
                'I\'m not in your voice channel!'
                );
        } else {
            // Check for song in queue
            // if (!serverQueue) {
            //     return message.channel.send(
            //         'There is no song for me to stop!'
            //         );
            // }

            // serverQueue.songs = [];
            // serverQUeue.connection.dispatcher.end();
        }
    }
}