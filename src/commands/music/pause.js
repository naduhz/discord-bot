module.exports = {
  name: "pause",
  category: "music",
  description: "Pauses the song being played",
  usage: "`kt!pause`",

  async execute(message, args) {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);
    const dispatcher = serverQueue.dispatcher;

    if (!serverQueue) {
      return message.channel.send("There is no song queue!");
    }
    if (!serverQueue.songs) {
      return message.channel.send("There are no songs in the queue!");
    }
    if (dispatcher.paused) {
      return message.channel.send("A song is already paused!");
    }
    dispatcher.pause(true);
    message.channel.send("The song has been paused!");
  },
};
