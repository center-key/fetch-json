// fetch-json ~ MIT License

type Method =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'HEAD'
	| 'DELETE'
	| 'OPTIONS'
	| 'TRACE'
	| 'get'
	| 'post'
	| 'put'
	| 'patch'
	| 'head'
	| 'delete'
	| 'options'
  | 'trace';

type Mode = 'cors' | 'no-cors' | 'same-origin';

interface RequestOptions {
  method: Method;
  headers: RequestHeaders;
  body: string;
  strictErrors: boolean;
  credentials: Credential;
  mode: Mode;
  referrer: string;
}

type RequestData = {[key: string]: string | number | boolean};

type FetchRequest = (method: Method, url: string, data: RequestData, options: RequestOptions) => Promise<Response>;
type FetchRequestWithMethod = (url: string, data: RequestData, options: RequestOptions) => Promise<Response>;
interface TextToObjResponse {
  error: boolean;
  contentType: string | null;
  bodyText: string;
}
type FetchResponse = Response & Partial<TextToObjResponse>;

type LoggerFn = (dateIso?: string, type?: 'response' | 'request', method?: Method, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
type Log = (...x: any[]) => void;

type Logger = LoggerFn | null | Log;

type RequestHeaders = Headers | {[ key: string]: string };

interface FetchJson {
  version: string;
  request: FetchRequest;
  get: FetchRequestWithMethod;
  post: FetchRequestWithMethod;
  put: FetchRequestWithMethod;
  patch: FetchRequestWithMethod;
  delete: FetchRequestWithMethod;
  logger?: Logger;
  getLogHeaders: () => string[];
  getLogHeaderIndex: () => { [key: string]: number };
  enableLogger: (x: boolean | LoggerFn) => Logger;
}

const _fetch = typeof window === 'object' && window.fetch || require('node-fetch');

function isLoggerFn(x: boolean | LoggerFn): x is LoggerFn {
  return x && {}.toString.call(x) === '[object Function]';
}

const fetchJson: FetchJson = {
  version: '[VERSION]',
  request(method, url, data, options) {
    const defaults = {
      method: method.toUpperCase(),
      credentials: 'same-origin',
      strictErrors: false,
    };
    const settings = { ...defaults, ...options };
    const isGetRequest = settings.method === 'GET';
    const jsonHeaders: RequestHeaders = { Accept: 'application/json' };
    if (!isGetRequest && data) jsonHeaders['Content-Type'] = 'application/json';
    settings.headers = { ...jsonHeaders, ...(options && options.headers) };
    const toPair = (key: string) => `${key}=${encodeURIComponent(data[key])}`; //build query string field-value
    const paramKeys = isGetRequest && data && Object.keys(data);
    if (paramKeys && paramKeys.length) {
      url = `${url}${url.includes('?') ? '&' : '?'}${paramKeys
        .map(toPair)
        .join('&')}`;
    }
    if (!isGetRequest && data) {
      settings.body = JSON.stringify(data);
    }
    const logUrl = url.replace(/[?].*/, ''); //security: prevent logging url parameters
    const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, ''); //extract hostname
    const toJson = (response: FetchResponse) => {
      const contentType = response.headers.get('content-type');
      const isJson = contentType && /json|javascript/.test(contentType); //match "application/json" or "text/javascript"
      const textToObj = (httpBody: string) => {
        response.error = !response.ok;
        response.contentType = contentType;
        response.bodyText = httpBody;
        return response;
      };
      if (fetchJson.logger) {
        fetchJson.logger(
          new Date().toISOString(),
          'response',
          settings.method,
          logDomain,
          logUrl,
          response.ok,
          response.status,
          response.statusText,
          contentType
        );
      }
      if (settings.strictErrors && !response.ok) {
        throw Error(
          `HTTP response status ("strictErrors" mode enabled): ${response.status}`
        );
      }
      return isJson ? response.json() : response.text().then(textToObj);
    };
    if (fetchJson.logger)
      fetchJson.logger(
        new Date().toISOString(),
        'request',
        settings.method,
        logDomain,
        logUrl
      );
    return _fetch(url, settings).then(toJson);
  },
  get: (url, params, options) => fetchJson.request('GET', url, params, options),
  post: (url, resource, options) =>
    fetchJson.request('POST', url, resource, options),
  put: (url, resource, options) =>
    fetchJson.request('PUT', url, resource, options),
  patch: (url, resource, options) =>
    fetchJson.request('PATCH', url, resource, options),
  delete: (url, resource, options) =>
    fetchJson.request('DELETE', url, resource, options),
  logger: null, //null or a function
  getLogHeaders() {
    return [
      'Timestamp',
      'HTTP',
      'Method',
      'Domain',
      'URL',
      'Ok',
      'Status',
      'Text',
      'Type',
    ];
  },
  getLogHeaderIndex() {
    return {
      timestamp: 0,
      http: 1,
      method: 2,
      domain: 3,
      url: 4,
      ok: 5,
      status: 6,
      text: 7,
      type: 8,
    };
  },
  enableLogger(booleanOrFn) {
    if (isLoggerFn(booleanOrFn)) {
      fetchJson.logger = booleanOrFn;
    } else {
      fetchJson.logger = booleanOrFn === false ? null : console.log;
    }

    return fetchJson.logger;
  },
};

if (typeof module === 'object') module.exports = fetchJson; //node module loading system (CommonJS)
if (typeof window === 'object') (window as any).fetchJson = fetchJson; //support both global and window property
