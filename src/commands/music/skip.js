module.exports = {
  name: "skip",
  category: "music",
  description: "Skips the current song to the next song in the queue.",
  usage: "`kt!skip`",

  async execute(message, args) {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("There is no song queue!");
    }
    if (!serverQueue.songs) {
      return message.channel.send("There are no songs for me to skip!");
    }

    serverQueue.connection.dispatcher.end();
  },
};
