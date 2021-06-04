const Discord = require("discord.js");
const ytsr = require("ytsr");

const { songAddedEmbed } = require("../../utils/embeds");
const { createQueue, joinVoiceChannel } = require("../../utils/musicUtils");

module.exports = {
  name: "search",
  description: "Search for a song",

  async execute(message, args) {
    if (args == "") {
      return message.channel.send("I need something to search for!");
    } else {
      // Parse search
      const searchString = args.join(" ");
      const filters = await ytsr.getFilters(searchString);
      const filterVideo = filters.get("Type").get("Video");
      const searchResults = await ytsr(filterVideo.url, { limit: 10 });

      // Setting the searchEmbedDescription
      let searchEmbedDescription = "";
      for (i = 0; i < searchResults.items.length; i++) {
        if (searchResults.items[i].title.length > 40) {
          searchEmbedDescription += `${i + 1} [${searchResults.items[i].title
            .substring(0, 37)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}...](${searchResults.items[i].url})\n`;
        } else {
          searchEmbedDescription += `${i + 1} [${searchResults.items[i].title
            .substring(0, 40)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}](${searchResults.items[i].url})\n`;
        }
      }

      const searchEmbed = new Discord.MessageEmbed()
        .setTitle(`Results for "${searchString}":`)
        .setColor(3447003)
        .setDescription(searchEmbedDescription)
        .setThumbnail(searchResults.items[0].bestThumbnail.url)
        .setFooter("Type the number of the song to add it to the queue.");
      message.channel.send(searchEmbed);

      // Add to queue from search
      const listener = async (message) => {
        if (message.content.length < 3 && parseInt(message.content) <= 10) {
          const globalQueue = message.client.queue;
          const serverQueue = globalQueue.get(message.guild.id);

          const voiceChannel = message.member.voice.channel;
          if (!voiceChannel) {
            return message.channel.send(
              "You need to be in a voice channel for me to add music!"
            );
          }

          const permissions = voiceChannel.permissionsFor(message.client.user);
          if (!permissions.has("SPEAK") || !permissions.has("CONNECT")) {
            return message.channel.send(
              "I need permissions to join and speak in your voice channel!"
            );
          }

          // Get song info
          const song = {
            title: searchResults.items[parseInt(message.content) - 1].title,
            url: searchResults.items[parseInt(message.content) - 1].url,
            thumbnail:
              searchResults.items[parseInt(message.content) - 1].bestThumbnail
                .url,
            length: searchResults.items[parseInt(message.content) - 1].duration,
          };

          if (!serverQueue) {
            const newQueue = createQueue(message);
            globalQueue.set(message.guild.id, newQueue);
            newQueue.songs.push(song);
            await joinVoiceChannel(message);
            message.channel.send(songAddedEmbed(song));
          } else {
            if (!serverQueue.connection) {
              await joinVoiceChannel(message);
            }
            serverQueue.songs.push(song);
            message.channel.send(songAddedEmbed(song));
          }
        }
      };

      message.client.on("message", listener);
      message.client.setTimeout(
        () => message.client.removeListener("message", listener),
        10000
      );
    }
  },
};
