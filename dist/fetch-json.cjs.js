//! fetch-json v2.3.0 ~ github.com/center-key/fetch-json ~ MIT License

const fetchApi = typeof window === 'object' && window.fetch || require('node-fetch');
const fetchJson = {
    version: '2.3.0',
    request(method, url, data, options) {
        const defaults = {
            method: method,
            credentials: 'same-origin',
            strictErrors: false,
        };
        const settings = { ...defaults, ...options };
        settings.method = settings.method.toUpperCase();
        const isGetRequest = settings.method === 'GET';
        const jsonHeaders = { Accept: 'application/json' };
        if (!isGetRequest && data)
            jsonHeaders['Content-Type'] = 'application/json';
        settings.headers = { ...jsonHeaders, ...(options && options.headers) };
        const paramKeys = isGetRequest && data ? Object.keys(data) : [];
        const toPair = (key) => key + '=' +
            encodeURIComponent(data[key]); //build query string field-value
        if (paramKeys.length)
            url = url + (url.includes('?') ? '&' : '?') + paramKeys.map(toPair).join('&');
        if (!isGetRequest && data)
            settings.body = JSON.stringify(data);
        const now = () => new Date().toISOString();
        const logUrl = url.replace(/[?].*/, ''); //security: prevent logging url parameters
        const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, ''); //extract hostname
        const toJson = (response) => {
            const contentType = response.headers.get('content-type');
            const isJson = contentType && /json|javascript/.test(contentType); //match "application/json" or "text/javascript"
            const textToObj = (httpBody) => {
                response.error = !response.ok;
                response.contentType = contentType;
                response.bodyText = httpBody;
                return response;
            };
            if (fetchJson.logger)
                fetchJson.logger(now(), 'response', settings.method, logDomain, logUrl, response.ok, response.status, response.statusText, contentType);
            if (settings.strictErrors && !response.ok)
                throw Error('HTTP response status ("strictErrors" mode enabled): ' + response.status);
            return isJson ? response.json() : response.text().then(textToObj);
        };
        if (fetchJson.logger)
            fetchJson.logger(now(), 'request', settings.method, logDomain, logUrl);
        return fetchApi(url, settings).then(toJson);
    },
    get(url, params, options) {
        return fetchJson.request('GET', url, params, options);
    },
    post(url, resource, options) {
        return fetchJson.request('POST', url, resource, options);
    },
    put(url, resource, options) {
        return fetchJson.request('PUT', url, resource, options);
    },
    patch(url, resource, options) {
        return fetchJson.request('PATCH', url, resource, options);
    },
    delete(url, resource, options) {
        return fetchJson.request('DELETE', url, resource, options);
    },
    logger: null,
    getLogHeaders() {
        return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'];
    },
    getLogHeaderIndex() {
        return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 };
    },
    enableLogger(booleanOrFn) {
        const logger = booleanOrFn === false ? null : console.log;
        return fetchJson.logger = typeof booleanOrFn === 'function' ? booleanOrFn : logger;
    },
};

module.exports = fetchJson;
