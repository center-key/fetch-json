#!/usr/bin/env node
//////////////////////////////////
// fetch-json                   //
// Simple examples (JavaScript) //
//////////////////////////////////

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ node src/demos/examples-await.js

// Setup
import { fetchJson } from '../../dist/fetch-json.js';
fetchJson.enableLogger();

// Intro
console.info();
console.info('Examples');
console.info('========');
console.info('fetch-json v' + fetchJson.version);
console.info();

// Examples
const example = {

   nasa: async () => {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY', count: 1 };
      const data =   await fetchJson.get(url, params);
      console.info('The NASA APoD for today is at:', data[0]?.url);

      },

   jupiter: async () => {

      // Create Jupiter
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Jupiter', position: 5 };
      const data =     await fetchJson.post(url, resource);
      console.info('New planet:', data);

      },

   teapot: async () => {

      // Fetch me some tea
      const url =  'https://centerkey.com/rest/status/418/';
      const data = await fetchJson.get(url);
      console.info(data.bodyText);

      },

   books: async () => {

      // Get books about SpaceX
      const url =      'https://www.googleapis.com/books/v1/volumes?q=spacex';
      const data =     await fetchJson.get(url);
      const getTitle = (book) => book.volumeInfo.title;
      console.info('SpaceX books:');
      console.info(data.items.map(getTitle));

      },

   serverError: async () => {

      // HTTP status code 500
      const url =  'https://centerkey.com/rest/status/500/';  //mock server error
      const data = await fetchJson.get(url);
      if (data.error)
         console.error('HTTP Status Code:', data.status, data);
      else
         console.info('Valid JSON Data:', data);

      },

   };

// Run examples
example.nasa();
example.jupiter();
example.teapot();
// example.books();
example.serverError();

// Wait for HTTP requests to complete
const done = () => console.info('\nDone.');
setTimeout(done, 3000);
