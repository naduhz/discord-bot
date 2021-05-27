const Discord = require('discord.js');
const ytsr = require('ytsr');

module.exports = {
    name: 'search',
    description: 'Search for a song',
    
    async execute(message, args) {
        const searchString = args.join(' ');
        
        const filters = await ytsr.getFilters(searchString);
        const filterVideo = filters.get('Type').get('Video');
        const searchResults = await ytsr(filterVideo.url, {limit: 10});

        let desc = '';
        for (i = 0; i < searchResults.items.length; i++) {
            if (searchResults.items[i].title.length > 40) {
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 37)}...](${searchResults.items[i].url})\n`
            } else {
                desc += `${i+1} [${searchResults.items[i].title.substring(0, 40)}](${searchResults.items[i].url})\n`
            }
        };

        const embed = new Discord.MessageEmbed()
                // Descriptors
                .setTitle(`Results for "${searchString}":`)
                .setColor(3447003)
                .setDescription(desc)
                .setThumbnail(searchResults.items[0].bestThumbnail.url)
        
        message.channel.send(embed);

        // TODO: Play from search
    }
}