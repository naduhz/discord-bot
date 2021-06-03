const { msToTime } = require("./msToTime");

module.exports = {
  queueDescription: (serverQueue) => {
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
};
