#!/usr/bin/env node

// JSDOM loads polyfills that interferes with node's built-in fetch() function.
// Verified with JSDOM v29.1.1 and node v26.0.0 on macOS.
// Run:
//    $ npm list jsdom
//    $ node --version
//    $ node spec/jsdom-import.js

// HTTP response headers are destroyed if below "import" statement is uncommented.
// import { JSDOM } from 'jsdom';

console.info('JSDOM:', typeof JSDOM);

const url = 'https://centerkey.com/rest/echo/';
const handleResponse = (response) => {
   console.info('URL:',     url);
   console.info('OK:',      response.ok);
   console.info('Status:',  response.status);
   console.info('Headers:', Object.fromEntries(response.headers));  //importing JSDOM nukes the headers
   };
fetch(url, { method: 'GET' }).then(handleResponse);
