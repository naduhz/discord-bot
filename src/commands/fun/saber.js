const imgurSearchRequests = require("../../utils/imgurSearchRequests");
const SearchParameter = require("../../utils/searchParameterConstructor");
const imageEmbed = require("../../utils/imageEmbed");
const prefix = process.env.PREFIX;

module.exports = {
  name: "saber",
  category: "fun",
  description: "Fetches Saber animations off Imgur.",
  usage: `\`${prefix}saber\``,

  async execute(message, args) {
    const searchParameters = new SearchParameter("saber", "anime", "gif");
    const results = await imgurSearchRequests(searchParameters);

    const randomAlbum = results[Math.floor(Math.random() * results.length)];

    try {
      if (!randomAlbum.hasOwnProperty("images")) {
        const embed = imageEmbed(randomAlbum.link);
        embed.description = `${message.author.toString()} has been blessed by Saber's presence!`;
        return message.channel.send(embed);
      } else {
        const randomImageLink =
          randomAlbum.images[
            Math.floor(Math.random() * randomAlbum.images.length)
          ].link;
        const embed = imageEmbed(randomImageLink);
        embed.description = `${message.author.toString()} has been blessed by Saber's presence!`;
        return message.channel.send(embed);
      }
    } catch (error) {
      console.error(error);
      console.log(randomAlbum);
    }
  },
};
