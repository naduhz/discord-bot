const imgurSearchRequests = require("../../utils/imgurSearchRequests");
const SearchParameter = require("../../utils/searchParameterConstructor");
const imageEmbed = require("../../utils/imageEmbed");
const prefix = process.env.PREFIX;

module.exports = {
  name: "emilia",
  category: "fun",
  description: "Fetches Emilia animations off imgur",
  usage: `\`${prefix}\`` + "`emilia`",

  async execute(message, args) {
    const searchParameters = new SearchParameter("emilia", "anime", "gif");
    const results = await imgurSearchRequests(searchParameters);

    const randomAlbum = results[Math.floor(Math.random() * results.length)];

    try {
      if (!randomAlbum.hasOwnProperty("images")) {
        const embed = imageEmbed(randomAlbum.link);
        embed.description = `EMT!! (Emilia-tan Maji Tenshi!!)`;
        return message.channel.send(embed);
      } else {
        const randomImageLink =
          randomAlbum.images[
            Math.floor(Math.random() * randomAlbum.images.length)
          ].link;
        const embed = imageEmbed(randomImageLink);
        embed.description = `EMT!! (Emilia-tan Maji Tenshi!!)`;
        return message.channel.send(embed);
      }
    } catch (error) {
      console.error(error);
      console.log(randomAlbum);
    }
  },
};
