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
const loadWebPage = () => puppeteer.launch()
   .then(browserReady.goto(webPage))
   .then(info => web = info);
const closeWebPage = () => browserReady.close(web);
before(loadWebPage);
after(closeWebPage);

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {

////////////////////////////////////////////////////////////////////////////////
describe('Google Books API search result for "spacex" fetched by fetchJson.get()', () => {

   it('contains the correct "kind" value and "totalItems" as a number', (done) => {
      const handleData = (data) => {
         const skip = data.status === 429 || data.status === 500;  //http: Too Many Requests
         if (skip)
            console.warn('[Assertion Skipped]', data.data?.error?.message);
         const actual =   { total: typeof data.totalItems, kind: data.kind };
         const expected = { total: 'number',               kind: 'books#volumes' };
         assertDeepStrictEqual(actual, skip ? actual : expected, done);
         };
      const script = () => {
         const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
         return globalThis.fetchJson.get(url);
         };
      web.page.evaluate(script).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Nobel Prize API result for laureate #26 fetched by fetchJson.get()', () => {

   it('is Albert Einstein', (done) => {
      const handleData = (data) => {
         const laureate = data.laureates[0];
         const actual =   { id: laureate.id, name: laureate.fullName.en, birth: laureate.birth.date };
         const expected = { id: '26',        name: 'Albert Einstein',    birth: '1879-03-14' };
         assertDeepStrictEqual(actual, expected, done);
         };
      const script = () => {
         const url =    'https://api.nobelprize.org/2.0/laureates';
         const params = { ID: 26 };
         return globalThis.fetchJson.get(url, params);
         };
      web.page.evaluate(script).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
