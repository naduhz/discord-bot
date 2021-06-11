const ytsr = require("ytsr");

const {
  createQueue,
  joinVoiceChannel,
  playSong,
} = require("../../utils/musicUtils");
const { songAddedEmbed } = require("../../utils/embeds");

module.exports = {
  name: "play",
  category: "music",
  description:
    "Start playing a specified song or starts playing from the queue.",
  usage: "`kt!play <song name>(optional if a song is already in the queue)`",

  async execute(message, args) {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);

    // Check user in voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send(
        "You need to be in a voice channel for me to play music!"
      );
    }

    // Check bot has permissions
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("SPEAK") || !permissions.has("CONNECT")) {
      return message.channel.send(
        "I need permissions to join and speak in your voice channel!"
      );
    }

    if (args == "") {
      playSong(message.guild, serverQueue.songs[0]);
    } else {
      // Parse search
      const searchString = args.join(" ");
      const filters = await ytsr.getFilters(searchString);
      const filterVideo = filters.get("Type").get("Video");
      const searchResult = await ytsr(filterVideo.url, { limit: 1 });

      // Get song info from ytsr
      const song = {
        title: searchResult.items[0].title,
        url: searchResult.items[0].url,
        thumbnail: searchResult.items[0].bestThumbnail.url,
        length: searchResult.items[0].duration,
      };

      if (!serverQueue) {
        const newQueue = createQueue(message);
        globalQueue.set(message.guild.id, newQueue);
        await joinVoiceChannel(message);
        newQueue.songs.push(song);
        playSong(message.guild, newQueue.songs[0]);
      } else {
        serverQueue.songs.push(song);
        message.channel.send(songAddedEmbed(song));
      }
    }
  },
};
