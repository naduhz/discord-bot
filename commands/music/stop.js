module.exports = {
    name: "stop",
    description: "Stops the music player and removes all songs from the queue.",
    execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);

        // Check that user is in the voice channel
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send(
                'You have to be in a voice channel for me to stop the music!'
            );
        };

        // Check that bot is in a voice channel
        const botVoiceStatus = message.guild.voice.connection
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
            // Disconnect from voice channel
            message.channel.send('Bye bye!');
            botVoiceStatus.disconnect();

            // Check for song in queue
            if (!serverQueue) {
                return message.channel.send(
                    'There is no song for me to stop!'
                    );
            }

            // Remove songs from queue, stop connecting to voice channel
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
        }
    }
}