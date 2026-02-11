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
fetchJson.enableLogger();

const url = 'https://official-joke-api.appspot.com/random_joke';
fetchJson.get(url).then(data => console.info(data));
