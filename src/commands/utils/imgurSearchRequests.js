const {imgur_client_id} = require('../../../config.json');
const axios = require('axios');

// module.exports = {
//     name: 'imgurSearchRequests',
//     description: 'Fetches from imgur',
//     async execute() {
const searchParameters = {
    queryString: 'q_all=saber',
    type: 'q_type=gif',
    tags: 'q_type=anime'
}

const url = `https://api.imgur.com/3/gallery/search/top/all?${searchParameters.queryString}`;

const config = {
    method: 'get',
    url: url,
    headers: {'Authorization' : `Client-ID ${imgur_client_id}`}
};

axios(config)
.then(response => console.log(response.data))
.then(result => console.log(result))
.catch(error => console.log('error', error));
//     }
// }