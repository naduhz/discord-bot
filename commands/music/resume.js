module.exports = {
    name: "resume",
    description: "Plays the song being paused",
    async execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);

        // Check if serverQueue
        if (!serverQueue) {
            return message.channel.send("There is no song queue!")
        };

        // Check if there are songs in the serverQueue
        if (!serverQueue.songs) {
            return message.channel.send("There are no songs in the queue!")
        };

        // Check if there are paused songs
        if (serverQueue.playing) {
            return message.channel.send("A song is already playing!")
        };

        // Resume is not working, version of node does not seem to be the issue
        serverQueue.connection.dispatcher.resume();
        serverQueue.playing = true;
        message.channel.send("The song has been resumed!");
          }
    }