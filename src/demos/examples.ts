//////////////////////////////////
// fetch-json                   //
// Simple examples (TypeScript) //
//////////////////////////////////

// To run:
//    $ cd fetch-json
//    $ npm install
//    $ grep out tsconfig.json
//    $ npx tsc
//    $ node build/demos/examples.js

// Setup
import { fetchJson, FetchJsonAltResponse, JsonObject } from '../fetch-json.js';

// Type Declarations
export type BookData = { items: Book[] };
export type Book =     { volumeInfo: { title: string } };
export type NasaApod = { url: string };

// Intro
console.info();
console.info('Examples');
console.info('========');
console.info('fetch-json v' + fetchJson.version);
console.info();
fetchJson.enableLogger();

// Examples
const example = {

   nasa(): void {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      const handleData = (data: NasaApod) =>
         console.info('The NASA APoD for today is at:', (data).url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter(): void {

      // Create Jupiter
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data: JsonObject) =>
         console.info('New planet:', data);
      fetchJson.post('https://centerkey.com/rest/', resource)
         .then(handleData)
         .catch(console.error);

      },

   teapot(): void {

      // Fetch me some tea
      const handleData = (data: FetchJsonAltResponse) =>
         console.info(data.bodyText);
      fetchJson.get('https://centerkey.com/rest/status/418/').then(handleData);

      },

   books(): void {

      // Get books about SpaceX
      const handleData = (data: BookData) => {
         const getTitle = (book: Book) => book.volumeInfo.title;
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

export { example };
