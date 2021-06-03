const Discord = require("discord.js");

module.exports = function imageEmbed(imageLink) {
  const baseEmbed = new Discord.MessageEmbed()
    .setColor(3447003)
    .setImage(imageLink);

  return baseEmbed;
};
