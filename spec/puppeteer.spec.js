// Mocha Specification Suite
// Run in Puppeteer (a headless web browser)

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { browserReady } from 'puppeteer-browser-ready';
import { pathToFileURL } from 'url';
import puppeteer from 'puppeteer';

// Setup
const mode =     { type: 'Minified', file: 'dist/fetch-json.min.js' };
const filename = import.meta.url.replace(/.*\//, '');  //jshint ignore:line
const webPage =  pathToFileURL('spec/fixtures/script-src-fetch-json.html').href;
let web;  //fields: browser, page, response, status, location, title, html, root
const loadWebPage =  async () => web = await puppeteer.launch().then(browserReady.goto(webPage));
const closeWebPage = async () => await browserReady.close(web);
before(loadWebPage);
after(closeWebPage);

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {

////////////////////////////////////////////////////////////////////////////////
describe('Google Books API search result for "spacex" fetched by fetchJson.get()', () => {

   it('contains the correct "kind" value and "totalItems" as a number', (done) => {
      const handleData = (data) => {
         const actual =   { total: typeof data.totalItems, kind: data.kind };
         const expected = { total: 'number',               kind: 'books#volumes' };
         assertDeepStrictEqual(actual, expected, done);
         };
      const script = () => {
         const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
         return globalThis.fetchJson.get(url);
         };
      web.page.evaluate(script).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Star Wars API result for spaceships fetched by fetchJson.get()', () => {

   it('contains an array of spaceships', (done) => {

      const handleData = (data) => {
         const actual =   { count: typeof data.count, class: typeof data.results[0].starship_class };
         const expected = { count: 'number',          class: 'string' };
         assertDeepStrictEqual(actual, expected, done);
         };
      const script = () => {
         const url = 'https://swapi.py4e.com/api/starships/';
         const params = { format: 'json' };
         return globalThis.fetchJson.get(url, params);
         };
      web.page.evaluate(script).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
