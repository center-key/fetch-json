#!/usr/bin/env node
//////////////////////////////////
// fetch-json                   //
// Simple examples (JavaScript) //
//////////////////////////////////

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ node docs/js/examples.js

// Setup
import { fetchJson } from '../../dist/fetch-json.js';

// Intro
console.info();
console.info('Examples');
console.info('========');
console.info('fetch-json v' + fetchJson.version);
console.info();
fetchJson.enableLogger();

// Examples
const example = {

   nasa() {

      // NASA APoD
      const url =        'https://api.nasa.gov/planetary/apod';
      const params =     { api_key: 'DEMO_KEY' };
      const handleData = (data) => console.info('The NASA APoD for today is at:', data.url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter() {

      // Create Jupiter
      const resource =   { name: 'Jupiter', position: 5 };
      const handleData = (data) => console.info('New planet:', data);
      fetchJson.post('https://centerkey.com/rest/', resource)
         .then(handleData)
         .catch(console.error);

      },

   teapot() {

      // Fetch me some tea
      const handleData = (data) => console.info(data.bodyText);
      fetchJson.get('https://centerkey.com/rest/status/418/').then(handleData);

      },

   books() {

      // Get books about SpaceX
      const handleData = (data) => {
         const getTitle = (book) => book.volumeInfo.title;
         console.info('SpaceX books:');
         console.info(data.items.map(getTitle));
         };
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      fetchJson.get(url).then(handleData).catch(console.error);

      },

   };

// Run examples
example.nasa();
example.jupiter();
example.teapot();
example.books();

// Wait for HTTP requests to complete
const done = () => console.info('\nDone.');
setTimeout(done, 3000);
