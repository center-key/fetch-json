// Mocha Specification Suite
// Run in jsdom (a headless web browser) with whatwg-fetch polyfill

// WARNING:
// Run this specification suite in isolation.  This file imports JSDOM, which overwrites some
// native node.js functions with polyfills.

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { JSDOM, VirtualConsole } from 'jsdom';
import assert from 'node:assert';
import fs     from 'node:fs';

// JSDOM Virtual Console
const expectedErrors = [
   'TypeError [ERR_INVALID_PROTOCOL]: Protocol "bogus:" not supported. Expected "http:"',
   'Error: getaddrinfo ENOTFOUND bogus.bogus',
   ];
const logMessage = (error) => '      Verified message -- ' + error.message;
const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) =>
   console.info(expectedErrors.includes(error.message) ? logMessage(error) : error.stack));
virtualConsole.forwardTo(console);

// Setup
const mode =       { spec: 'jsdom', type: 'Minified', file: 'dist/fetch-json.min.js' };
const filename =   import.meta.url.replace(/.*\//, '');  //jshint ignore:line
const dom =        new JSDOM('', { runScripts: 'outside-only', virtualConsole: virtualConsole });
const scripts =    ['node_modules/whatwg-fetch/dist/fetch.umd.js', mode.file];
const loadScript = (file) => dom.window.eval(fs.readFileSync(file, 'utf-8'));
scripts.forEach(loadScript);
const { fetchJson, FetchJson } = dom.window;

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {
// Synchronize all changes below this line with the suite in: node.spec.js

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

   it('has functions for get(), query(), post(), put(), patch(), and delete()', () => {
      const actual = {
         get:    typeof fetchJson.get,
         query:  typeof fetchJson.query,
         post:   typeof fetchJson.post,
         put:    typeof fetchJson.put,
         patch:  typeof fetchJson.patch,
         delete: typeof fetchJson.delete,
         };
      const expected = {
         get:    'function',
         query:  'function',
         post:   'function',
         put:    'function',
         patch:  'function',
         delete: 'function',
         };
      assertDeepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Nobel Prize API result for laureate #26 fetched by fetchJson.get()', () => {

   it('is Albert Einstein', (done) => {
      const url =    'https://api.nobelprize.org/2.0/laureates';
      const params = { ID: 26 };
      const handleData = (data) => {
         const laureate = data.laureates[0];
         const actual =   { id: laureate.id, name: laureate.fullName.en, birth: laureate.birth.date };
         const expected = { id: '26',        name: 'Albert Einstein',    birth: '1879-03-14' };
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
describe('GET response returned by HTTP echo service', () => {

   it('contains empty params when none are supplied', (done) => {
      const url = 'https://centerkey.com/rest/echo/';
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'GET',
            query:  '',
            params: {},
            body:   null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from the URL query string', (done) => {
      const url = 'https://centerkey.com/rest/echo/?planet=Jupiter&position=5';
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'GET',
            query:  'planet=Jupiter&position=5',
            params: { planet: 'Jupiter', position: '5' },
            body:   null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('contains the params from an object', (done) => {
      const url =    'https://centerkey.com/rest/echo/';
      const params = { planet: 'Jupiter', position: 5, tip: 'Big & -148°C' };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'GET',
            query:  'planet=Jupiter&position=5&tip=Big%20%26%20-148%C2%B0C',
            params: { planet: 'Jupiter', position: '5', tip: 'Big & -148°C' },
            body:   null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   it('contains the params from both the URL query string and an object', (done) => {
      const url =    'https://centerkey.com/rest/echo/?sort=diameter';
      const params = { planet: 'Jupiter', position: 5 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'GET',
            query:  'sort=diameter&planet=Jupiter&position=5',
            params: { sort: 'diameter', planet: 'Jupiter', position: '5' },
            body:   null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Response returned by HTTP echo service for a planet (object literal)', () => {

   it.skip('from a QUERY contains the planet (JSON)', (done) => {
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Pluto', position: 9 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'QUERY',
            query:  '',
            params: {},
            body:   resource,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.query(url, resource).then(handleData);
      });

   it('from a POST contains the planet (JSON)', (done) => {
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Mercury', position: 1 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'POST',
            query:  '',
            params: {},
            body:   resource,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.post(url, resource).then(handleData);
      });

   it('from a PUT contains the planet (JSON)', (done) => {
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Venus', position: 2 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'PUT',
            query:  '',
            params: {},
            body:   resource,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.put(url, resource).then(handleData);
      });

   it('from a PATCH contains the planet (JSON)', (done) => {
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Mars', position: 4 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'PATCH',
            query:  '',
            params: {},
            body:   resource,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.patch(url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('HEAD response for a Figy Berry from the PokéAPI', () => {

   const conditionalIt = mode.spec === 'jsdom' ? it.skip : it;
   // TODO: Breaks with jsdom v28.0 as response.text() returns Promise<string> with garbled string.
   // See: https://github.com/jsdom/jsdom/pull/4033 and https://github.com/jsdom/jsdom/releases/tag/28.1.0

   conditionalIt('contains the correct headers', (done) => {
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
      const url =    'https://centerkey.com/rest/echo/';
      const params = { planet: 'Neptune', position: 8 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'GET',
            query:  'planet=Neptune&position=8',
            params: { planet: 'Neptune', position: '8' },
            body:   null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('GET', url, params).then(handleData);
      });

   it('can successfully POST a planet', (done) => {
      const url =      'https://centerkey.com/rest/echo/';
      const resource = { name: 'Saturn', position: 6 };
      const handleData = (actual) => {
         delete actual.headers;
         const expected = {
            method: 'POST',
            query:  '',
            params: {},
            body:   resource,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.request('POST', url, resource).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('HTTP error returned by the server', () => {

   it('for status 500 contains the text "Internal Server Error"', (done) => {
      const url = 'https://centerkey.com/rest/status/500/';  //mock server error
      const handleData = (actual) => {
         if (mode.spec === 'jsdom') actual.details.cause = '[HTTP 500 - Internal Server Error]';  //WORKAROUND
         // TODO: actual.bodyText is garbled with jsdom v28.0 as response.text() returns Promise<string> with garbled string.
         // See: https://github.com/jsdom/jsdom/pull/4033 and https://github.com/jsdom/jsdom/releases/tag/28.1.0
         delete actual.bodyText;
         delete actual.response;
         const expected = {
            http:        'GET https://centerkey.com/rest/status/500/',
            error:       true,
            ok:          false,
            status:      500,
            message:     'Response not JSON',
            details:     { name: null, code: null, cause: '[HTTP 500 - Internal Server Error]' },
            contentType: 'text/plain;charset=UTF-8',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.enableLogger();
      fetchJson.get(url).then(handleData);
      });

   it('for status 418 contains the text "I\'m a teapot"', (done) => {
      const url = 'https://centerkey.com/rest/status/418/';  //trailing slash to prevent redirect
      const handleData = (actual) => {
         if (mode.spec === 'jsdom') actual.bodyText =      "[HTTP 418 - I'm a teapot]";  //WORKAROUND
         if (mode.spec === 'jsdom') actual.details.cause = "[HTTP 418 - I'm a teapot]";  //WORKAROUND
         // TODO: actual.bodyText is garbled with jsdom v28.0 as response.text() returns Promise<string> with garbled string.
         // See: https://github.com/jsdom/jsdom/pull/4033 and https://github.com/jsdom/jsdom/releases/tag/28.1.0
         console.info(actual.bodyText);
         delete actual.bodyText;
         delete actual.response;
         const expected = {
            http:        'GET https://centerkey.com/rest/status/418/',
            error:       true,
            ok:          false,
            status:      418,
            message:     'Response not JSON',
            details:     { name: null, code: null, cause: "[HTTP 418 - I'm a teapot]" },
            contentType: 'text/plain;charset=UTF-8',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('for status 202 contains the text "Accepted"', (done) => {
      const url = 'https://centerkey.com/rest/status/202/';
      const handleData = (actual) => {
         delete actual.bodyText;
         delete actual.response;
         const expected = {
            http:        'GET https://centerkey.com/rest/status/202/',
            error:       true,
            ok:          true,
            status:      202,
            message:     'Response not JSON',
            details:     { name: null, code: null, cause: '[HTTP 202 - Accepted]' },
            contentType: 'text/plain;charset=UTF-8',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.enableLogger();
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('The "bodyText" field of the object returned from requesting', () => {

   it('an HTML web page is a string that begins with "<!doctype html>"', (done) => {
      const url = 'https://pretty-print-json.js.org';
      const handleData = (data) => {
         const actual = {
            ok:          data.ok,
            status:      data.status,
            contentType: data.contentType,
            firstLine:   data.details.cause,
            data:        data.data,
            };
         const expected = {
            ok:          true,
            status:      200,
            contentType: 'text/html; charset=utf-8',
            firstLine:   '<!doctype html>',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   it('an XML document is a string that begins with the <?xml> tag', (done) => {
      const url = 'https://centerkey.com/rest/echo/';
      const handleData = (actual) => {
         delete actual.bodyText;
         delete actual.response;
         const expected = {
            http:        'GET https://centerkey.com/rest/echo/',
            error:       true,
            ok:          true,
            status:      200,
            message:     'Response not JSON',
            details:     { name: null, code: null, cause: '<?xml version="1.0" encoding="utf-8"?>' },
            contentType: 'application/xml',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const getXml = { headers: { accept: 'application/xml' }};
      fetchJson.get(url, {}, getXml).then(handleData);
      });

   it('a plain text file is a string with the correct first word', (done) => {
      const url = 'https://centerkey.com/rest/echo/';
      const handleData = (actual) => {
         delete actual.bodyText;
         delete actual.response;
         const expected = {
            http:        'GET https://centerkey.com/rest/echo/',
            error:       true,
            ok:          true,
            status:      200,
            message:     'Response not JSON',
            details:     { name: null, code: null, cause: '{' },
            contentType: 'text/plain;charset=UTF-8',
            data:        null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      const getText = { headers: { accept: 'text/plain' }};
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
      fetchJson.disableLogger();
      const actual =   { logger: fetchJson.logger, disabled: !fetchJson.logger };
      const expected = { logger: null,             disabled: true };
      assertDeepStrictEqual(actual, expected);
      });

   it('passes a timestamp, methed, and URL to a custom logger on GET', (done) => {
      const url =       'https://centerkey.com/rest/echo/';
      const headerMap = fetchJson.getLogHeaderIndexMap();
      const rawEvents = [];
      const toEvent = (rawEvent, index) => ({
         event:     index,
         timestamp: rawEvent[headerMap.timestamp].length,
         http:      rawEvent[headerMap.http],
         method:    rawEvent[headerMap.method],
         domain:    rawEvent[headerMap.domain],
         url:       rawEvent[headerMap.url],
         ok:        rawEvent[headerMap.ok],
         status:    rawEvent[headerMap.status],
         type:      rawEvent[headerMap.type],
         });
      const verifyEvents = () => {
         fetchJson.disableLogger();
         const actual = rawEvents.map(toEvent);
         const expected = [
            {
               event:     0,
               timestamp: 24,
               http:      'request',
               method:    'GET',
               domain:    'centerkey.com',
               url:       'https://centerkey.com/rest/echo/',
               ok:        undefined,
               status:    undefined,
               type:      undefined,
               },
            {
               event:     1,
               timestamp: 24,
               http:      'response',
               method:    'GET',
               domain:    'centerkey.com',
               url:       'https://centerkey.com/rest/echo/',
               ok:        true,
               status:    200,
               type:      'application/json',
               },
            ];
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.enableLogger((...rawEvent) => rawEvents.push(rawEvent));
      fetchJson.get(url).then(verifyEvents);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Base options', () => {

   it('can be set to automatically add an "Authorization" HTTP header', (done) => {
      const url =         'https://centerkey.com/rest/echo/';
      const baseOptions = { headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } };
      const options =     { referrerPolicy: 'no-referrer' };
      fetchJson.setBaseOptions(baseOptions);
      const handleData = (actual) => {
         actual.auth = actual.headers.Authorization ?? null;
         delete actual.headers;
         const expected = {
            auth:   'Basic WE1MIGlzIGhpZGVvdXM=',
            method: 'GET',
            query:  'planet=Mars',
            params: { planet: 'Mars' },
            body:    null
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, { planet: 'Mars' }, options).then(handleData);
      });

   it('can be cleared', (done) => {
      const url = 'https://centerkey.com/rest/echo/';
      fetchJson.setBaseOptions({});
      const handleData = (actual) => {
         actual.auth = actual.headers.Authorization ?? null;
         delete actual.headers;
         const expected = {
            auth:   null,
            method: 'GET',
            query:  'planet=Mercury',
            params: { planet: 'Mercury' },
            body:    null
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, { planet: 'Mercury' }).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('FetchJson class instances', () => {

   it('can each set different base options', (done) => {
      const url =          'https://centerkey.com/rest/echo/';
      const baseOptionsA = { headers: { from: 'aaa@example.com' } };
      const baseOptionsB = { headers: { from: 'bbb@example.com' } };
      const fetchJsonA =   new FetchJson(baseOptionsA).fetchJson;
      const fetchJsonB =   new FetchJson(baseOptionsB).fetchJson;
      const handleData = (actual) => {
         actual.push([actual[0].headers.from, actual[1].headers.from]);
         delete actual[0].headers;
         delete actual[1].headers;
         const expected = [
            {
               method: 'GET',
               query:  'planet=Venus',
               params: { planet: 'Venus' },
               body:   null
               },
            {
               method: 'GET',
               query:  'planet=Earth',
               params: { planet: 'Earth' },
               body:   null
               },
            ['aaa@example.com', 'bbb@example.com'],
            ];
         assertDeepStrictEqual(actual, expected, done);
         };
      const promiseA = fetchJsonA.get(url, { planet: 'Venus' });
      const promiseB = fetchJsonB.get(url, { planet: 'Earth' });
      Promise.all([promiseA, promiseB]).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
describe('Correct error is thrown or returned', () => {

   it('when the HTTP method is missing', () => {
      const makeBogusRequest = () =>
         fetchJson.request(null, 'http://example.com');
      const exception = { message: '[fetch-json] HTTP method missing or invalid.' };
      assert.throws(makeBogusRequest, exception);
      });

   it('when the HTTP method is invalid', () => {
      const makeBogusRequest = () =>
         fetchJson.request(Infinity, 'http://example.com');
      const exception = { message: '[fetch-json] HTTP method missing or invalid.' };
      assert.throws(makeBogusRequest, exception);
      });

   it('when the HTTP domain is bogus', (done) => {
      const url =     'https://bogus-domain.invalid/api/';
      const cause =   'Error: getaddrinfo ENOTFOUND bogus-domain.invalid';
      const isJsdom = mode.spec === 'jsdom';
      const handleData = (actual) => {
         const expected = {
            http:        'GET https://bogus-domain.invalid/api/',
            error:       true,
            ok:          false,
            status:      499,
            message:     'Fetch API exception',
            details:     { name: 'TypeError', code: null, cause: isJsdom ? null : cause },
            contentType: null,
            bodyText:    `TypeError: ${isJsdom ? 'Network request failed' : 'fetch failed'}`,
            data:        null,
            response:    null,
            };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url).then(handleData);
      });

   });

////////////////////////////////////////////////////////////////////////////////
});
