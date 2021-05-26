module.exports = {
    name: "pause",
    description: "Pauses the song being played",
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

        // Check if there are playing songs
        // if (!serverQueue.playing) {
        //     return message.channel.send("A song is already paused!")
        // };

        // Pause the song
        dispatcher.pause(true);
        message.channel.send("The song has been paused!");
          }
    }