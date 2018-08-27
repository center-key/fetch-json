// browser-fetch-json ~~ MIT License

const fetchJson = {
   request: function(method, url, data, options) {
      options = Object.assign({ method: method.toUpperCase() }, options);
      const jsonHeaders = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      options.headers = Object.assign(jsonHeaders, options.headers);
      function toPair(key) { return key + '=' + data[key]; }
      if (options.method === 'GET' && data)
         url = url + (url.includes('?') ? '&' : '?') + Object.keys(data).map(toPair).join('&');
      else if (options.method !== 'GET' && data)
         options.body = JSON.stringify(data);
      function toJson(response) { return response.json(); }
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
      }
   };

if (typeof module === 'object')
   module.exports = fetchJson;  //Node.js module loading system (CommonJS)
