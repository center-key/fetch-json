// browser-fetch-json ~~ MIT License

const fetchJson = {
   request: function(method, url, data, options) {
      const settings = { method: method.toUpperCase(), credentials: 'same-origin' };
      options = Object.assign(settings, options);
      const jsonHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      options.headers = Object.assign(jsonHeaders, options.headers);
      function toPair(key) { return key + '=' + data[key]; }
      if (options.method === 'GET' && data)
         url = url + (url.includes('?') ? '&' : '?') + Object.keys(data).map(toPair).join('&');
      else if (options.method !== 'GET' && data)
         options.body = JSON.stringify(data);
      function toJson(response) { return response.json(); }
      if (fetchJson.logger)
         fetchJson.logger(Date.now(), options.method, url.split('?')[0]);
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
