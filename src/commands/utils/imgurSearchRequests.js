const imgur_client_id = require('../../../config.json');

const HEADER = new Headers();
HEADER.append('Authorization', `Client-ID {${imgur_client_id}}`);

const formdata = new FormData();
formdata 

let requestOptions = {
    method: 'GET',
    headers: HEADER,
    body: formdata,
    redirect: 'follow'
};

let sort, window, page, queryString;
const url = `https://api.imgur.com/3/gallery/search/${sort}/${window}/${page}?q=${queryString}`;

let response = await fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));