// fetch-json
// Simple examples

// To run:
//    $ cd fetch-json
//    $ npm install
//    $ node docs/examples.js

// Setup
const fetchJson = require('../dist/fetch-json.js');
fetchJson.enableLogger();

// Intro
console.log();
console.log('Examples');
console.log('========');
console.log('fetch-json v' + fetchJson.version);
console.log();

// Examples
const example = {

   nasa: () => {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      const handleData = (data) => console.log('The NASA APoD for today is at: ' + data.url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter: () => {

      // Create Jupiter
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data) => console.log('Planet:', data);
      fetchJson.post('https://httpbin.org/post', resource)
         .then(handleData)
         .catch(console.error);

      },

   teapot: () => {

      // Fetch me some tea
      const handleData = (data) => console.log(data.bodyText);
      fetchJson.get('https://httpbin.org/status/418').then(handleData);

      },

   books: () => {

      // Get books about SpaceX
      const handleData = (data) => {
         const getTitle = (book) => book.volumeInfo.title;
         console.log('SpaceX books:');
         console.log(data.items.map(getTitle));
         };
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      fetchJson.get(url).then(handleData).catch(console.error);

      }

   };

// Run examples
example.nasa();
example.jupiter();
example.teapot();
example.books();

// Wait for HTTP requests to complete
const done = () => console.log('\nDone.');
setTimeout(done, 3000);
