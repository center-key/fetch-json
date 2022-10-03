// Mocha Specification Suite

// Imports
import { assertDeepStrictEqual } from 'assert-deep-strict-equal';
import fs from 'fs';

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('The "dist" folder', () => {

   it('contains the correct files', () => {
      const actual = fs.readdirSync('dist').sort();
      const expected = [
         'fetch-json.d.ts',
         'fetch-json.dev.js',
         'fetch-json.js',
         'fetch-json.min.js',
         'fetch-json.umd.cjs',
         ];
      assertDeepStrictEqual(actual, expected);
      });

   });
