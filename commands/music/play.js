const ytdl = require('ytdl-core');
const queue = new Map();

module.exports = {
    name: "play",
    description: "Start playing from the queue.",
    
    execute(message, args) {
        
        // Need to check if the queue exists
        

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
        
        // Join user's voice channel
        const connection = voiceChannel.join();
        console.log(voiceChannel.members);
        console.log(message.client.user)
    }
}