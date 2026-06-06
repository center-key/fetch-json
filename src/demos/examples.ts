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
import { fetchJson, FetchJsonErrorResponse, JsonObject } from '../fetch-json.js';

// Type Declarations
export type BookData = { items: Book[] };
export type Book =     { volumeInfo: { title: string } };
export type NasaApod = { url: string };

// Intro
console.info();
console.info('Examples');
console.info('========');
//console.info('fetch-json v' + fetchJson.version);
console.info();
fetchJson.enableLogger();

// Examples
const example = {

   nasa(): void {

      // NASA APoD
      const url =    'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY', count: 1 };
      const handleData = (data: NasaApod[]) =>
         console.info('The NASA APoD for today is at:', data[0]?.url);
      fetchJson.get(url, params).then(handleData);

      },

   jupiter(): void {

      // Create Jupiter
      const url = 'https://centerkey.com/rest/echo/';
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data: JsonObject) =>
         console.info('New planet:', data);
      fetchJson.post(url, resource).then(handleData);

      },

   teapot(): void {

      // Fetch me some tea
      const url = 'https://centerkey.com/rest/status/418/';
      const handleData = (data: FetchJsonErrorResponse) =>
         console.info(data.bodyText);
      fetchJson.get(url).then(handleData);

      },

   books(): void {

      // Get books about SpaceX
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      const handleData = (data: BookData) => {
         const getTitle = (book: Book) => book.volumeInfo.title;
         console.info('SpaceX books:');
         console.info(data.items.map(getTitle));
         };
      fetchJson.get(url).then(handleData);

      },

   serverError(): void {

      // HTTP status code 500
      type Book = { id: number, title: string, author: string };
      const url1 = 'https://dna-dom.org/api/books/3';         //valid book
      const url2 = 'https://centerkey.com/rest/status/500/';  //mock server error
      const handleData = (data: Book | FetchJsonErrorResponse) => {
         const response = <FetchJsonErrorResponse>data;
         const book =     <Book>data;
         if (response.error)
            console.error('HTTP Status Code:', response.status, data);
         else
            console.info('Book Resource:', book);
         };
      fetchJson.get(url1).then(handleData);  //response: ok
      fetchJson.get(url2).then(handleData);  //response: error

      },

   timeout(): void {

      // Force a timeout error by waiting for only 1 ms
      const url =         'https://dna-dom.org/api/books/';
      const abortSignal = globalThis.AbortSignal.timeout(1);  //maximum impatience
      const handleData = (data: Book[] | FetchJsonErrorResponse) =>
         console.info('Haste makes waste:', data);
      fetchJson.get(url, {}, { signal: abortSignal }).then(handleData);

      },

   };

// Run examples
example.nasa();
example.jupiter();
example.teapot();
// example.books();
example.serverError();
example.timeout();

// Wait for HTTP requests to complete
const done = () => console.info('\nDone.');
setTimeout(done, 3000);

export { example };
