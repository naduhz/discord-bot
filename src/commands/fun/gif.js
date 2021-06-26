const imgurSearchRequests = require("../../utils/imgurSearchRequests");
const SearchParameter = require("../../utils/searchParameterConstructor");
const imageEmbed = require("../../utils/imageEmbed");
const prefix = process.env.PREFIX;

module.exports = {
  name: "gif",
  category: "fun",
  description: "Fetches gifs off Imgur.",
  usage: `\`${prefix}gif [topic]\``,

  async execute(message, args) {
    const searchParameters = new SearchParameter(args.join(" "), "", "anigif");
    const results = await imgurSearchRequests(searchParameters);

    const randomAlbum = results[Math.floor(Math.random() * results.length)];

    try {
      if (!randomAlbum.hasOwnProperty("images")) {
        const embed = imageEmbed(randomAlbum.link);
        embed.description = `Results for: \`${args.join(" ")}\``;
        return message.channel.send(embed);
      } else {
        const randomImageLink =
          randomAlbum.images[
            Math.floor(Math.random() * randomAlbum.images.length)
          ].link;
        const embed = imageEmbed(randomImageLink);
        embed.description = `Results for: \`${args.join(" ")}\``;
        return message.channel.send(embed);
      }
    } catch (error) {
      console.error(error);
      console.log(randomAlbum);
    }
  },
};
