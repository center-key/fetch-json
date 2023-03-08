// fetch-json ~ MIT License

/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Json =             string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject =       { [key: string]: Json };
export type JsonData =         JsonObject | Json[];
export type FetchJsonInit =    { strictErrors: boolean };
export type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export type FetchJsonMethod =  string;
export type FetchJsonParams =  { [field: string]: string | number | boolean | null | undefined };
export type FetchJsonParsedResponse = Json | any;
export type FetchJsonTextResponse = {  //used when the HTTP response is unexpectedly not JSON
   ok:          boolean,        //code for HTTP status in the range 200-299
   error:       boolean,        //code for HTTP status not in the range 200-299 or exception thrown
   status:      number,         //code for HTTP status
   contentType: string | null,  //mime-type, such as 'text/html'
   bodyText:    string,         //body of the HTTP response or error message
   response:    Response,       //response object
   };
export type FetchJsonResponse = FetchJsonParsedResponse | FetchJsonTextResponse;
export type FetchJsonLogger = (
   dateIso:      string,                  //timestamp, such as '2022-12-06T07:24:40.330Z'
   type?:        'response' | 'request',  //message direction
   method?:      FetchJsonMethod,         //action for HTTP request, such as 'POST'
   domain?:      string,                  //hostname
   url?:         string,                  //address of requested resource (without parameters)
   ok?:          boolean,                 //code for HTTP status in the range 200-299
   status?:      number,                  //code for HTTP status, typically 200
   statusText?:  string,                  //message corresponding to the code, typically 'OK'
   contentType?: string | null,           //mime-type, typically 'application/json'
   ) => void;

const fetchJson = {
   version:     '{{pkg.version}}',
   baseOptions: <FetchJsonOptions>{},
   getBaseOptions(): FetchJsonOptions {
      return this.baseOptions;
      },
   setBaseOptions(options: FetchJsonOptions): FetchJsonOptions {
      this.baseOptions = options;
      return this.baseOptions;
      },
   request<T>(method: FetchJsonMethod, url: string, data?: FetchJsonParams | Json | T,
         options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      const defaults: FetchJsonOptions = {
         method:       method,
         credentials:  'same-origin',
         strictErrors: false,
         };
      const settings = { ...defaults, ...this.baseOptions, ...options };
      if (!settings.method || typeof settings.method !== 'string')
         throw Error('[fetch-json] HTTP method missing or invalid.');
      const httpMethod =   settings.method.trim().toUpperCase();
      const isGetRequest = httpMethod === 'GET';
      const jsonHeaders =  { Accept: 'application/json' };
      if (!isGetRequest && data)
         jsonHeaders['Content-Type'] = 'application/json';
      settings.headers = { ...jsonHeaders, ...settings.headers };
      const paramKeys =  isGetRequest && data ? Object.keys(data) : <string[]>[];
      const toPair =     (key: string) => key + '=' + encodeURIComponent(data ? data[key] : '');  //build query string field-value
      const params =     () => paramKeys.map(toPair).join('&');
      const requestUrl = !paramKeys.length ? url : url + (url.includes('?') ? '&' : '?') + params();
      settings.body =    !isGetRequest && data ? JSON.stringify(data) : null;
      const log = (type: 'response' | 'request', ...items: any[]) => {
         const logUrl = url.replace(/[?].*/, '');  //security: prevent logging url parameters
         const domain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');  //extract hostname
         if (this.logger)
            this.logger(new Date().toISOString(), type, httpMethod, domain, logUrl, ...items);
         };
      const toJson = (value: unknown): Promise<FetchJsonResponse> => {
         const response =    <Response>value;
         const contentType = response.headers.get('content-type');
         const isJson =      !!contentType && /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         const textToObj = (httpBody: string): FetchJsonTextResponse => ({
            ok:          response.ok,
            error:       !response.ok,
            status:      response.status,
            contentType: contentType,
            bodyText:    httpBody,
            response:    response,
            });
         log('response', response.ok, response.status, response.statusText, contentType);
         if (settings.strictErrors && !response.ok)
            throw Error('[fetch-json] HTTP response status ("strictErrors" mode enabled): ' + response.status);
         const errToObj = (error: Error): FetchJsonTextResponse => ({
            ok:          false,
            error:       true,
            status:      500,
            contentType: contentType,
            bodyText:    'Invalid JSON [' + error.toString() + ']',
            response:    response,
            });
         return isJson ? response.json().catch(errToObj) : response.text().then(textToObj);
         };
      log('request');
      const settingsRequestInit = JSON.parse(JSON.stringify(settings));  //TODO: <RequestInit>
      return fetch(requestUrl, settingsRequestInit).then(toJson);
      },
   get(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return this.request('GET', url, params, options);
      },
   post<T>(url: string, resource?: Json | T, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return this.request('POST', url, resource, options);
      },
   put<T>(url: string, resource?: Json | T, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return this.request('PUT', url, resource, options);
      },
   patch<T>(url: string, resource?: Json | T, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return this.request('PATCH', url, resource, options);
      },
   delete<T>(url: string, resource?: Json | T, options?: FetchJsonOptions): Promise<FetchJsonResponse> {
      return this.request('DELETE', url, resource, options);
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
      return this.logger = typeof booleanOrFn === 'function' ? booleanOrFn : logger;
      },
   };

class FetchJson {
   // A Class version of fetchJson to support creating multiple instances each with its own base
   // options.
   fetchJson: typeof fetchJson;
   constructor(options?: FetchJsonOptions) {
      this.fetchJson = { ...fetchJson };
      this.fetchJson.setBaseOptions(options || {});
      }
   }

export { fetchJson, FetchJson };
