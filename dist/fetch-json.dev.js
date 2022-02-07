//! fetch-json v2.6.3 ~~ https://fetch-json.js.org ~~ MIT License

const fetchJson = {
    version: '2.6.3',
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
            throw Error('[fetch-json] HTTP method missing or invalid.');
        settings.method = settings.method.trim().toUpperCase();
        const isGetRequest = settings.method === 'GET';
        const jsonHeaders = { Accept: 'application/json' };
        if (!isGetRequest && data)
            jsonHeaders['Content-Type'] = 'application/json';
        settings.headers = { ...jsonHeaders, ...settings.headers };
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
            if (this.logger)
                this.logger(now(), 'response', settings.method, logDomain, logUrl, response.ok, response.status, response.statusText, contentType);
            if (settings.strictErrors && !response.ok)
                throw Error('[fetch-json] HTTP response status ("strictErrors" mode enabled): ' + response.status);
            const errToObj = (error) => ({
                ok: false,
                error: true,
                status: 500,
                contentType: contentType,
                bodyText: 'Invalid JSON [' + error.toString() + ']',
                response: response,
            });
            return isJson ? response.json().catch(errToObj) : response.text().then(textToObj);
        };
        if (this.logger)
            this.logger(now(), 'request', settings.method, logDomain, logUrl);
        const settingsRequestInit = JSON.parse(JSON.stringify(settings));
        return fetch(url, settingsRequestInit).then(toJson);
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
    logger: null,
    getLogHeaders() {
        return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'];
    },
    getLogHeaderIndex() {
        return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 };
    },
    enableLogger(booleanOrFn) {
        const logger = booleanOrFn === false ? null : console.log;
        return this.logger = typeof booleanOrFn === 'function' ? booleanOrFn : logger;
    },
};
class FetchJson {
    constructor(options) {
        this.fetchJson = { ...fetchJson };
        this.fetchJson.setBaseOptions(options || {});
    }
}
if (typeof window === "object") { window.fetchJson = fetchJson; window.FetchJson = FetchJson; }