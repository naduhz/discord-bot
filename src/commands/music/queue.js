const Discord = require("discord.js");
const { queueDescription } = require("../utils/queueDescription");

module.exports = {
  name: "queue",
  description: "Displays the queue.",
  async execute(message, args) {
    // Fetch globalqueue and serverqueue
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);
    const songs = serverQueue.songs;
    const dispatcher = serverQueue.dispatcher;

    // Check if serverQueue
    if (!serverQueue) {
      return message.channel.send("There is no server queue at the moment!");
    }

    description = queueDescription(serverQueue);

    const queueEmbed = new Discord.MessageEmbed()
      .setTitle(
        `${songs.length}  ${songs.length > 1 ? "tracks" : "track"} queued:`
      )
      .setColor(3447003)
      .setDescription(description)
      .setThumbnail(songs[0].thumbnail)
      .setFooter(songs.length > 10 ? "(showing first 10)" : "");

    return message.channel.send(queueEmbed);
    // TODO: and remove option
  },
};
