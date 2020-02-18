# fetch-json
<img src=https://raw.githubusercontent.com/center-key/fetch-json/master/docs/logos.png
   align=right width=180 alt=logos>

_A wrapper around Fetch just for JSON_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/fetch-json/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/fetch-json.svg)](https://www.npmjs.com/package/fetch-json)
[![Vulnerabilities](https://snyk.io/test/github/center-key/fetch-json/badge.svg)](https://snyk.io/test/github/center-key/fetch-json)
[![Build](https://travis-ci.org/center-key/fetch-json.svg)](https://travis-ci.org/center-key/fetch-json)

Why would you fetch anything but json? ;)

## 1) Setup
### Browser
In a web page:
```html
<script src=fetch-json.min.js></script>
```
or from the [jsdelivr.com CDN](https://www.jsdelivr.com/package/npm/fetch-json):
```html
<script src=https://cdn.jsdelivr.net/npm/fetch-json@2.2/dist/fetch-json.min.js></script>
```
### node
Install package:
```shell
$ npm install node-fetch fetch-json
```
and then import:
```javascript
const fetchJson = require('fetch-json');
```

## 2) Examples
### HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APoD
const url =    'https://api.nasa.gov/planetary/apod';
const params = { api_key: 'DEMO_KEY' };
const handleData = (data) =>
   console.log('The NASA APoD for today is at: ' + data.url);
fetchJson.get(url, params).then(handleData);
```
### HTTP POST
Create a resource for the planet Jupiter:
```javascript
// Create Jupiter
const resource = { name: 'Jupiter', position: 5 };
const handleData = (data) =>
   console.log('Planet:', data);  //http response body as an object literal
fetchJson.post('https://httpbin.org/post', resource)
   .then(handleData)
   .catch(console.error);
```
For more examples, see the Mocha specification cases:<br>
[spec-node.js](spec-node.js) ([Mocha output on Travis CI](https://travis-ci.org/center-key/fetch-json))

To see a website that incorporates **fetch-json**, check out DataDashboard:<br>
[https://data-dashboard.js.org](https://data-dashboard.js.org)

## 3) Leverages the Fetch API and node-fetch
**fetch-json** calls the native
**[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**
if in a web browser and calls
**[node-fetch](https://www.npmjs.com/package/node-fetch)**
if running on node.

For comparison, the above POST example to create a planet would be done calling the **Fetch API**
directly with the code:
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
const handleData = (data) =>
   console.log(data);  //http response body as an object literal
fetch('https://httpbin.org/post', options)
   .then(response => response.json())
   .then(handleData)
   .catch(console.error);
```
The examples for **fetch-json** and the **Fetch API** each produce the same output.

## 4) Details
**fetch-json** makes REST easy &mdash; it automatically:
1. Converts the HTTP response to JSON if it's not already JSON (convenient for HTTP errors)
1. Serializes the body payload with `JSON.stringify()`
1. Adds the `application/json` HTTP header to set the data type
1. Appends the GET `params` object items to the URL
1. Runs `.json()` on the response
1. Sets `credentials` to `'same-origin'` (support user sessions in Grails, Rails, PHP, Django, Flask, etc.)

**fetch-json** is ideal for a [JAMstack](https://jamstack.org) architecture  where "dynamic
programming during the request/response cycle is handled by JavaScript, running entirely on the
client".

## 5) API
### API &mdash; HTTP Request
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
1. The `options` parameter is passed through to the **Fetch API** (see the `init` [documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)).
1. `options` is enhanced with a boolean setting for `strictErrors` mode (default `false`) that throws an error to `.catch()` whenever the HTTP response status is 400 or higher.

#### Dynamic HTTP method
If you need to programmatically set the method, use the format:
```javascript
fetchJson.request(method, url, data, options).then(callback);
```
Where `method` is `'GET'`, `'POST'`, `'PUT'`, `'PATCH'`, or `'DELETE'`, and `data` represents
either `params` or `resource`.

### API &mdash; Logging
Enable basic logging to the console with:
```javascript
fetchJson.enableLogger();
```
To use a custom logger, pass in a function that accepts 9 parameters to log.
To disable logging, pass in `false`.

To get an array containing the names of the parameters:
```javascript
fetchJson.getLogHeaders();
```
The default console output looks like:<br>
`2018-09-12T07:20:12.372Z – "request" - "GET" – "api.nasa.gov" – "https://api.nasa.gov/planetary/apod"`<br>
`2018-09-12T07:20:13.009Z – "response" - "GET" – "api.nasa.gov" – "https://api.nasa.gov/planetary/apod" - true - 200 - "OK" - "application/json"`

## 6) Response text converted to JSON
The HTTP response body is considered to be JSON if the `Content-Type` is `"application/json"` or
`"text/javascript"`.&nbsp; If the HTTP response body is not JSON, **fetch-json** passes back
through the promise an object with a `bodyText` string field containing response body text.

In addition to the `bodyText` field, the object will have the fields: `ok`, `status`, `statusText`,
and `contentType`.

For example, an HTTP response for an error status of 500 would be converted to an object
similar to:
```javascript
{
   ok:          false,
   status:      500,
   statusText:  'INTERNAL SERVER ERROR',
   contentType: 'text/html; charset=utf-8',
   bodyText:    '<!doctype html><html lang=en><body>Server Error</body></html>'
}
```
With **fetch-json**, you know the response body will always be passed back to you as a simple
object literal.

## 7) Legacy web browsers
To support really old browsers, include polyfills for
[Promise](https://github.com/taylorhakes/promise-polyfill/) and
[Fetch API](https://github.com/github/fetch):
```html
<script src=https://cdn.jsdelivr.net/npm/promise-polyfill@8.1/dist/polyfill.min.js></script>
<script src=https://cdn.jsdelivr.net/npm/whatwg-fetch@3.0/dist/fetch.umd.min.js></script>
```
**Note:**
JSDOM does not include `fetch`, so you need to add a polyfill (see usage of `whatwg-fetch` in
[spec/jsdom.js](spec/jsdom.js) and
[gulpfile.js](gulpfile.js).

## 8) Questions or enhancements
Feel free to submit an [issue](https://github.com/center-key/fetch-json/issues).

_"Stop trying to make fetch happen without [#fetchJson](https://twitter.com/hashtag/fetchJson)!"_

---
[MIT License](LICENSE.txt)
