// Mocha Specification Cases

const fs =        require('fs');
const assert =    require('assert');
const { JSDOM } = require('jsdom');

const scripts = ['node_modules/whatwg-fetch/fetch.js', './browser-fetch-json.js'];
const window = new JSDOM('', { runScripts: 'outside-only' }).window;
function loadScript(file) { window.eval(fs.readFileSync(file).toString()); }
scripts.forEach(loadScript);
const fetchJson = window.fetchJson;

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Module browser-fetch-json', () => {

   it('loads as an object', () => {
      const actual =   typeof fetchJson;
      const expected = 'object';
      assert.equal(actual, expected);
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

   });
