module.exports = {
    name: "skip",
    description: "Skips the current song to the next song in the queue.",
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
            return message.channel.send("There are no songs for me to skip!")
        };

        // Skip to the next song
        serverQueue.connection.dispatcher.end();
          }
    }