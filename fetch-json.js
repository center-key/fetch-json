//! browser-fetch-json v0.2.0
//! A thin wrapper around the browser's native Fetch API just for JSON
//! MIT License -- https://github.com/center-key/browser-fetch-json

const fetchJson = {
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
      function toJson(response) { return response.json(); }
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
