//////////////////////////////////
// fetch-json                   //
// Simple examples (TypeScript) //
//////////////////////////////////

// To run:
//    $ cd fetch-json
//    $ npm install
//    $ grep out tsconfig.json
//    $ npx tsc
//    $ node build/docs/ts/examples.js

// Setup
import { fetchJson, FetchJsonTextResponse, JsonObject } from '../../fetch-json.js';

// Type Declarations
export type BookData = { items: Book[] };
export type Book =     { volumeInfo: { title: string } };
export type NasaApod = { url: string };

// Intro
console.log();
console.log('Examples');
console.log('========');
console.log('fetch-json v' + fetchJson.version);
console.log();
fetchJson.enableLogger(true);

// Examples
const example = {

   nasa(): void {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      const handleData = (data: NasaApod) =>
         console.log('The NASA APoD for today is at:', (data).url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter(): void {

      // Create Jupiter
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data: JsonObject) =>
         console.log('New planet:', data);
      fetchJson.post('https://httpbin.org/post', resource)
         .then(handleData)
         .catch(console.error);

      },

   teapot(): void {

      // Fetch me some tea
      const handleData = (data: FetchJsonTextResponse) =>
         console.log(data.bodyText);
      fetchJson.get('https://httpbin.org/status/418').then(handleData);

      },

   books(): void {

      // Get books about SpaceX
      const handleData = (data: BookData) => {
         const getTitle = (book: Book) => book.volumeInfo.title;
         console.log('SpaceX books:');
         console.log(data.items.map(getTitle));
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
const done = () => console.log('\nDone.');
setTimeout(done, 3000);

export { example };
