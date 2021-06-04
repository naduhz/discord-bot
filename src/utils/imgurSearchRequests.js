const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");

module.exports = async function imgurSearchRequests(searchParameters) {
  const url = `https://api.imgur.com/3/gallery/search/top/all?${searchParameters.tags}&${searchParameters.type}&${searchParameters.queryString}`;
  const config = {
    method: "get",
    url: url,
    headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
  };

  const response = await axios(config);
  const results = response.data.data;
  return results;
};
