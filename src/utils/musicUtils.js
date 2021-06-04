const ytdl = require("ytdl-core");

const { nowPlayingEmbed, stopEmbed } = require("./embeds");

// Stream dispatcher time converter
const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (hours > 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
};

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

module.exports = {
  createQueue: (message) => {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    return queueConstruct;
  },

  joinVoiceChannel: async (message) => {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);

    try {
      const connection = await message.member.voice.channel.join();
      serverQueue.connection = connection;
    } catch (error) {
      console.error(error);
      globalQueue.delete(message.guild.id);
      return message.channel.send(error);
    }
  },

  queueEmbedDescription: (serverQueue) => {
    const songs = serverQueue.songs;
    let description;

    // For first song
    if (serverQueue.dispatcher) {
      const currentVideoTime = msToTime(serverQueue.dispatcher.streamTime);
      songs[0].title.length > 40
        ? (description = `1  [${songs[0].title
            .substring(0, 37)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}...](${
            songs[0].url
          }) - ${currentVideoTime} / ${songs[0].length}\n`)
        : (description = `1  [${songs[0].title
            .substring(0, 40)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}](${
            songs[0].url
          }) - ${currentVideoTime} / ${songs[0].length}\n`);
    } else {
      songs[0].title.length > 40
        ? (description = `1  [${songs[0].title
            .substring(0, 37)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}...](${songs[0].url}) - ${
            songs[0].length
          }\n`)
        : (description = `1  [${songs[0].title
            .substring(0, 40)
            .replace(/\[/g, "\uFF3B")
            .replace(/\]/g, "\uFF3D")}](${songs[0].url}) - ${
            songs[0].length
          }\n`);
    }

    // Subsequent songs, if available.
    if (songs.length > 1) {
      if (songs.length < 10) {
        for (i = 1; i < songs.length; i++) {
          songs[i].title.length > 40
            ? (description += `${i + 1}  [${songs[i].title
                .substring(0, 37)
                .replace(/\[/g, "\uFF3B")
                .replace(/\]/g, "\uFF3D")}...](${songs[i].url}) - ${
                songs[i].length
              }\n`)
            : (description += `${i + 1}  [${songs[i].title
                .substring(0, 40)
                .replace(/\[/g, "\uFF3B")
                .replace(/\]/g, "\uFF3D")}](${songs[i].url}) - ${
                songs[i].length
              }\n`);
        }
      } else {
        for (i = 1; i < 10; i++) {
          songs[i].title.length > 40
            ? (description += `${i + 1}  [${songs[i].title
                .substring(0, 37)
                .replace(/\[/g, "\uFF3B")
                .replace(/\]/g, "\uFF3D")}...](${songs[i].url}) - ${
                songs[i].length
              }\n`)
            : (description += `${i + 1}  [${songs[i].title
                .substring(0, 40)
                .replace(/\[/g, "\uFF3B")
                .replace(/\]/g, "\uFF3D")}](${songs[i].url}) - ${
                songs[i].length
              }\n`);
        }
      }
    }

    return description;
  },

  msToTime,
  playSong,
};
