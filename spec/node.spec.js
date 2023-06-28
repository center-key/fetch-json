// Mocha Specification Suite
// Run on a node server

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import assert from 'assert';

// Setup
import { fetchJson, FetchJson } from '../dist/fetch-json.js';
const mode =     { type: 'ES Module', file: 'dist/fetch-json.js' };
const filename = import.meta.url.replace(/.*\//, '');  //jshint ignore:line

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {
// Synchronize all changes below this line with the suite in: jsdom.spec.js

////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////
describe('Star Wars API result for spaceships fetched by fetchJson.get()', () => {

   it('contains an array of spaceships', (done) => {

      const url =    'https://swapi.py4e.com/api/starships/';
      const params = { format: 'json' };
      const handleData = (data) => {
         const actual =   { count: typeof data.count, class: typeof data.results[0].starship_class };
         const expected = { count: 'number',          class: 'string' };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Awaiting a berry from the PokéAPI with fetchJson.get() [async/await]', () => {

   it('is rewarded with a tasty treat', async () => {
      const url =      'https://pokeapi.co/api/v2/berry/razz';
      const data =     await fetchJson.get(url);
      const actual =   { id: data.id, name: data.name, growth_time: data.growth_time };
      const expected = { id: 16,      name: 'razz',    growth_time: 2 };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('GET response returned by mockbin.org', () => {

   it('contains empty params when none are supplied', (done) => {
      const url = 'https://mockbin.org/request';
      const handleData = (data) => {
         const actual =   { method: data.method, params: data.queryString };
         const expected = { method: 'GET',       params: {} };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from the URL query string', (done) => {
      const url = 'https://mockbin.org/request?planet=Jupiter&position=5';
      const handleData = (data) => {
         const actual =   { method: data.method, params: data.queryString };
         const expected = { method: 'GET',       params: { planet: 'Jupiter', position: '5' } };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from an object', (done) => {
      const url =    'https://mockbin.org/request';
      const params = { planet: 'Jupiter', position: 5, tip: 'Big & -148°C' };
      const handleData = (data) => {
         const actual =   { method: data.method, params: data.queryString };
         const expected = { method: 'GET',       params: { planet: 'Jupiter', position: '5', tip: 'Big & -148°C' } };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   it('contains the params from both the URL query string and an object', (done) => {
      const url =    'https://mockbin.org/request?sort=diameter';
      const params = { planet: 'Jupiter', position: 5 };
      const handleData = (data) => {
         const actual =   { method: data.method, params: data.queryString };
         const expected = { method: 'GET',       params: { sort: 'diameter', planet: 'Jupiter', position: '5' } };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Response returned by mockbin.org for a planet (object literal)', () => {

   it('from a POST contains the planet (JSON)', (done) => {
      const url =      'https://mockbin.org/request';
      const resource = { name: 'Mercury', position: 1 };
      const handleData = (data) => {
         const json =     JSON.parse(data.postData.text);
         const actual =   { method: data.method, planet: json };
         const expected = { method: 'POST',      planet: resource };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.post(url, resource).then(handleData);
      });

   it('from a PUT contains the planet (JSON)', (done) => {
      const url =      'https://mockbin.org/request';
      const resource = { name: 'Venus', position: 2 };
      const handleData = (data) => {
         const json =     JSON.parse(data.postData.text);
         const actual =   { method: data.method, planet: json };
         const expected = { method: 'PUT',       planet: resource };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.put(url, resource).then(handleData);
      });

   it('from a PATCH contains the planet (JSON)', (done) => {
      const url =      'https://mockbin.org/request';
      const resource = { name: 'Mars', position: 4 };
      const handleData = (data) => {
         const json =     JSON.parse(data.postData.text);
         const actual =   { method: data.method, planet: json };
         const expected = { method: 'PATCH',     planet: resource };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.patch(url, resource).then(handleData);
      });

   it('from a DELETE contains the planet (JSON)', (done) => {
      const url =      'https://mockbin.org/request';
      const resource = { name: 'Jupiter', position: 5 };
      const handleData = (data) => {
         const json =     JSON.parse(data.postData.text);
         const actual =   { method: data.method, planet: json };
         const expected = { method: 'DELETE',    planet: resource };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.delete(url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('HEAD response for a Figy Berry from the PokéAPI', () => {

   it('contains the correct headers', (done) => {

      const url = 'https://pokeapi.co/api/v2/berry/figy';
      const handleData = (data) => {
         const actual = {
            'content-type':  data['content-type'],
            'cache-control': data['cache-control'],
            };
         const expected = {
            'content-type':  'application/json; charset=utf-8',
            'cache-control': 'public, max-age=86400, s-maxage=86400',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.head(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('The low-level fetchJson.request() function', () => {

   it('can successfully GET a planet', (done) => {
      const url =    'https://mockbin.org/request';
      const params = { planet: 'Neptune', position: 8 };
      const handleData = (data) => {
         const actual =   { method: data.method, params: data.queryString };
         const expected = { method: 'GET',       params: { planet: 'Neptune', position: '8' } };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('GET', url, params).then(handleData);
      });

   it('can successfully POST a planet', (done) => {
      const url =      'https://mockbin.org/request';
      const resource = { name: 'Saturn', position: 6 };
      const handleData = (data) => {
         const json =     JSON.parse(data.postData.text);
         const actual =   { method: data.method, planet: json };
         const expected = { method: 'POST',      planet: resource };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('POST', url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('HTTP error returned by the server', () => {

   it('for status 500 contains the message "Internal Server Error"', (done) => {
      const url = 'https://mockbin.org/status/500/Internal Server Error';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            error:       data.error,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            bodyText:    data.bodyText,
            data:        data.data,
            };
         const expected = {
            ok:          false,
            error:       true,
            status:      [500, 'Internal Server Error'],
            contentType: 'application/json; charset=utf-8',
            bodyText:    '{"code":"500","message":"Internal Server Error"}',
            data:        { code: '500', message: 'Internal Server Error' },
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const handleError = (error) => {
         assert.fail(error);
         };
      fetchJson.enableLogger();
      fetchJson.get(url).then(handleData).catch(handleError);
      });

   it('for status 500 throws exception in strict errors mode', (done) => {
      const url = 'https://mockbin.org/status/500';
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
            message: '[fetch-json] HTTP response status ("strictErrors" mode enabled): 500',
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, {}, { strictErrors: true }).then(handleData).catch(handleError);
      });

   it('for status 418 contains the message "I\'m a teapot"', (done) => {
      const url = 'https://centerkey.com/status/418/';  //trailing slash to prevent redirect
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            error:       data.error,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            data:        data.data,
            };
         const expected = {
            ok:          false,
            error:       true,
            status:      [418, "I'm a teapot"],
            contentType: 'text/plain',
            data:        null,
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

////////////////////////////////////////////////////////////////////////////////
describe('The "bodyText" field of the object returned from requesting', () => {

   const getFirstLine = (string) => string.split('\n', 1)[0];

   it('an HTML web page is a string that begins with "<!doctype html>"', (done) => {
      const url = 'https://pretty-print-json.js.org';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText),
            data:        data.data,
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/html; charset=utf-8',
            firstLine:   '<!doctype html>',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('an XML document is a string that begins with the <?xml> tag', (done) => {
      const url = 'https://mockbin.org/request';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstLine:   getFirstLine(data.bodyText),
            data:        data.data,
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'application/xml; charset=utf-8',
            firstLine:   '<?xml version="1.0"?>',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const getXml = { headers: { Accept: 'application/xml' }};
      fetchJson.get(url, {}, getXml).then(handleData);
      });

   it('a plain text file is a string with the correct first word', (done) => {
      const url = 'https://mockbin.org/request';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      [data.status, data.response.statusText],
            contentType: data.contentType,
            firstWord:   data.bodyText.split(' ', 1)[0],
            data:        data.data,
            };
         const expected = {
            ok:          true,
            status:      [200, 'OK'],
            contentType: 'text/plain; charset=utf-8',
            firstWord:   'startedDateTime:',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const getText = { headers: { Accept: 'text/plain' }};
      fetchJson.get(url, {}, getText).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
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
      const url =       'https://mockbin.org/request';
      const headerMap = fetchJson.getLogHeaderIndexMap();
      const rawEvents = [];
      const toEvent = (rawEvent, index) => ({
         event:     index,
         timestamp: rawEvent[headerMap.timestamp].length,
         method:    rawEvent[headerMap.method],
         domain:    rawEvent[headerMap.domain],
         url:       rawEvent[headerMap.url],
         ok:        rawEvent[headerMap.ok],
         status:    rawEvent[headerMap.status],
         text:      rawEvent[headerMap.text],
         type:      rawEvent[headerMap.type],
         });
      const verifyEvents = () => {
         fetchJson.enableLogger(false);
         const actual = rawEvents.map(toEvent);
         const expected = [
            {
               event:     0,
               timestamp: 24,
               method:    'GET',
               domain:    'mockbin.org',
               url:       'https://mockbin.org/request',
               ok:        undefined,
               status:    undefined,
               text:      undefined,
               type:      undefined,
               },
            {
               event:     1,
               timestamp: 24,
               method:    'GET',
               domain:    'mockbin.org',
               url:       'https://mockbin.org/request',
               ok:        true,
               status:    200,
               text:      'OK',
               type:      'application/json; charset=utf-8',
               },
            ];
         assertDeepStrictEqual(actual, expected);
         done();
         };
      fetchJson.enableLogger((...rawEvent) => rawEvents.push(rawEvent));
      fetchJson.get(url).then(verifyEvents);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Base options', () => {

   it('can be set to automatically add an "Authorization" HTTP header', (done) => {
      const url =         'https://mockbin.org/request';
      const baseOptions = { headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } };
      const options =     { referrerPolicy: 'no-referrer' };
      fetchJson.setBaseOptions(baseOptions);
      const handleData = (data) => {
         const actual = {
            auth:   data.headers.authorization,
            accept: data.headers.accept,
            params: data.queryString,
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
      const url =                 'https://mockbin.org/request';
      const previousBaseOptions = fetchJson.getBaseOptions();
      fetchJson.setBaseOptions({});
      const handleData = (data) => {
         const actual = {
            previous: previousBaseOptions,
            auth:     data.headers.authorization,
            accept:   data.headers.accept,
            params:   data.queryString,
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

////////////////////////////////////////////////////////////////////////////////
describe('FetchJson class instances', () => {

   it('can each set different base options', (done) => {
      const url =          'https://mockbin.org/request';
      const baseOptionsA = { headers: { From: 'aaa@example.com' } };
      const baseOptionsB = { headers: { From: 'bbb@example.com' } };
      const fetchJsonA =   new FetchJson(baseOptionsA).fetchJson;
      const fetchJsonB =   new FetchJson(baseOptionsB).fetchJson;
      const handleData = (data) => {
         const actual = {
            acceptA: data[0].headers.accept,
            acceptB: data[1].headers.accept,
            fromA:   data[0].headers.from,
            fromB:   data[1].headers.from,
            paramsA: data[0].queryString,
            paramsB: data[1].queryString,
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

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown', () => {

   it('when the HTTP method is missing', () => {
      const makeBogusRequest = () => fetchJson.request(null, 'http://example.com');
      const exception = { message: '[fetch-json] HTTP method missing or invalid.' };
      assert.throws(makeBogusRequest, exception);
      });

   it('when the HTTP method is invalid', () => {
      const makeBogusRequest = () => fetchJson.request(Infinity, 'http://example.com');
      const exception = { message: '[fetch-json] HTTP method missing or invalid.' };
      assert.throws(makeBogusRequest, exception);
      });

   it('when the HTTP protocol is bogus', (done) => {
      const specEnv = typeof JSDOM === 'function' ? 'jsdom' : 'node';
      const message = {
         jsdom: 'Network request failed',
         node:  'fetch failed',
         };
      const handleError = (error) => {
         const actual = {
            object:  error.constructor.name,
            name:    error.name,
            message: error.message,
            };
         const expected = {
            object:  'TypeError',
            name:    'TypeError',
            message:  message[specEnv],
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get('bogus://example.com').catch(handleError);
      });

   it('when the HTTP domain is bogus', (done) => {
      const specEnv = typeof JSDOM === 'function' ? 'jsdom' : 'node';
      const message = {
         jsdom: 'Network request failed',
         node:  'fetch failed',
         };
      const handleError = (error) => {
         const actual =   { message: error.message };
         const expected = { message: message[specEnv] };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get('https://bogus.bogus').catch(handleError);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
