#!/usr/bin/env node
//////////////////////////////////
// fetch-json                   //
// Simple examples (JavaScript) //
//////////////////////////////////

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ node src/demos/examples.js

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
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY', count: 1  };
      const handleData = (data) =>
         console.info('The NASA APoD for today is at:', data[0]?.url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter() {

      // Create Jupiter
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data) =>
         console.info('New planet:', data);
      fetchJson.post(url, resource).then(handleData);

      },

   teapot() {

      // Fetch me some tea
      const url = 'https://centerkey.com/rest/status/418/';
      const handleData = (data) =>
         console.info(data.bodyText);
      fetchJson.get(url).then(handleData);

      },

   books() {

      // Get books about SpaceX
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      const handleData = (data) => {
         const getTitle = (book) => book.volumeInfo.title;
         console.info('SpaceX books:');
         console.info(data.items.map(getTitle));
         };
      fetchJson.get(url).then(handleData);

      },

   serverError() {

      // HTTP status code 500
      const url1 = 'https://dna-dom.org/api/books/3';         //valid book
      const url2 = 'https://centerkey.com/rest/status/500/';  //mock server error
      const handleData = (data) => {
         if (data.error)
            console.error('HTTP Status Code:', data.status, data);
         else
            console.info('Book Resource:', data);
         };
      fetchJson.get(url1).then(handleData);  //response: ok
      fetchJson.get(url2).then(handleData);  //response: error

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
