module.exports = {
    name: "resume",
    description: "Plays the song being paused",
    async execute(message, args) {
        // Fetch globalqueue, serverqueue and dispatcher
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);
        const dispatcher = serverQueue.dispatcher;

        // Check if serverQueue
        if (!serverQueue) {
            return message.channel.send("There is no song queue!")
        };

        // Check if there are songs in the serverQueue
        if (!serverQueue.songs) {
            return message.channel.send("There are no songs in the queue!")
        };

        // Check if there are paused songs
        if (!dispatcher.paused) {
            return message.channel.send("A song is already playing!")
        };

        // Resume
        dispatcher.resume();
        message.channel.send("The song has been resumed!");
          }
    }