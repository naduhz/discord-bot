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
        if (!message.guild.voice) {
            return message.channel.send(
                'I\'m not in a voice channel!'
            );
        } else {
            console.log(voiceChannel);
        }
        // Match voice channel IDs
        }

    }