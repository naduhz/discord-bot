module.exports = {
    name: "queue",
    description: "Displays the queue.",
    async execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);

        // CHeck if serverQueue
        if (!serverQueue) {
            return message.channel.send("There are are no songs queued at the moment!")
        };

        // Send a message with the queue
        return message.channel.send(`Music Queue: \[${serverQueue.songs.length} track\(s\)\]`);
        // TODO: in an embed
            // TODO: that tracks the time remaining of current track
            // TODO: displays track order by index, and length of each track
            // TODO: and remove option
        
    }
}