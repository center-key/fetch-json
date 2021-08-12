// fetch-json
// Simple examples

// To run:
//    $ git clone https://github.com/center-key/fetch-json.git
//    $ cd fetch-json
//    $ npm install
//    $ node docs/js/examples-await.js

// Setup
import { fetchJson } from '../../dist/fetch-json.js';
fetchJson.enableLogger();

// Intro
console.log();
console.log('Examples');
console.log('========');
console.log('fetch-json v' + fetchJson.version);
console.log();

// Examples
const example = {

   nasa: async () => {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      const data = await fetchJson.get(url, params);
      console.log('The NASA APoD for today is at:', data.url);

      },

   jupiter: async () => {

      // Create Jupiter
      const resource = { name: 'Jupiter', position: 5 };
      const data = await fetchJson.post('https://httpbin.org/post', resource)
         .catch(console.error);
      console.log('New planet:', data);

      },

   teapot: async () => {

      // Fetch me some tea
      const data = await fetchJson.get('https://httpbin.org/status/418');
      console.log(data.bodyText);

      },

   books: async () => {

      // Get books about SpaceX
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      const data = await fetchJson.get(url).catch(console.error);
      const getTitle = (book) => book.volumeInfo.title;
      console.log('SpaceX books:');
      console.log(data.items.map(getTitle));

      },

   };

// Run examples
example.nasa();
example.jupiter();
example.teapot();
example.books();

// Wait for HTTP requests to complete
const done = () => console.log('\nDone.');
setTimeout(done, 3000);
