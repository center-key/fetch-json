//! fetch-json v2.2.7 ~ github.com/center-key/fetch-json ~ MIT License

const fetch = typeof window === 'object' && window.fetch || require('node-fetch');

const fetchJson = {
   version: '2.2.7',
   request: (method, url, data, options) => {
      const settings = {
         method:       method.toUpperCase(),
         credentials:  'same-origin',
         strictErrors: false
         };
      Object.assign(settings, options);
      const isGetRequest = settings.method === 'GET';
      const jsonHeaders = { 'Accept': 'application/json' };
      if (!isGetRequest && data)
         jsonHeaders['Content-Type'] = 'application/json';
      settings.headers = Object.assign(jsonHeaders, options && options.headers);
      const toPair = (key) => key + '=' + encodeURIComponent(data[key]);  //build query string field-value
      const paramKeys = isGetRequest && data && Object.keys(data);
      if (paramKeys && paramKeys.length)
         url = url + (url.includes('?') ? '&' : '?') + paramKeys.map(toPair).join('&');
      if (!isGetRequest && data)
         settings.body = JSON.stringify(data);
      const logUrl = url.replace(/[?].*/, '');  //security: prevent logging url parameters
      const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');  //extract hostname
      const toJson = (response) => {
         const contentType = response.headers.get('content-type');
         const isJson = /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         const textToObj = (httpBody) => {  //rest calls should only return json
            response.error =       !response.ok;
            response.contentType = contentType;
            response.bodyText =    httpBody;
            return response;
            };
         if (fetchJson.logger)
            fetchJson.logger(new Date().toISOString(), 'response', settings.method,
               logDomain, logUrl, response.ok, response.status, response.statusText, contentType);
         if (settings.strictErrors && !response.ok)
            throw Error('HTTP response status ("strictErrors" mode enabled): ' + response.status);
         return isJson ? response.json() : response.text().then(textToObj);
         };
      if (fetchJson.logger)
         fetchJson.logger(new Date().toISOString(), 'request', settings.method, logDomain, logUrl);
      return fetch(url, settings).then(toJson);
      },
   get:    (url, params,   options) => fetchJson.request('GET',    url, params,   options),
   post:   (url, resource, options) => fetchJson.request('POST',   url, resource, options),
   put:    (url, resource, options) => fetchJson.request('PUT',    url, resource, options),
   patch:  (url, resource, options) => fetchJson.request('PATCH',  url, resource, options),
   delete: (url, resource, options) => fetchJson.request('DELETE', url, resource, options),
   logger: null,  //null or a function
   getLogHeaders: () =>
      ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'],
   getLogHeaderIndex: () =>
      ({ timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 }),
   enableLogger: (booleanOrFn) => {
      const isFn = typeof booleanOrFn === 'function';
      fetchJson.logger = isFn ? booleanOrFn : booleanOrFn === false ? null : console.log;
      return fetchJson.logger;
      }
   };

if (typeof module === 'object')
   module.exports = fetchJson;  //node module loading system (CommonJS)
if (typeof window === 'object')
   window.fetchJson = fetchJson;  //support both global and window property
