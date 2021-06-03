const { nowPlayingEmbed, stopEmbed } = require("../utils/embeds");
const ytdl = require("ytdl-core");

// Recursive play function
const playSong = (guild, song) => {
  const globalQueue = guild.client.queue;
  const serverQueue = globalQueue.get(guild.id);

  if (!song) {
    serverQueue.textChannel.send(stopEmbed());
    serverQueue.voiceChannel.leave();
    globalQueue.delete(guild.id);
    return;
  }

  // Song dispatcher
  const dispatcher = serverQueue.connection.play(
    ytdl(song.url, { highWaterMark: 1 << 25 })
  );
  serverQueue.dispatcher = dispatcher;
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(nowPlayingEmbed(song));

  dispatcher.on("finish", () => {
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  });

  dispatcher.on("error", (error) => {
    console.error(error);
    serverQueue.textChannel.send(
      `Sorry, "${song.title}" could not be played! Let me play the next song for you.`
    );
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  });
};

module.exports = { playSong };
