# fetch-json
<img src=https://raw.githubusercontent.com/center-key/fetch-json/main/src/website/logos.png
   align=right width=180 alt=logos>

_A wrapper around Fetch just for JSON_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/fetch-json/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/fetch-json.svg)](https://www.npmjs.com/package/fetch-json)
[![Build](https://github.com/center-key/fetch-json/actions/workflows/run-spec-on-push.yaml/badge.svg)](https://github.com/center-key/fetch-json/actions/workflows/run-spec-on-push.yaml)
[![Publish Website](https://github.com/center-key/fetch-json/actions/workflows/publish-website.yaml/badge.svg)](https://github.com/center-key/fetch-json/actions/workflows/publish-website.yaml)

Why would you fetch anything but json? ;)

## A) Make REST Easy
**fetch-json** is a lightweight JavaScript library to reduce the boilerplate code needed to make
HTTP calls to JSON endpoints.
The minified JS file is under 4 KB.

**fetch-json** automatically:  <!-- sync with src/website/index.html -->
1. Adds the HTTP header `content-type: application/json` to ensure the correct data type
1. Runs `.json()` on the response
1. Serializes the body payload with `JSON.stringify()`
1. Appends `params` to the URL of `GET` requests
1. Sets `credentials` to `'same-origin'` (support user sessions in frameworks like Grails, Rails, PHP, Django, Flask, etc.)
1. Converts the HTTP text response to JSON if it's not already JSON (convenient for handling HTTP errors)
1. Maps HTTP response headers from a `HEAD` request into a simple object

**fetch-json** is ideal for a [JAMstack](https://jamstack.org) architecture  where "dynamic
programming during the request/response cycle is handled by JavaScript, running entirely on the
client".

## B) Setup
### 1. Web browser
In a web page:
```html
<script src=fetch-json.min.js></script>
```
or from the [jsdelivr.com CDN](https://www.jsdelivr.com/package/npm/fetch-json):
```html
<script src=https://cdn.jsdelivr.net/npm/fetch-json@3.5/dist/fetch-json.min.js></script>
```
### 2. Node.js server
Install package for node:
```shell
$ npm install fetch-json
```
and then import:
```javascript
import { fetchJson } from 'fetch-json';
```

## C) Examples
### 1. HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APoD
const url =    'https://api.nasa.gov/planetary/apod';
const params = { api_key: 'DEMO_KEY', count: 1 };
const handleData = (data) =>
   console.info('The NASA APoD for today is at:', data[0]?.url);
fetchJson.get(url, params).then(handleData);
```
Example output:
```
> The NASA APoD for today is at:
> https://apod.nasa.gov/apod/image/2107/LRVBPIX3M82Crop1024.jpg
```
### 2. HTTP POST
Create a resource for the planet Jupiter:
```javascript
// Create Jupiter
const url =      'https://centerkey.com/rest/echo/';
const resource = { name: 'Jupiter', position: 5 };
const handleData = (data) =>
   console.info('New planet:', data);  //http response body as an object literal
fetchJson.post(url, resource).then(handleData);
```
For more examples, see the Mocha specification suite:<br>
[spec/node.spec.js](spec/node.spec.js)
([Mocha output for each **build** under `Run npm test`](https://github.com/center-key/fetch-json/actions/workflows/run-spec-on-push.yaml))

To see a website that incorporates **fetch-json**, check out DataDashboard:<br>
[data-dashboard.js.org 📊](https://data-dashboard.js.org)

### 3. Error Handling
Fetch from a test endpoint that responds with an HTTP error:
```javascript
// handle HTTP status code 500
const url = 'https://centerkey.com/rest/status/500/';  //mock server error
const handleData = (data) => {
   if (data.error)
      console.error('HTTP Status Code:', data.status, data);
   else
      console.info('Valid JSON Data:', data);
   };
fetchJson.get(url).then(handleData);
```
Example output:
```javascript
"HTTP Status Code:" 500
{
   error: true,
   ok: false,
   status: 500,
   message: 'Response not JSON',
   contentType: 'text/plain;charset=UTF-8',
   bodyText: 'Internal Server Error',
   response: {
      status: 500,
      headers: Headers {
         'access-control-allow-origin': '*',
         'content-type': 'text/plain;charset=UTF-8',
         'cache-control': 'public, max-age=30',
      },
      ok: false,
      url: 'https://centerkey.com/rest/status/500/'
   }
}
```
If the endpoint is expected to return JSON, check the `error` field.&nbsp;
If the endpoint is expected to return text, CSV, XML, or HTML, check the `ok` field
or `status` field and read the payload from the `bodyText` field.

### 4. Fetch Timeout
Example of using `AbortSignal` to set a timeout in the Fetch options:
```javascript
// Force a timeout error by waiting for only 1 ms
const url =         'https://dna-dom.org/api/books/';
const abortSignal = globalThis.AbortSignal.timeout(1);  //maximum impatience
const handleData = (data) =>
   console.info('Haste makes waste:', data);
fetchJson.get(url, {}, { signal: abortSignal }).then(handleData);
```
Output:
```javascript
"Haste makes waste:" {
   http: 'GET https://dna-dom.org/api/books/',
   error: true,
   ok: false,
   status: 499,
   message: 'Fetch API exception',
   details: {
      name: 'TimeoutError',
      code: 23,
      cause: null
   },
   contentType: null,
   bodyText: 'TimeoutError: The operation was aborted due to timeout',
   data: null,
   response: null
}
```
Check the `details.name` field to verify the exception type.

## D) Examples Using async/await
### 1. HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APoD
const show = async () => {
   const url =    'https://api.nasa.gov/planetary/apod';
   const params = { api_key: 'DEMO_KEY', count: 1  };
   const data =   await fetchJson.get(url, params);
   console.info('The NASA APoD for today is at:', data[0]?.url);
   };
show();
```
### 2. HTTP POST
Create a resource for the planet Jupiter:
```javascript
// Create Jupiter
const url = 'https://centerkey.com/rest/echo/';
const create = async (resource) => {
   const data = await fetchJson.post(url, resource);
   console.info('New planet:', data);  //http response body as an object literal
   };
create({ name: 'Jupiter', position: 5 });
```

## E) Leverages Fetch API
**fetch-json** calls the native
**[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**.

For comparison, the POST example in section [C) Examples](#c-examples) to create a planet would be
done calling the **Fetch API**
directly with the code:
```javascript
// Create Jupiter (WITHOUT fetch-json)
const url =      'https://centerkey.com/rest/echo/';
const resource = { name: 'Jupiter', position: 5 };
const options = {
   method: 'POST',
   headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      },
   body: JSON.stringify(resource),
   };
const handleData = (data) =>
   console.info(data);  //http response body as an object literal
fetch(url, options)
   .then(response => response.json())
   .then(handleData);
```
The example _with_ **fetch-json** and the example _without_ **fetch-json** each produce the same
output.

## F) API
### 1. API &mdash; HTTP Request
The format for using **fetch-json** is:
#### GET
```javascript
fetchJson.get(url, params, options).then(callback);
```
#### QUERY
```javascript
fetchJson.query(url, query, options).then(callback);
```
#### POST
```javascript
fetchJson.post(url, resource, options).then(callback);
```
#### PUT
```javascript
fetchJson.put(url, resource, options).then(callback);
```
#### PATCH
```javascript
fetchJson.patch(url, resource, options).then(callback);
```
#### DELETE
```javascript
fetchJson.delete(url, resource, options).then(callback);
```
#### HEAD (HTTP response headers)
```javascript
fetchJson.head(url, params, options).then(callback);  //headers returned as an object
```
Notes:
1. Only the `url` parameter is required.&nbsp; The other parameters are optional.
1. The `params` object for `fetchJson.get()` is converted into a query string and appended to the `url`.
1. The `query` or `resource` object is turned into the body of the HTTP request.
1. The `options` parameter is passed through to the **Fetch API** (see the `init` [documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)).

#### Dynamic HTTP method
If you need to programmatically set the method, use the format:
```javascript
fetchJson.request(method, url, data, options).then(callback);
```
Where `method` is `'GET'`, `'QUERY'`, `'POST'`, `'PUT'`, `'PATCH'`, or `'DELETE'`, and `data`
represents the `params`, `query`, or `resource`.

### 2. API &mdash; logging
Turn on basic logging to the console with:
```javascript
fetchJson.enableLogger();
```
To use a custom logger, pass in a function that accepts 9 parameters to log.

To get an array containing the names of the parameters:
```javascript
fetchJson.getLogHeaders();
// 'Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Type'
```
The default console output looks like:<br>
`2018-09-12T07:20:12.372Z – "request" - "GET" – "api.nasa.gov" – "https://api.nasa.gov/planetary/apod"`<br>
`2018-09-12T07:20:13.009Z – "response" - "GET" – "api.nasa.gov" – "https://api.nasa.gov/planetary/apod" - true - 200 - "application/json"`

Turn off logging with:
```javascript
fetchJson.enableLogger();
```

## G) Response Text and Errors Converted to JSON

> [!NOTE]
> **Protocol-Level vs. Application Level**<br>
> HTTP status codes are a mess.&nbsp;
> This is not an opinion &mdash; it's a fact.&nbsp;
> This fact is proven out by the large number of HTTP status code questions on Stack overflow with multiple very popular directly conflicting answers.&nbsp;
> The mutually exclusive answers will often each have hundreds of upvotes.&nbsp;
> At its core this problem is due to the impedance mismatch between protocol-level status and application-level status.&nbsp;
> The "P" in HTTP stands for protocol, and it's the wrong level to pass application level status codes.&nbsp;
> Applications cannot reasonably be expected to conform to a fixed set of status codes defined back in the 1990s.
>
> **fetch-json** returns the requested data as a simple object (JavaScript Object Literal) for any JSON response with an HTTP status code of `200`.&nbsp;
> All other responses are wrapped into a simple object so it’s straightforward to analyze the HTTP status code, `"content-type"` header, response `"ok"` field, and body payload as needed.

The HTTP response body is considered to be JSON if the `content-type` is
`"application/json"` or `"text/javascript"`.&nbsp;
If the HTTP response body is not JSON, **fetch-json** passes back
through the promise an object with a `bodyText` string field containing response body text.

In addition to the `bodyText` field, the object will have the fields: `ok`, `status`,
`contentType`, and `data`.&nbsp;
If an HTML error response is JSON, the `data` will contain the parsed JSON.

For example, an HTTP response for an error status of 500 would be converted to an object
similar to:
```javascript
{
   error:       true,
   ok:          false,
   status:      500,  //INTERNAL SERVER ERROR
   message:     'Response not JSON',
   contentType: 'text/html; charset=utf-8',
   bodyText:    '<!doctype html><html lang=en><body>Server Error</body></html>',
   data:        null,
}
```
Every response that is not JSON or is an HTTP error will be consistently formatted like the object above.&nbsp;
With **fetch-json** you know the response will always be passed back to you as a consistent,
simple object literal.

## H) Base Options
Use `fetchJson.setBaseOptions()` to configure options to be used on future **fetchJson** requests.

The example below sets the `Authorization` HTTP header so it is sent on the subsequent GET and
DELETE requests:
```javascript
const url = 'https://dna-dom.org/api/books/3';
fetchJson.setBaseOptions({ headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } });
fetchJson.get(url).then(display);  //with auth header
fetchJson.delete(url);             //with auth header
```

To have multiple base options available at the same time, use the `FetchJson` class to instantiate
multiple copies of `fetchJson`:
```javascript
import { FetchJson } from 'fetch-json';

const fetchJsonA = new FetchJson({ headers: { from: 'aaa@example.com' } }).fetchJson;
const fetchJsonB = new FetchJson({ headers: { from: 'bbb@example.com' } }).fetchJson;
const url = 'https://dna-dom.org/api/books/3';
fetchJsonA.get(url).then(display);  //"from: aaa@example.com"
fetchJsonB.delete(url);             //"from: bbb@example.com"
```

## I) TypeScript
See the TypeScript declarations at the top of the [fetch-json.ts](src/fetch-json.ts) file.

The declarations provide type information about the API.&nbsp;
For example, the `fetchJson.post()` function returns a **Promise** for a `FetchResponse`:
```typescript
fetchJson.post(url: string, resource?: RequestData,
   options?: FetchOptions): Promise<FetchResponse>
```

Example TypeScript for fetching a library book:
```typescript
import { fetchJson, FetchJsonErrorResponse } from 'fetch-json';
type Book = {
   id:     number,
   title:  string,
   author: string,
   };

const url1 = 'https://dna-dom.org/api/books/3';
const handleData = (data: Book | FetchJsonErrorResponse) => {
   const response = <FetchJsonErrorResponse>data;
   const book =     <Book>data;
   if (response.error)
      console.error('HTTP Status Code:', response.status, data);
   else
      console.info('Book Resource:', book);
   };
fetchJson.get(url).then(handleData);
```

## J) Add Fetch to JSDOM
JSDOM does not include `fetch` by default, so you need to add a polyfill.
```shell
$ npm install --save-dev whatwg-fetch
```
Tell JSDOM to load and run the polyfill file:<br>
`node_modules/whatwg-fetch/dist/fetch.umd.js`

For a full example, see the usage of `whatwg-fetch` in [spec/jsdom.spec.js](spec/jsdom.spec.js).

<br>

---
[MIT License](LICENSE.txt)

[🛡️ npm Security Aggregator](https://center-key.github.io/npm-security-aggregator/?package=fetch-json)

See the `runScriptsConfig` section of [`package.json`](package.json) for a clean way to organize build tasks:
   - 🎋 [`add-dist-header`](https://github.com/center-key/add-dist-header) &mdash;&nbsp; _Prepend a one-line banner comment (with license notice) to distribution files_
   - 📄 [`copy-file-util`](https://github.com/center-key/copy-file-util) &mdash;&nbsp; _Copy or rename a file with optional package version number_
   - 📂 [`copy-folder-util`](https://github.com/center-key/copy-folder-util) &mdash;&nbsp; _Recursively copy files from one folder to another folder_
   - 🪺 [`recursive-exec`](https://github.com/center-key/recursive-exec) &mdash;&nbsp; _Run a command on each file in a folder and its subfolders_
   - 🔍 [`replacer-util`](https://github.com/center-key/replacer-util) &mdash;&nbsp; _Find and replace strings or template outputs in text files_
   - 🔢 [`rev-web-assets`](https://github.com/center-key/rev-web-assets) &mdash;&nbsp; _Revision web asset filenames with cache busting content hash fingerprints_
   - 🚆 [`run-scripts-util`](https://github.com/center-key/run-scripts-util) &mdash;&nbsp; _Organize npm package.json scripts into groups of easy-to-manage commands_
   - 🚦 [`w3c-html-validator`](https://github.com/center-key/w3c-html-validator) &mdash;&nbsp; _Check the markup validity of HTML files using the W3C validator_
