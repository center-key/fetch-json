//! fetch-json v3.5.2 ~~ https://fetch-json.js.org ~~ MIT License

const fetchJson = {
    version: '3.5.2',
    baseOptions: {},
    assert(ok, message) {
        if (!ok)
            throw new Error(`[fetch-json] ${message}`);
    },
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
        };
        const settings = { ...defaults, ...this.baseOptions, ...options };
        const badMethod = !settings.method || typeof settings.method !== 'string';
        fetchJson.assert(!badMethod, 'HTTP method missing or invalid.');
        fetchJson.assert(typeof url === 'string', 'URL must be a string.');
        const httpMethod = settings.method.trim().toUpperCase();
        const isGetRequest = httpMethod === 'GET';
        const jsonHeaders = { accept: 'application/json' };
        if (!isGetRequest && data)
            jsonHeaders['content-type'] = 'application/json';
        settings.headers = { ...jsonHeaders, ...settings.headers };
        const paramKeys = isGetRequest && data ? Object.keys(data) : [];
        const getValue = (key) => data ? data[key] : '';
        const toPair = (key) => key + '=' + encodeURIComponent(getValue(key));
        const params = () => paramKeys.map(toPair).join('&');
        const requestUrl = !paramKeys.length ? url : url + (url.includes('?') ? '&' : '?') + params();
        const httpLine = `${httpMethod} ${requestUrl}`;
        settings.body = !isGetRequest && data ? JSON.stringify(data) : null;
        const log = (type, ...items) => {
            const logUrl = url.replace(/[?].*/, '');
            const domain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');
            if (this.logger)
                this.logger(new Date().toISOString(), type, httpMethod, domain, logUrl, ...items);
        };
        const errorDetails = (error) => ({
            name: error.name || null,
            code: error.code || null,
            cause: error.cause?.toString?.() || null,
        });
        const toJson = (value) => {
            const response = value;
            const contentType = response.headers.get('content-type');
            const isHead = httpMethod === 'HEAD';
            const isJson = !!contentType && /json|javascript/.test(contentType);
            const headersObj = () => Object.fromEntries(response.headers.entries());
            const textToObj = (httpBody, data) => ({
                http: httpLine,
                error: true,
                ok: response.ok,
                status: response.status,
                message: 'Response not JSON',
                details: { name: null, code: null, cause: httpBody.match(/^.*/)[0] },
                contentType: contentType,
                bodyText: httpBody,
                data: data ?? null,
                response: response,
            });
            const jsonToObj = (data) => response.ok ? data : textToObj(JSON.stringify(data), data);
            const httpErrToObj = (error) => ({
                http: httpLine,
                error: true,
                ok: false,
                status: 500,
                message: 'Invalid JSON',
                details: errorDetails(error),
                contentType: contentType,
                bodyText: error.toString(),
                data: null,
                response: response,
            });
            log('response', response.ok, response.status, contentType);
            const returnObj = isHead ? response.text().then(headersObj) :
                isJson ? response.json().then(jsonToObj).catch(httpErrToObj) :
                    response.text().then(textToObj);
            return returnObj;
        };
        log('request');
        const exceptionToObj = (error) => ({
            http: httpLine,
            error: true,
            ok: false,
            status: 499,
            message: 'Fetch API exception',
            details: errorDetails(error),
            contentType: null,
            bodyText: String(error),
            data: null,
            response: null,
        });
        return fetch(requestUrl, settings).then(toJson).catch(exceptionToObj);
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
        return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Type'];
    },
    getLogHeaderIndexMap() {
        return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, type: 7 };
    },
    enableLogger(customLogger) {
        this.logger = customLogger ?? console.info;
        return this.logger;
    },
    disableLogger() {
        this.logger = null;
    },
};
class FetchJson {
    fetchJson;
    constructor(options) {
        this.fetchJson = { ...fetchJson };
        this.fetchJson.setBaseOptions(options || {});
    }
}
export { fetchJson, FetchJson };
