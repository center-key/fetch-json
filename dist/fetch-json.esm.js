//! fetch-json v2.4.4 ~ github.com/center-key/fetch-json ~ MIT License

import fetch from 'node-fetch';
const fetchJson = {
    version: '2.4.4',
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
            encodeURIComponent(data ? data[key] : '');
        if (paramKeys.length)
            url = url + (url.includes('?') ? '&' : '?') + paramKeys.map(toPair).join('&');
        settings.body = !isGetRequest && data ? JSON.stringify(data) : null;
        const now = () => new Date().toISOString();
        const logUrl = url.replace(/[?].*/, '');
        const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');
        const toJson = (value) => {
            const response = value;
            const contentType = response.headers.get('content-type');
            const isJson = !!contentType && /json|javascript/.test(contentType);
            const textToObj = (httpBody) => ({
                ok: response.ok,
                error: !response.ok,
                status: response.status,
                contentType: contentType,
                bodyText: httpBody,
                response: response,
            });
            if (fetchJson.logger)
                fetchJson.logger(now(), 'response', settings.method, logDomain, logUrl, response.ok, response.status, response.statusText, contentType);
            if (settings.strictErrors && !response.ok)
                throw Error('HTTP response status ("strictErrors" mode enabled): ' + response.status);
            return isJson ? response.json() : response.text().then(textToObj);
        };
        if (fetchJson.logger)
            fetchJson.logger(now(), 'request', settings.method, logDomain, logUrl);
        const settingsRequestInit = JSON.parse(JSON.stringify(settings));
        return fetch(url, settingsRequestInit).then(toJson);
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
export { fetchJson };
