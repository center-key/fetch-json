// Mocha Specification Cases

// Imports
const assert =    require('assert');
const fetchJson = require('./fetch-json.js');

//Setup
describe('Specification Cases: node (fetch-json.js)', () => {

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Module fetch-json', () => {

   it('loads as an object', () => {
      const actual =   { module: typeof fetchJson };
      const expected = { module: 'object' };
      assert.deepEqual(actual, expected);
      });

   it('has functions for get(), post(), put(), patch(), and delete()', () => {
      const actual =   {
         get:    typeof fetchJson.get,
         post:   typeof fetchJson.post,
         put:    typeof fetchJson.put,
         patch:  typeof fetchJson.patch,
         delete: typeof fetchJson.delete
         };
      const expected = {
         get:    'function',
         post:   'function',
         put:    'function',
         patch:  'function',
         delete: 'function'
         };
      assert.deepEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Google Books API search result for "spacex" fetched by fetchJson.get()', () => {

   it('contains the correct "kind" value and "totalItems" as a number', (done) => {
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      function handleData(data) {
         const actual =   { total: typeof data.totalItems, kind: data.kind };
         const expected = { total: 'number',               kind: 'books#volumes' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('NASA Astronomy Picture of the Day resource fetched by fetchJson.get()', () => {

   it('contains a link to media', (done) => {
      const url = 'https://api.nasa.gov/planetary/apod';
      const params = { api_key: 'DEMO_KEY' };
      function handleData(data) {
         const actual =   { media: typeof data.media_type, url: data.url.match(/..../)[0] };
         const expected = { media: 'string',               url: 'http' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      }).timeout(5000);  //Deep Space Network can be a little slow

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('GET response returned by httpbin.org', () => {

   it('contains empty params when none are supplied', (done) => {
      const url = 'https://httpbin.org/get';
      function handleData(data) {
         const actual =   { params: data.args };
         const expected = { params: {} };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from the URL query string', (done) => {
      const url = 'https://httpbin.org/get?planet=Jupiter&position=5';
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', position: '5' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from an object', (done) => {
      const url = 'https://httpbin.org/get';
      const params = { planet: 'Jupiter', position: 5, tip: 'Big & -148°C' };
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', position: '5', tip: 'Big & -148°C' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      });

   it('contains the params from both the URL query string and an object', (done) => {
      const url = 'https://httpbin.org/get?sort=diameter';
      const params = { planet: 'Jupiter', position: 5 };
      function handleData(data) {
         const actual =   data.args;
         const expected = { sort: 'diameter', planet: 'Jupiter', position: '5' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Response returned by httpbin.org for a planet (object literal)', () => {

   it('from a POST contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/post';
      const resource = { name: 'Mercury', position: 1 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.post(url, resource).then(handleData);
      });

   it('from a PUT contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/put';
      const resource = { name: 'Venus', position: 2 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.put(url, resource).then(handleData);
      });

   it('from a PATCH contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/patch';
      const resource = { name: 'Mars', position: 4 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.patch(url, resource).then(handleData);
      });

   it('from a DELETE contains the planet (JSON)', (done) => {
      const url = 'https://httpbin.org/delete';
      const resource = { name: 'Jupiter', position: 5 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.delete(url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The low-level fetchJson.request() function', () => {

   it('can successfully GET a planet', (done) => {
      const url = 'https://httpbin.org/get';
      const params = { planet: 'Neptune', position: 8 };
      function handleData(data) {
         const actual =   data.args;
         const expected = { planet: 'Neptune', position: '8' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.request('get', url, params).then(handleData);
      });

   it('can successfully POST a planet', (done) => {
      const url = 'https://httpbin.org/post';
      const resource = { name: 'Saturn', position: 6 };
      function handleData(data) {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.request('POST', url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('HTTP error returned by httpbin.org', () => {

   it('for status 500 contains the message "INTERNAL SERVER ERROR"', (done) => {
      const url = 'https://httpbin.org/status/500';
      function handleData(data) {
         const actual =   {
            error:       data.error,
            ok:          data.ok,
            status:      [data.status, data.statusText],
            contentType: data.contentType
            };
         const expected = {
            error:       true,
            ok:          false,
            status:      [500, 'INTERNAL SERVER ERROR'],
            contentType: 'text/html; charset=utf-8'
            };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('for status 418 contains the message "I\'M A TEAPOT"', (done) => {
      const url = 'https://httpbin.org/status/418';
      function handleData(data) {
         const actual =   {
            error:       data.error,
            ok:          data.ok,
            status:      [data.status, data.statusText],
            contentType: data.contentType
            };
         const expected = {
            error:       true,
            ok:          false,
            status:      [418, 'I\'M A TEAPOT'],
            contentType: null
            };
         assert.deepEqual(actual, expected);
         done();
         console.log(data.bodyText);
         }
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "bodyText" field of the object returned from requesting', () => {

   function getFirstLine(string) { return string.split('\n', 1)[0]; }

   it('an HTML web page is a string that begins with "<!DOCTYPE html>"', (done) => {
      const url = 'https://httpbin.org/html';
      function handleData(data) {
         const actual =   {
            ok:          data.ok,
            status:      [data.status, data.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText)
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/html; charset=utf-8',
            firstLine:   '<!DOCTYPE html>'
            };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('an XML document is a string that begins with "<!DOCTYPE xml>"', (done) => {
      const url = 'https://httpbin.org/xml';
      function handleData(data) {
         const actual =   {
            ok:          data.ok,
            status:      [data.status, data.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText)
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'application/xml',
            firstLine:   '<?xml version=\'1.0\' encoding=\'us-ascii\'?>'
            };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   it('a "robots.txt" text file is a string that begins with "User-agent: *"', (done) => {
      const url = 'https://httpbin.org/robots.txt';
      function handleData(data) {
         const actual =   {
            ok:          data.ok,
            status:      [data.status, data.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText)
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/plain',
            firstLine:   'User-agent: *'
            };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function fetchJson.enableLogger()', () => {

   it('sets the logger to the function passed in', () => {
      function mockLogger() {}
      fetchJson.enableLogger(mockLogger);
      const actual =   { type: typeof fetchJson.logger, fn: fetchJson.logger };
      const expected = { type: 'function',              fn: mockLogger };
      assert.deepEqual(actual, expected);
      });

   it('disables the logger when passed false', () => {
      fetchJson.enableLogger(false);
      const actual =   { logger: fetchJson.logger, disabled: !fetchJson.logger };
      const expected = { logger: null,             disabled: true };
      assert.deepEqual(actual, expected);
      });

   it('passes a timestamp, methed, and URL to a custom logger on GET', (done) => {
      const url = 'https://httpbin.org/get';
      const isoTimestampLength = new Date().toISOString().length;
      function customLogger(logTimestamp, logMethod, logUrl) {
         fetchJson.enableLogger(false);
         const actual =   { timestamp: logTimestamp.length, method: logMethod, url: logUrl };
         const expected = { timestamp: isoTimestampLength,  method: 'GET',     url: url };
         assert.deepEqual(actual, expected);
         done();
         }
      fetchJson.enableLogger(customLogger);
      fetchJson.get(url);
      });

   });

});
