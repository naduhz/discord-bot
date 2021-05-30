const {imgur_client_id} = require('../../../config.json');
const axios = require('axios');

module.exports = async function imgurSearchRequests(searchParameters) {
                                    const url = `https://api.imgur.com/3/gallery/search/top/all?${searchParameters.tags}&${searchParameters.type}&${searchParameters.queryString}`;
                                    const config = {
                                        method: 'get',
                                        url: url,
                                        headers: {'Authorization' : `Client-ID ${imgur_client_id}`}
                                    };

                                    const response = await axios(config);
                                    const images = response.data.data;

                                    return images;
                                    }