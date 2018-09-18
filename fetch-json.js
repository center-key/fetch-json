//! fetch-json v0.3.1
//! A wrapper around Fetch just for JSON
//! MIT License -- https://github.com/center-key/fetch-json

const fetch = typeof window === 'object' ? window.fetch : require('node-fetch');

const fetchJson = {
   version: '0.3.1',
   request: function(method, url, data, options) {
      const settings = { method: method.toUpperCase(), credentials: 'same-origin' };
      options = Object.assign(settings, options);
      const jsonHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      options.headers = Object.assign(jsonHeaders, options.headers);
      function toPair(key) { return key + '=' + encodeURIComponent(data[key]); }
      if (options.method === 'GET' && data)
         url = url + (url.includes('?') ? '&' : '?') + Object.keys(data).map(toPair).join('&');
      else if (options.method !== 'GET' && data)
         options.body = JSON.stringify(data);
      function toJson(response) {
         const contentType = response.headers.get('content-type');
         const isJson = /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         function textToObj(httpBody) {
            if (fetchJson.logger)
               fetchJson.logger(new Date().toISOString(), options.method, response.url,
                  response.ok, response.status, response.statusText, contentType);
            response.error =       !response.ok;
            response.contentType = contentType;
            response.bodyText =    httpBody;
            return response;
            }
         return isJson ? response.json() : response.text().then(textToObj);
         }
      if (fetchJson.logger)
         fetchJson.logger(new Date().toISOString(), options.method, url);
      return fetch(url, options).then(toJson);
      },
   get: function(url, params, options) {
      return fetchJson.request('GET', url, params, options);
      },
   post: function(url, resource, options) {
      return fetchJson.request('POST', url, resource, options);
      },
   put: function(url, resource, options) {
      return fetchJson.request('PUT', url, resource, options);
      },
   patch: function(url, resource, options) {
      return fetchJson.request('PATCH', url, resource, options);
      },
   delete: function(url, resource, options) {
      return fetchJson.request('DELETE', url, resource, options);
      },
   logger: null,
   enableLogger: function(booleanOrFn) {
      const isFn = typeof booleanOrFn === 'function';
      fetchJson.logger = isFn ? booleanOrFn : booleanOrFn === false ? null : console.log;
      return fetchJson.logger;
      }
   };

if (typeof module === 'object')
   module.exports = fetchJson;  //Node.js module loading system (CommonJS)
else if (typeof window === 'object')
   window.fetchJson = fetchJson;  //support both global and window property
