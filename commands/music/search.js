const Discord = require('discord.js');
const ytsr = require('ytsr');

module.exports = {
    name: 'search',
    description: 'Search for a song',
    
    async execute(message, args) {
        const searchString = args.join(' ');
        const searchResults = await ytsr(searchString, {limit: 10});
        console.log(searchResults.items);

        let desc = '';
        for (i = 0; i < searchResults.items.length; i++)
            desc += `${i+1} [${searchResults.items[i].title.substring(0, 50)}](${searchResults.items[i].url})\n`
        const embed = new Discord.MessageEmbed()
                // Descriptors
                .setTitle(`Results for "${searchString}":`)
                .setColor(3447003)
                .setDescription(desc)
                .setThumbnail(searchResults.items[0].bestThumbnail.url)
        
        message.channel.send(embed);
    }
}