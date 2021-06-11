module.exports = {
  name: "resume",
  category: "music",
  description: "Plays the song being paused",
  usage: "`kt!resume`",

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
    if (!dispatcher.paused) {
      return message.channel.send("A song is already playing!");
    }
    dispatcher.resume();
    message.channel.send("The song has been resumed!");
  },
};
