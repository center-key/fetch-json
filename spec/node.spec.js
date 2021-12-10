// Mocha Specification Suite
// Run on a node server

// Imports
import assert from 'assert';
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';

// Setup
import { fetchJson, FetchJson } from '../dist/fetch-json.js';
const mode =       { type: 'ES Module', file: 'dist/fetch-json.js' };
const filename =   import.meta.url.replace(/.*\//, '');  //jshint ignore:line

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Module fetch-json', () => {

   it('follows semantic versioning', () => {
      const semVerPattern = /\d+[.]\d+[.]\d+/;
      const actual =   { version: fetchJson.version, valid: semVerPattern.test(fetchJson.version) };
      const expected = { version: fetchJson.version, valid: true };
      assertDeepStrictEqual(actual, expected);
      });

   it('loads as an object', () => {
      const actual =   { module: typeof fetchJson };
      const expected = { module: 'object' };
      assertDeepStrictEqual(actual, expected);
      });

   it('has functions for get(), post(), put(), patch(), and delete()', () => {
      const actual = {
         get:    typeof fetchJson.get,
         post:   typeof fetchJson.post,
         put:    typeof fetchJson.put,
         patch:  typeof fetchJson.patch,
         delete: typeof fetchJson.delete,
         };
      const expected = {
         get:    'function',
         post:   'function',
         put:    'function',
         patch:  'function',
         delete: 'function',
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Google Books API search result for "spacex" fetched by fetchJson.get()', () => {

   it('contains the correct "kind" value and "totalItems" as a number', (done) => {
      const url = 'https://www.googleapis.com/books/v1/volumes?q=spacex';
      const handleData = (data) => {
         const actual =   { total: typeof data.totalItems, kind: data.kind };
         const expected = { total: 'number',               kind: 'books#volumes' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Star Wars API result for spaceships fetched by fetchJson.get()', () => {

   it('contains an array of spaceships', (done) => {

      const url = 'https://swapi.py4e.com/api/starships/';
      const params = { format: 'json' };
      const handleData = (data) => {
         const actual =   { count: typeof data.count, class: typeof data.results[0].starship_class };
         const expected = { count: 'number',          class: 'string' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Awaiting a berry from the PokéAPI with fetchJson.get() [async/await]', () => {

   it('is rewarded with a tasty treat', async () => {
      const url = 'https://pokeapi.co/api/v2/berry/razz';
      const data = await fetchJson.get(url);
      const actual =   { id: data.id, name: data.name, growth_time: data.growth_time };
      const expected = { id: 16,      name: 'razz',    growth_time: 2 };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('GET response returned by httpbin.org', () => {

   it('contains empty params when none are supplied', (done) => {
      const url = 'https://httpbin.org/get';
      const handleData = (data) => {
         const actual =   { params: data.args };
         const expected = { params: {} };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from the URL query string', (done) => {
      const url = 'https://httpbin.org/get?planet=Jupiter&position=5';
      const handleData = (data) => {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', position: '5' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from an object', (done) => {
      const url =    'https://httpbin.org/get';
      const params = { planet: 'Jupiter', position: 5, tip: 'Big & -148°C' };
      const handleData = (data) => {
         const actual =   data.args;
         const expected = { planet: 'Jupiter', position: '5', tip: 'Big & -148°C' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   it('contains the params from both the URL query string and an object', (done) => {
      const url =    'https://httpbin.org/get?sort=diameter';
      const params = { planet: 'Jupiter', position: 5 };
      const handleData = (data) => {
         const actual =   data.args;
         const expected = { sort: 'diameter', planet: 'Jupiter', position: '5' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Response returned by httpbin.org for a planet (object literal)', () => {

   it('from a POST contains the planet (JSON)', (done) => {
      const url =      'https://httpbin.org/post';
      const resource = { name: 'Mercury', position: 1 };
      const handleData = (data) => {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.post(url, resource).then(handleData);
      });

   it('from a PUT contains the planet (JSON)', (done) => {
      const url =      'https://httpbin.org/put';
      const resource = { name: 'Venus', position: 2 };
      const handleData = (data) => {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.put(url, resource).then(handleData);
      });

   it('from a PATCH contains the planet (JSON)', (done) => {
      const url =      'https://httpbin.org/patch';
      const resource = { name: 'Mars', position: 4 };
      const handleData = (data) => {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.patch(url, resource).then(handleData);
      });

   it('from a DELETE contains the planet (JSON)', (done) => {
      const url =      'https://httpbin.org/delete';
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data) => {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.delete(url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The low-level fetchJson.request() function', () => {

   it('can successfully GET a planet', (done) => {
      const url =    'https://httpbin.org/get';
      const params = { planet: 'Neptune', position: 8 };
      const handleData = (data) => {
         const actual =   data.args;
         const expected = { planet: 'Neptune', position: '8' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('GET', url, params).then(handleData);
      });

   it('can successfully POST a planet', (done) => {
      const url =      'https://httpbin.org/post';
      const resource = { name: 'Saturn', position: 6 };
      const handleData = (data) => {
         const actual =   { planet: data.json, type: typeof data.json };
         const expected = { planet: resource,  type: 'object' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('POST', url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('HTTP error returned by httpbin.org', () => {

   it('for status 500 contains the message "INTERNAL SERVER ERROR"', (done) => {
      const url = 'https://httpbin.org/status/500';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            error:       data.error,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            };
         const expected = {
            ok:          false,
            error:       true,
            status:      [500, 'INTERNAL SERVER ERROR'],
            contentType: 'text/html; charset=utf-8',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const handleError = (error) => {
         assert.fail(error);
         };
      fetchJson.get(url).then(handleData).catch(handleError);
      });

   it('for status 500 throws exception in strict errors mode', (done) => {
      const url = 'https://httpbin.org/status/500';
      const handleData = (data) => {
         assert.fail(data);
         };
      const handleError = (error) => {
         const actual = {
            object:  error.constructor.name,
            name:    error.name,
            message: error.message,
            };
         const expected = {
            object:  'Error',
            name:    'Error',
            message: 'HTTP response status ("strictErrors" mode enabled): 500'
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, {}, { strictErrors: true }).then(handleData).catch(handleError);
      });

   it('for status 418 contains the message "I\'M A TEAPOT"', (done) => {
      const url = 'https://httpbin.org/status/418';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            error:       data.error,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            };
         const expected = {
            ok:          false,
            error:       true,
            status:      [418, 'I\'M A TEAPOT'],
            contentType: null,
            };
         assertDeepStrictEqual(actual, expected, done);
         console.log(data.bodyText);
         };
      const handleError = (error) => {
         assert.fail(error);
         };
      fetchJson.get(url).then(handleData).catch(handleError);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "bodyText" field of the object returned from requesting', () => {

   const getFirstLine = (string) => string.split('\n', 1)[0];

   it('an HTML web page is a string that begins with "<!DOCTYPE html>"', (done) => {
      const url = 'https://httpbin.org/html';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText),
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/html; charset=utf-8',
            firstLine:   '<!DOCTYPE html>',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('an XML document is a string that begins with "<!DOCTYPE xml>"', (done) => {
      const url = 'https://httpbin.org/xml';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText),
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'application/xml',
            firstLine:   '<?xml version=\'1.0\' encoding=\'us-ascii\'?>',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('a "robots.txt" text file is a string that begins with "User-agent: *"', (done) => {
      const url = 'https://httpbin.org/robots.txt';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText),
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/plain',
            firstLine:   'User-agent: *',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function fetchJson.enableLogger()', () => {

   it('sets the logger to the function passed in', () => {
      const mockLogger = () => {};
      fetchJson.enableLogger(mockLogger);
      const actual =   { type: typeof fetchJson.logger, fn: fetchJson.logger };
      const expected = { type: 'function',              fn: mockLogger };
      assertDeepStrictEqual(actual, expected);
      });

   it('disables the logger when passed false', () => {
      fetchJson.enableLogger(false);
      const actual =   { logger: fetchJson.logger, disabled: !fetchJson.logger };
      const expected = { logger: null,             disabled: true };
      assertDeepStrictEqual(actual, expected);
      });

   it('passes a timestamp, methed, and URL to a custom logger on GET', (done) => {
      const url = 'https://httpbin.org/get';
      const domain = 'httpbin.org';
      const isoTimestampLength = new Date().toISOString().length;
      const index = fetchJson.getLogHeaderIndex();
      let awaitingRequest = true;
      const customLogger = (...logValues) => {
         const actual = {
            timestamp: logValues[index.timestamp].length,
            method:    logValues[index.method],
            domain:    logValues[index.domain],
            url:       logValues[index.url],
            ok:        logValues[index.ok],
            status:    logValues[index.status],
            text:      logValues[index.text],
            type:      logValues[index.type],
            };
         const expected = {
            timestamp: isoTimestampLength,
            method:    'GET',
            domain:    domain,
            url:       url,
            ok:        awaitingRequest ? undefined : true,
            status:    awaitingRequest ? undefined : 200,
            text:      awaitingRequest ? undefined : 'OK',
            type:      awaitingRequest ? undefined : 'application/json',
            };
         assertDeepStrictEqual(actual, expected);
         if (logValues[index.http] === 'request')
            awaitingRequest = false;
         else
            done(fetchJson.enableLogger(false));
         };
      fetchJson.enableLogger(customLogger);
      fetchJson.get(url);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Base options', () => {

   it('can be set to automatically add an "Authorization" HTTP header', (done) => {
      const url = 'https://httpbin.org/get';
      const baseOptions = { headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } };
      const options =     { referrerPolicy: 'no-referrer' };
      fetchJson.setBaseOptions(baseOptions);
      const handleData = (data) => {
         const actual = {
            auth:   data.headers.Authorization,
            accept: data.headers.Accept,
            params: data.args,
            };
         const expected = {
            auth:   'Basic WE1MIGlzIGhpZGVvdXM=',
            accept: 'application/json',
            params: { planet: 'Mars' },
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, { planet: 'Mars' }, options).then(handleData);
      });

   it('can be cleared', (done) => {
      const url = 'https://httpbin.org/get';
      const previousBaseOptions = fetchJson.getBaseOptions();
      fetchJson.setBaseOptions({ });
      const handleData = (data) => {
         const actual = {
            previous: previousBaseOptions,
            auth:     data.headers.Authorization,
            accept:   data.headers.Accept,
            params:   data.args,
            };
         const expected = {
            previous: { headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } },
            auth:     undefined,
            accept:   'application/json',
            params:   { planet: 'Mercury' },
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, { planet: 'Mercury' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('FetchJson class instances', () => {

   it('can each set different base options', (done) => {
      const url = 'https://httpbin.org/get';
      const baseOptionsA = { headers: { From: 'aaa@example.com' } };
      const baseOptionsB = { headers: { From: 'bbb@example.com' } };
      const fetchJsonA = new FetchJson(baseOptionsA).fetchJson;
      const fetchJsonB = new FetchJson(baseOptionsB).fetchJson;
      const handleData = (data) => {
         const actual = {
            acceptA: data[0].headers.Accept,
            acceptB: data[1].headers.Accept,
            fromA:   data[0].headers.From,
            fromB:   data[1].headers.From,
            paramsA: data[0].args,
            paramsB: data[1].args,
            };
         const expected = {
            acceptA: 'application/json',
            acceptB: 'application/json',
            fromA:   'aaa@example.com',
            fromB:   'bbb@example.com',
            paramsA: { planet: 'Venus' },
            paramsB: { planet: 'Earth' },
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const promiseA = fetchJsonA.get(url, { planet: 'Venus' });
      const promiseB = fetchJsonB.get(url, { planet: 'Earth' });
      Promise.all([promiseA, promiseB]).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the HTTP method is missing', (done) => {
      const exception = /^Error: .fetch-json. HTTP method missing or invalid$/;
      const makeBogusRequest = () => fetchJson.request(null, 'http://example.com');
      assert.throws(makeBogusRequest, exception);
      done();
      });

   it('when the HTTP method is invalid', (done) => {
      const exception = /^Error: .fetch-json. HTTP method missing or invalid$/;
      const makeBogusRequest = () => fetchJson.request(Infinity, 'http://example.com');
      assert.throws(makeBogusRequest, exception);
      done();
      });

   it('for a bogus protocol', (done) => {
      const handleError = (error) => {
         const actual = {
            object:  error.constructor.name,
            name:    error.name,
            message: /Network request failed|cannot load/.test(error.message) || error.message,
            };
         const expected = {
            object:  'TypeError',
            name:    'TypeError',
            message: true,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get('bogus://example.com').catch(handleError);
      });

   it('for a bogus domain', (done) => {
      const specEnv = typeof JSDOM === 'function' ? 'jsdom' : 'node';
      const message = {
         jsdom: 'Network request failed',
         node:  'request to https://bogus.bogus/ failed, reason: getaddrinfo ENOTFOUND bogus.bogus',
         };
      const handleError = (error) => {
         const actual =   { message: error.message };
         const expected = { message: message[specEnv] };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get('https://bogus.bogus').catch(handleError);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
});
