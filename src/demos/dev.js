#!/usr/bin/env node
////////////////
// fetch-json //
////////////////

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ npx tsc
//    $ node src/demos/dev.js

import { fetchJson } from '../../build/fetch-json.js';

console.info();
console.info('Single GET fetch');
console.info('================');

const url =     'https://centerkey.com/rest/echo/';
const data =    { x: 3, y: 7 };
const options = { headers: { 'authorization': '123456', 'user-agent': 'Firefox' } };

fetchJson.enableLogger();
fetchJson.get( url, data, options).then(data => console.info(data));
fetchJson.post(url, data, options).then(data => console.info(data));
