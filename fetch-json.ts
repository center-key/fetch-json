// fetch-json ~ MIT License

type FetchOptions =     { [key: string]: number | string | boolean | HttpHeaders };
type HttpHeaders =      { [key: string]: number | string | boolean };
type HttpMethod =       'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE';
type RequestData =      { [key in number | string]: RequestDataValue } | RequestDataValue[] | UrlParams;
type RequestDataValue = number | string | boolean | null | RequestData;
type UrlParams =        { [key in number | string]: UrlParamValue };
type UrlParamValue =    number | string | boolean;
type FetchResponseText = {
   error?:       boolean;
   contentType?: string | null;
   bodyText?:    string;
   };
type FetchResponse = Response & FetchResponseText;
type Logger = (
   dateIso?:     string,
   type?:        'response' | 'request',
   method?:      HttpMethod,
   logDomain?:   string,
   logUrl?:      string,
   ok?:          boolean,
   status?:      number,
   statusText?:  string,
   contentType?: string | null,
   ) => void;

const fetchApi = typeof window === 'object' && window.fetch || require('node-fetch');

const fetchJson = {
   version: '[VERSION]',
   request(method: HttpMethod, url: string, data?: RequestData, options?: FetchOptions): Promise<FetchResponse> {
      const defaults: FetchOptions = {
         method:       method,
         credentials:  'same-origin',
         strictErrors: false,
         };
      const settings = { ...defaults, ...options };
      settings.method = (<string>settings.method).toUpperCase();
      const isGetRequest = settings.method === 'GET';
      const jsonHeaders: HttpHeaders = { Accept: 'application/json' };
      if (!isGetRequest && data)
         jsonHeaders['Content-Type'] = 'application/json';
      settings.headers = { ...jsonHeaders, ...(options && <HttpHeaders>options.headers) };
      const paramKeys = isGetRequest && data ? Object.keys(data) : [];
      const toPair = (key: number | string) => key + '=' +
         encodeURIComponent(<UrlParamValue>(<UrlParams>data)[key]);  //build query string field-value
      if (paramKeys.length)
         url = url + (url.includes('?') ? '&' : '?') + paramKeys.map(toPair).join('&');
      if (!isGetRequest && data)
         settings.body = JSON.stringify(data);
      const now = () => new Date().toISOString();
      const logUrl = url.replace(/[?].*/, '');  //security: prevent logging url parameters
      const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');  //extract hostname
      const toJson = (response: FetchResponse): Promise<FetchResponse> => {
         const contentType = response.headers.get('content-type');
         const isJson = contentType && /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         const textToObj = (httpBody: string) => {
            response.error =       !response.ok;
            response.contentType = contentType;
            response.bodyText =    httpBody;
            return response;
            };
         if (fetchJson.logger)
            fetchJson.logger(now(), 'response', <HttpMethod>settings.method, logDomain, logUrl,
               response.ok, response.status, response.statusText, contentType);
         if (settings.strictErrors && !response.ok)
            throw Error('HTTP response status ("strictErrors" mode enabled): ' + response.status);
         return isJson ? response.json() : response.text().then(textToObj);
         };
      if (fetchJson.logger)
         fetchJson.logger(now(), 'request', <HttpMethod>settings.method, logDomain, logUrl);
      return fetchApi(url, settings).then(toJson);
      },
   get(url: string, params?: UrlParams, options?: FetchOptions): Promise<FetchResponse> {
      return fetchJson.request('GET', url, params, options);
      },
   post(url: string, resource?: RequestData, options?: FetchOptions): Promise<FetchResponse> {
      return fetchJson.request('POST', url, resource, options);
      },
   put(url: string, resource?: RequestData, options?: FetchOptions): Promise<FetchResponse> {
      return fetchJson.request('PUT', url, resource, options);
      },
   patch(url: string, resource?: RequestData, options?: FetchOptions): Promise<FetchResponse> {
      return fetchJson.request('PATCH', url, resource, options);
      },
   delete(url: string, resource?: RequestData, options?: FetchOptions): Promise<FetchResponse> {
      return fetchJson.request('DELETE', url, resource, options);
      },
   logger: <Logger | null>null,
   getLogHeaders(): string[] {
      return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'];
      },
   getLogHeaderIndex(): { [header: string]: number } {
      return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 };
      },
   enableLogger(booleanOrFn: boolean | Logger): Logger | null {
      const logger = booleanOrFn === false ? null : console.log;
      return fetchJson.logger = typeof booleanOrFn === 'function' ? booleanOrFn : logger;
      },
   };

export { fetchJson };
