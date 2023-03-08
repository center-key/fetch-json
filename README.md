# fetch-json
<img src=https://raw.githubusercontent.com/center-key/fetch-json/main/docs/logos.png
   align=right width=180 alt=logos>

_A wrapper around Fetch just for JSON_

[![License:MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/center-key/fetch-json/blob/main/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/fetch-json.svg)](https://www.npmjs.com/package/fetch-json)
[![Size](https://badgen.net/bundlephobia/minzip/fetch-json)](https://bundlephobia.com/package/fetch-json)
[![Vulnerabilities](https://snyk.io/test/github/center-key/fetch-json/badge.svg)](https://snyk.io/test/github/center-key/fetch-json)
[![Build](https://github.com/center-key/fetch-json/workflows/build/badge.svg)](https://github.com/center-key/fetch-json/actions/workflows/run-spec-on-push.yaml)

Why would you fetch anything but json? ;)

## A) Make REST Easy
**fetch-json** is a lightweight JavaScript library to reduce the boilerplate code needed to make
HTTP calls to JSON endpoints.

**fetch-json** automatically:
1. Adds the HTTP header `Content-Type: application/json` to ensure the correct data type
1. Serializes the body payload with `JSON.stringify()`
1. Runs `.json()` on the response
1. Appends the GET `params` object items to the URL
1. Sets `credentials` to `'same-origin'` (support user sessions in Grails, Rails, PHP, Django, Flask, etc.)
1. Converts the HTTP response to JSON if it's not already JSON (especially convenient for HTTP errors)
1. Returns HTTP headers in `HEAD` response as a simple object.

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
<script src=https://cdn.jsdelivr.net/npm/fetch-json@3.0/dist/fetch-json.min.js></script>
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
or for older CommonJS modules use:
```javascript
const { fetchJson } = require('fetch-json');  //deprecated -- use ES modules instead
```

Requires minimum **node v18.**

If you use GitHub Actions, ensure the version of node is set correclty:
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 18
```

## C) Examples
### 1. HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APoD
const url =    'https://api.nasa.gov/planetary/apod';
const params = { api_key: 'DEMO_KEY' };
const handleData = (data) =>
   console.log('The NASA APoD for today is at:', data.url);
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
const resource = { name: 'Jupiter', position: 5 };
const handleData = (data) =>
   console.log('New planet:', data);  //http response body as an object literal
fetchJson.post('https://httpbin.org/post', resource)
   .then(handleData)
   .catch(console.error);
```
For more examples, see the Mocha specification suite:<br>
[spec/node.spec.js](spec/node.spec.js)
([Mocha output for each **build** under `Run npm test`](https://github.com/center-key/fetch-json/actions/workflows/run-spec-on-push.yaml))

To see a website that incorporates **fetch-json**, check out DataDashboard:<br>
[data-dashboard.js.org 📊](https://data-dashboard.js.org)

## D) Examples Using async/await
### 1. HTTP GET
Fetch the NASA Astronomy Picture of the Day:
```javascript
// NASA APoD
const show = async () => {
   const url =    'https://api.nasa.gov/planetary/apod';
   const params = { api_key: 'DEMO_KEY' };
   const data =   await fetchJson.get(url, params);
   console.log('The NASA APoD for today is at: ' + data.url);
   };
show();
```
### 2. HTTP POST
Create a resource for the planet Jupiter:
```javascript
// Create Jupiter
const create = async (resource) => {
   const data = await fetchJson.post('https://httpbin.org/post', resource);
   console.log('New planet:', data);  //http response body as an object literal
   };
create({ name: 'Jupiter', position: 5 });
```

## E) Leverages Fetch API
**fetch-json** calls the native
**[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**.

For comparison, the POST example in section [3) Examples](#3-examples) to create a planet would be
done calling the **Fetch API**
directly with the code:
```javascript
// Create Jupiter (WITHOUT fetch-json)
const resource = { name: 'Jupiter', position: 5 };
const options = {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      },
   body: JSON.stringify(resource),
   };
const handleData = (data) =>
   console.log(data);  //http response body as an object literal
fetch('https://httpbin.org/post', options)
   .then(response => response.json())
   .then(handleData)
   .catch(console.error);
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
#### HEAD (HTTP headers)
```javascript
fetchJson.head(url, params, options).then(callback);  //headers returned as an object
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

### 2. API &mdash; logging
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

## G) Response Text Converted to JSON
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
   bodyText:    '<!doctype html><html lang=en><body>Server Error</body></html>',
}
```
With **fetch-json**, you know the response body will always be passed back to you as a simple
object literal.

## H) Base Options
Use `fetchJson.setBaseOptions()` to configure options to be used on future **fetchJson** requests.

The example below sets the `Authorization` HTTP header so it is sent on the subsequent GET and
DELETE requests:
```javascript
fetchJson.setBaseOptions({ headers: { Authorization: 'Basic WE1MIGlzIGhpZGVvdXM=' } });
fetchJson.get('https://dna-engine.org/api/books/').then(display);  //with auth header
fetchJson.delete('https://dna-engine.org/api/books/3/');           //with auth header
```

To have multiple base options available at the same time, use the `FetchJson` class to instantiate
multiple copies of `fetchJson`:
```javascript
import { FetchJson } from 'fetch-json';

const fetchJsonA = new FetchJson({ headers: { From: 'aaa@example.com' } }).fetchJson;
const fetchJsonB = new FetchJson({ headers: { From: 'bbb@example.com' } }).fetchJson;
fetchJsonA.get('https://dna-engine.org/api/books/').then(display);  //from aaa@example.com
fetchJsonB.delete('https://dna-engine.org/api/books/3/');           //from bbb@example.com
```

## I) TypeScript Declarations
See the TypeScript declarations at the top of the [fetch-json.ts](fetch-json.ts) file.

The declarations provide type information about the API.  For example, the `fetchJson.post()`
function returns a **Promise** for a `FetchResponse`:
```typescript
fetchJson.post(url: string, resource?: RequestData,
   options?: FetchOptions): Promise<FetchResponse>
```

## J) Fetch polyfills
### 1. Add Fetch to JSDOM
JSDOM does not include `fetch`, so you need to add a polyfill.
```shell
$ npm install --save-dev whatwg-fetch
```
See usage of `whatwg-fetch` in [spec/jsdom.spec.js](spec/jsdom.spec.js).

### 2. Legacy Node.js
Native support for **Fetch API** was introduced in **node v18** which became the Active LTS version on 2022-10-25.&nbsp;
If you're using an older version of **node,** stick with **fetch-json v2.7** and in your **package.json** file declare a dependency on the **node-fetch** polyfill package.
```shell
$ npm install node-fetch
```

### 3. Legacy web browsers
To support really old browsers, include polyfills for
[Promise](https://github.com/taylorhakes/promise-polyfill/) and
[Fetch API](https://github.com/github/fetch):
```html
<script src=https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js></script>
<script src=https://cdn.jsdelivr.net/npm/whatwg-fetch@3/dist/fetch.umd.min.js></script>
```

<br>

---
_"Stop trying to make fetch happen without [#fetchJson](https://twitter.com/hashtag/fetchJson)!"_

Feel free to submit questions at:<br>
[github.com/center-key/fetch-json/issues](https://github.com/center-key/fetch-json/issues)

[MIT License](LICENSE.txt)
