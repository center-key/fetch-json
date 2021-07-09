// fetch-json ~ MIT License

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type FetchJsonInit = {
   strictErrors: boolean,
   };
export type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export type FetchJsonMethod = RequestInit['method'];
export type FetchJsonParams = Record<string, string | number | boolean | null | undefined>;
export type FetchJsonBody = Record<string | number, any> | any[];
export type FetchJsonParsedResponse = string | number | boolean | null | any |
   FetchJsonParsedResponse[] | { [prop: string]: FetchJsonParsedResponse };
export type FetchJsonTextResponse = {
   ok:          boolean,
   error:       boolean,
   status:      number,
   contentType: string | null,
   bodyText:    string,
   response:    Response,
   };
export type FetchJsonResponse = FetchJsonParsedResponse | FetchJsonTextResponse;
export type FetchJsonLogger = (
   dateIso:      string,
   type?:        'response' | 'request',
   method?:      FetchJsonMethod,
   logDomain?:   string,
   logUrl?:      string,
   ok?:          boolean,
   status?:      number,
   statusText?:  string,
   contentType?: string | null,
   ) => void;

import fetch from 'node-fetch';

const fetchJson = {
   version: '[VERSION]',
   baseOptions: <FetchJsonOptions>{},
   getBaseOptions(): FetchJsonOptions {
      return fetchJson.baseOptions;
      },
   setBaseOptions(options: FetchJsonOptions): FetchJsonOptions {
      fetchJson.baseOptions = options;
      return fetchJson.baseOptions;
      },
   request(method: FetchJsonMethod, url: string, data?: FetchJsonParams | FetchJsonBody,
         options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      const defaults: FetchJsonOptions = {
         method:       method,
         credentials:  'same-origin',
         strictErrors: false,
         };
      const settings = { ...defaults, ...this.baseOptions, ...options };
      settings.method = (<string>settings.method).toUpperCase();
      const isGetRequest = settings.method === 'GET';
      const jsonHeaders = { Accept: 'application/json' };
      if (!isGetRequest && data)
         jsonHeaders['Content-Type'] = 'application/json';
      settings.headers = { ...jsonHeaders, ...settings.headers };
      const paramKeys: string[] = isGetRequest && data ? Object.keys(data) : [];
      const toPair = (key: string) => key + '=' +
         encodeURIComponent(data ? data[key] : '');  //build query string field-value
      if (paramKeys.length)
         url = url + (url.includes('?') ? '&' : '?') + paramKeys.map(toPair).join('&');
      settings.body = !isGetRequest && data ? JSON.stringify(data) : null;
      const now = () => new Date().toISOString();
      const logUrl = url.replace(/[?].*/, '');  //security: prevent logging url parameters
      const logDomain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');  //extract hostname
      const toJson = (value: unknown): Promise<FetchJsonResponse> => {
         const response = <Response>value;
         const contentType = response.headers.get('content-type');
         const isJson = !!contentType && /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         const textToObj = (httpBody: string): FetchJsonTextResponse => ({
            ok:          response.ok,
            error:       !response.ok,
            status:      response.status,
            contentType: contentType,
            bodyText:    httpBody,
            response:    response,
            });
         if (fetchJson.logger)
            fetchJson.logger(now(), 'response', settings.method, logDomain, logUrl,
               response.ok, response.status, response.statusText, contentType);
         if (settings.strictErrors && !response.ok)
            throw Error('HTTP response status ("strictErrors" mode enabled): ' + response.status);
         return isJson ? response.json() : response.text().then(textToObj);
         };
      if (fetchJson.logger)
         fetchJson.logger(now(), 'request', settings.method, logDomain, logUrl);
      const settingsRequestInit = JSON.parse(JSON.stringify(settings));  //TODO: <RequestInit>
      return fetch(url, settingsRequestInit).then(toJson);
      },
   get(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return fetchJson.request('GET', url, params, options);
      },
   post(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return fetchJson.request('POST', url, resource, options);
      },
   put(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return fetchJson.request('PUT', url, resource, options);
      },
   patch(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return fetchJson.request('PATCH', url, resource, options);
      },
   delete(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return fetchJson.request('DELETE', url, resource, options);
      },
   logger: <FetchJsonLogger | null>null,
   getLogHeaders(): string[] {
      return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Text', 'Type'];
      },
   getLogHeaderIndex(): { [header: string]: number } {
      return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, text: 7, type: 8 };
      },
   enableLogger(booleanOrFn?: boolean | FetchJsonLogger): FetchJsonLogger | null {
      const logger = booleanOrFn === false ? null : console.log;
      return fetchJson.logger = typeof booleanOrFn === 'function' ? booleanOrFn : logger;
      },
   };

export { fetchJson };
