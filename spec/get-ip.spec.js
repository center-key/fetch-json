// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import { fetchJson } from '../dist/fetch-json.js';

////////////////////////////////////////////////////////////////////////////////
describe('Fetching the public IP address', () => {

   it('returns a valid IPv4 value', (done) => {
      const url =    'https://api.ipify.org/';
      const params = { format: 'json' };
      const ipAddrPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      const handleData = (data) => {
         console.info(data);
         const actual =   { url: url, matches: ipAddrPattern.test(data.ip) };
         const expected = { url: url, matches: true };
         assertDeepStrictEqual(actual, expected, done);
         };
      fetchJson.get(url, params).then(handleData);
      });

   });
