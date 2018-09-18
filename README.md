# fetch-json
<img src=https://raw.githubusercontent.com/center-key/fetch-json/master/logos.png
   align=right width=200 alt=logos>

_A wrapper around Fetch just for JSON_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/fetch-json/blob/master/LICENSE.txt)
&nbsp;
[![npm](https://img.shields.io/npm/v/fetch-json2.svg)](https://www.npmjs.com/package/fetch-json2)
&nbsp;
[![Known Vulnerabilities](https://snyk.io/test/github/center-key/fetch-json/badge.svg)](https://snyk.io/test/github/center-key/fetch-json)
&nbsp;
[![Build Status](https://travis-ci.org/center-key/fetch-json.svg)](https://travis-ci.org/center-key/fetch-json)

Why would you fetch anything but json? ;)

### 1) Setup
#### Browser
In a web page:
```html
<script src=fetch-json.min.js></script>
```
or from the [jsdelivr.com CDN](https://www.jsdelivr.com/package/npm/fetch-json2):
```html
<script src=https://cdn.jsdelivr.net/npm/fetch-json2@0.3/fetch-json.min.js></script>
```
#### node
As a module:
```shell
$ npm install fetch-json2
```
Then import with the line:
```javascript
const fetchJson = require('fetch-json2');
```

### 2) Examples
#### HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APOD
const url =    'https://api.nasa.gov/planetary/apod';
const params = { api_key: 'DEMO_KEY' };
function handleData(data) {
   console.log('The NASA APOD for today is at: ' + data.url);
   }
fetchJson.get(url, params).then(handleData);
```
#### HTTP POST
Create a resource for the planet Jupiter:
```javascript
// Create Jupiter
const resource = { name: 'Jupiter', position: 5 };
function handleData(data) {
   console.log(data);  //HTTP response body as an object literal
   }
fetchJson.post('https://httpbin.org/post', resource)
   .then(handleData)
   .catch(console.error);
```
For more examples calls, see: [spec-node.js](spec-node.js) ([Mocha output](https://travis-ci.org/center-key/fetch-json))

### 3) Leverages the Fetch API
**fetch-json** calls the native
**[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**
if in a browser and calls
**[node-fetch](https://www.npmjs.com/package/node-fetch)**
if running on node.

For comparison, the above POST example to create a planet would be done directly using the **Fetch API** with the code:
```javascript
// Create Jupiter (with Fetch API instead of fetch-json)
const resource = { name: 'Jupiter', position: 5 };
const options = {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
   body: JSON.stringify(resource)
   };
function handleData(data) {
   console.log(data);  //HTTP response body as an object literal
   }
fetch('https://httpbin.org/post', options)
   .then(response => response.json())
   .then(handleData)
   .catch(console.error);
```
The examples for **fetch-json** and the **Fetch API** each produce the same output.

### 4) Details
The **fetch-json** module automatically:
1. Serializes the body payload with `JSON.stringify()`.
1. Adds the JSON data type (`'application/json'`) to the HTTP headers.
1. Builds the URL query string from the `params` object for GET requests.
1. Runs `.json()` on the response from the promise.
1. Sets `credentials` to `'same-origin'` to support user sessions for frameworks/servers such as Grails, Rails, PHP, Flask, etc.
1. If the response body is HTML or text, it's converted to JSON (makes it easier to handle HTTP error status codes).

### 5) API
The format for using **fetch-json** is:
#### GET
```javascript
fetchJson.get(url, params, options).then(callback);
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
Notes:
1. Only the `url` parameter is required.&nbsp; The other parameters are optional.
1. The `params` object for `fetchJson.get()` is converted into a query string and appended to the `url`.
1. The `resource` object is turned into the body of the HTTP request.
1. The `options` parameter is passed through to the **Fetch API** (see the MDN **Fetch API** documentation for supported **[`init` options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)**).

#### Dynamic HTTP method
If you need to programmatically set the method, use the format:
```javascript
fetchJson.request(method, url, data, options).then(callback);
```
Where `method` is `'GET'`, `'POST'`, `'PUT'`, `'PATCH'`, or `'DELETE'`, and `data` represents
either `params` or `resource`.

#### Logging
Enable basic logging to the console with:
```javascript
fetchJson.enableLogger();
```
Pass in a function to use a custom logger or pass in `false` to disable logging.

The default console output looks like:<br>
`2018-09-12T07:20:12.372Z – "GET" – "https://api.nasa.gov/planetary/apod"`

#### Text to JSON
If the HTTP response body is not JSON (`Content-Type` is not `"application/json"` or `"text/javascript"`), an object containing the body as a string in the `bodyText` field is created and passed on through the promise.&nbsp; In addition to the `bodyText` field, the object
will have the fields: `ok`, `status`, `statusText`, and `contentType`.

For example, an HTTP response for an error status of 500 would be converted to an object
similar to:
```javascript
{
   ok:          false,
   status:      500,
   statusText:  'INTERNAL SERVER ERROR',
   contentType: 'text/html; charset=utf-8',
   bodyText:    '<!doctype html><html><body>Server Error</body></html>'
}
```

### 6) Legacy web browsers
To support really old browsers, include polyfills for
[Promise](https://github.com/taylorhakes/promise-polyfill/) and
[Fetch API](https://github.com/github/fetch):
```html
<script src=https://cdn.jsdelivr.net/npm/promise-polyfill@8.1/dist/polyfill.min.js></script>
<script src=https://cdn.jsdelivr.net/npm/whatwg-fetch@2.0/fetch.min.js></script>
```

### 7) Questions or enhancements
Feel free to submit an [issue](https://github.com/center-key/fetch-json/issues).

---
[MIT License](LICENSE.txt)
