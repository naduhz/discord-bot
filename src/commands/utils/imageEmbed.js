const Discord = require('discord.js');



module.exports = function imageEmbed(imageLink) {
                    const embed = new Discord.MessageEmbed()
                    .setColor(3447003)
                    .setImage(imageLink)

                    return embed;
}