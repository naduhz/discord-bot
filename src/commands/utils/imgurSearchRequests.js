const imgur_client_id = require('../../../config.json');
const Headers = require('header')

const header = new Headers();
header.append('Authorization', `Client-ID {${imgur_client_id}}`);

const formdata = {
    sort: 'top',
    window: 'all',
    page: '1',
    queryString: ''
} 

requestOptions = {
    method: 'GET',
    headers: header,
    body: formdata,
    redirect: 'follow'
};

const url = `https://api.imgur.com/3/gallery/search/${formdata.sort}/${formdata.window}/${formdata.page}?q=${formdata.queryString}`;

let response = await fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));