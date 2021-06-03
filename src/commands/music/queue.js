const Discord = require("discord.js");

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

    // Send a message with the queue
    if (dispatcher) {
      const currentVideoTime = msToTime(dispatcher.streamTime);
      function msToTime(duration) {
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
      }

      // Setting description
      if (songs[0].title.length > 40) {
        var description = `1  [${songs[0].title
          .substring(0, 37)
          .replace(/\[/g, "\uFF3B")
          .replace(/\]/g, "\uFF3D")}...](${
          songs[0].url
        }) - ${currentVideoTime} / ${songs[0].length}\n`;
      } else {
        var description = `1  [${songs[0].title
          .substring(0, 40)
          .replace(/\[/g, "\uFF3B")
          .replace(/\]/g, "\uFF3D")}](${
          songs[0].url
        }) - ${currentVideoTime} / ${songs[0].length}\n`;
      }
    } else {
      // Setting description
      if (songs[0].title.length > 40) {
        var description = `1  [${songs[0].title
          .substring(0, 37)
          .replace(/\[/g, "\uFF3B")
          .replace(/\]/g, "\uFF3D")}...](${songs[0].url}) - ${
          songs[0].length
        }\n`;
      } else {
        var description = `1  [${songs[0].title
          .substring(0, 40)
          .replace(/\[/g, "\uFF3B")
          .replace(/\]/g, "\uFF3D")}](${songs[0].url}) - ${songs[0].length}\n`;
      }
    }
    if (songs.length > 1) {
      if (songs.length < 10) {
        for (i = 1; i < songs.length; i++) {
          if (songs[i].title.length > 40) {
            description += `${i + 1}  [${songs[i].title
              .substring(0, 37)
              .replace(/\[/g, "\uFF3B")
              .replace(/\]/g, "\uFF3D")}...](${songs[i].url}) - ${
              songs[i].length
            }\n`;
          } else {
            description += `${i + 1}  [${songs[i].title
              .substring(0, 40)
              .replace(/\[/g, "\uFF3B")
              .replace(/\]/g, "\uFF3D")}](${songs[i].url}) - ${
              songs[i].length
            }\n`;
          }
        }
      } else {
        for (i = 1; i < 10; i++) {
          if (songs[i].title.length > 40) {
            description += `${i + 1}  [${songs[i].title
              .substring(0, 37)
              .replace(/\[/g, "\uFF3B")
              .replace(/\]/g, "\uFF3D")}...](${songs[i].url}) - ${
              songs[i].length
            }\n`;
          } else {
            description += `${i + 1}  [${songs[i].title
              .substring(0, 40)
              .replace(/\[/g, "\uFF3B")
              .replace(/\]/g, "\uFF3D")}](${songs[i].url}) - ${
              songs[i].length
            }\n`;
          }
        }
      }
    }

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
