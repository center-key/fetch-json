//! fetch-json v3.3.2 ~~ https://fetch-json.js.org ~~ MIT License

const fetchJson = {
    version: '3.3.2',
    baseOptions: {},
    getBaseOptions() {
        return this.baseOptions;
    },
    setBaseOptions(options) {
        this.baseOptions = options;
        return this.baseOptions;
    },
    request(method, url, data, options) {
        const defaults = {
            method: method,
            credentials: 'same-origin',
            strictErrors: false,
        };
        const settings = { ...defaults, ...this.baseOptions, ...options };
        if (!settings.method || typeof settings.method !== 'string')
            throw new Error('[fetch-json] HTTP method missing or invalid.');
        if (typeof url !== 'string')
            throw new Error('[fetch-json] URL must be a string.');
        const httpMethod = settings.method.trim().toUpperCase();
        const isGetRequest = httpMethod === 'GET';
        const jsonHeaders = { Accept: 'application/json' };
        if (!isGetRequest && data)
            jsonHeaders['Content-Type'] = 'application/json';
        settings.headers = { ...jsonHeaders, ...settings.headers };
        const paramKeys = isGetRequest && data ? Object.keys(data) : [];
        const getValue = (key) => data ? data[key] : '';
        const toPair = (key) => key + '=' + encodeURIComponent(getValue(key));
        const params = () => paramKeys.map(toPair).join('&');
        const requestUrl = !paramKeys.length ? url : url + (url.includes('?') ? '&' : '?') + params();
        settings.body = !isGetRequest && data ? JSON.stringify(data) : null;
        const log = (type, ...items) => {
            const logUrl = url.replace(/[?].*/, '');
            const domain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');
            if (this.logger)
                this.logger(new Date().toISOString(), type, httpMethod, domain, logUrl, ...items);
        };
        const toJson = (value) => {
            const response = value;
            const contentType = response.headers.get('content-type');
            const isHead = httpMethod === 'HEAD';
            const isJson = !!contentType && /json|javascript/.test(contentType);
            const headersObj = () => Object.fromEntries(response.headers.entries());
            const textToObj = (httpBody, data) => ({
                ok: response.ok,
                error: !response.ok,
                status: response.status,
                contentType: contentType,
                bodyText: httpBody,
                data: data ?? null,
                response: response,
            });
            const jsonToObj = (data) => response.ok ? data : textToObj(JSON.stringify(data), data);
            const errToObj = (error) => ({
                ok: false,
                error: true,
                status: 500,
                contentType: contentType,
                bodyText: 'Invalid JSON [' + error.toString() + ']',
                data: null,
                response: response,
            });
            log('response', response.ok, response.status, response.statusText, contentType);
            if (settings.strictErrors && !response.ok)
                throw new Error(`[fetch-json] HTTP response status ("strictErrors" mode enabled): ${response.status}`);
            return isHead ? response.text().then(headersObj) :
                isJson ? response.json().then(jsonToObj).catch(errToObj) : response.text().then(textToObj);
        };
        log('request');
        const settingsRequestInit = JSON.parse(JSON.stringify(settings));
        return fetch(requestUrl, settingsRequestInit).then(toJson);
    },
    get(url, params, options) {
        return this.request('GET', url, params, options);
    },
    post(url, resource, options) {
        return this.request('POST', url, resource, options);
    },
    put(url, resource, options) {
        return this.request('PUT', url, resource, options);
    },
    patch(url, resource, options) {
        return this.request('PATCH', url, resource, options);
    },
    delete(url, resource, options) {
        return this.request('DELETE', url, resource, options);
    },
    head(url, params, options) {
        return this.request('HEAD', url, params, options);
    },
    logger: null,
    getLogHeaders() {
        return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'];
    },
    getLogHeaderIndexMap() {
        return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 };
    },
    enableLogger(customLogger) {
        this.logger = customLogger ?? console.log;
        return this.logger;
    },
    disableLogger() {
        this.logger = null;
    },
};
class FetchJson {
    constructor(options) {
        this.fetchJson = { ...fetchJson };
        this.fetchJson.setBaseOptions(options || {});
    }
}
globalThis.fetchJson = fetchJson;
globalThis.FetchJson = FetchJson;
