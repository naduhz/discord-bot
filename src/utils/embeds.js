const Discord = require("discord.js");

module.exports = {
  imageEmbed: (imageLink) => {
    const baseEmbed = new Discord.MessageEmbed()
      .setColor(3447003)
      .setImage(imageLink);

    return baseEmbed;
  },

  songAddedEmbed: (song) => {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle("Song added!")
      .setColor(3447003)
      .setDescription(`${song.title}`)
      .setThumbnail(song.thumbnail)
      .addFields({ name: "Length:", value: `${song.length}` });

    return baseEmbed;
  },

  nowPlayingEmbed: (song) => {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle("Now Playing:")
      .setColor(3447003)
      .setDescription(`${song.title}`)
      .setThumbnail(song.thumbnail)
      .addFields({ name: "Length:", value: `${song.length}` });

    return baseEmbed;
  },

  stopEmbed: () => {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle("There are no songs left!")
      .setColor(3447003)
      .setDescription("Bye bye!");

    return baseEmbed;
  },

  displayAllCommandsEmbed: (title, description) => {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle(title)
      .setColor(3447003)
      .setDescription(description)
      .setThumbnail("https://i.imgur.com/pJWOgP9.png");

    return baseEmbed;
  },

  displaySingleCommandEmbed: (title, description) => {
    const baseEmbed = new Discord.MessageEmbed()
      .setTitle(title)
      .setColor(3447003)
      .setDescription(description);

    return baseEmbed;
  },
};
