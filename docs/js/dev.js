#!/usr/bin/env node
////////////////
// fetch-json //
////////////////

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ npm run dev

import { fetchJson } from '../../build/fetch-json.js';  //create build version with "tsc" command

console.log();
console.log('One');
console.log('===');
fetchJson.enableLogger();

const url = 'https://official-joke-api.appspot.com/random_joke';
fetchJson.get(url).then(console.log);
