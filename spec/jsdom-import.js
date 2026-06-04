#!/usr/bin/env node

// HTTP response headers are destroyed if "import" statement is uncommented.
//    $ node spec/jsdom-import.js

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
