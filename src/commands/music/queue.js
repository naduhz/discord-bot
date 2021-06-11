const Discord = require("discord.js");

const { queueEmbedDescription } = require("../../utils/musicUtils");

module.exports = {
  name: "queue",
  category: "music",
  description: "Displays the queue.",
  usage: "`kt!queue`",

  async execute(message, args) {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);
    const songs = serverQueue.songs;

    if (!serverQueue) {
      return message.channel.send("There is no server queue at the moment!");
    }

    embedDescription = queueEmbedDescription(serverQueue);

    const queueEmbed = new Discord.MessageEmbed()
      .setTitle(
        `${songs.length}  ${songs.length > 1 ? "tracks" : "track"} queued:`
      )
      .setColor(3447003)
      .setDescription(embedDescription)
      .setThumbnail(songs[0].thumbnail)
      .setFooter(songs.length > 10 ? "(showing first 10)" : "");

    return message.channel.send(queueEmbed);
    // TODO: and remove option
  },
};
