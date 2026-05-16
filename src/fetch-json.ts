// fetch-json ~ MIT License

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Json =             string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject =       { [key: string]: Json };
export type JsonData =         JsonObject | Json[];
export type FetchJsonOptions = RequestInit;
export type FetchJsonMethod =  string;
export type FetchJsonParams =  { [field: string]: string | number | boolean | null | undefined };
export type FetchJsonAltResponse = {  //used for exceptions, HTTP errors, and text responses
   http:        string,           //request HTTP method and endpoint
   ok:          boolean,          //code for HTTP status in the range 200-299
   error:       boolean,          //code for HTTP status not in the range 200-299 or exception thrown
   status:      number,           //code for HTTP status
   message:     string,           //error information
   contentType: string | null,    //mime-type, such as 'text/html'
   bodyText:    string,           //body of the HTTP response or error details
   data:        Json,             //body of the HTTP responce if the content is JSON
   response:    Response | null,  //response object
   };
export type FetchJsonResponse = Json | FetchJsonAltResponse;
export type FetchJsonLogger = (
   dateIso:      string,                  //timestamp, such as '2022-12-06T07:24:40.330Z'
   type?:        'response' | 'request',  //message direction
   method?:      FetchJsonMethod,         //action for HTTP request, such as 'POST'
   domain?:      string,                  //hostname
   url?:         string,                  //address of requested resource (without parameters)
   ok?:          boolean,                 //code for HTTP status in the range 200-299
   status?:      number,                  //code for HTTP status, typically 200
   statusText?:  string,                  //message corresponding to the code, typically 'OK' [DEPRECATED for HTTP/2]
   contentType?: string | null,           //mime-type, typically 'application/json'
   ) => void;

const fetchJson = {

   version:     '{{package.version}}',

   baseOptions: <FetchJsonOptions>{},

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[fetch-json] ${message}`);
      },

   getBaseOptions(): FetchJsonOptions {
      return this.baseOptions;
      },

   setBaseOptions(options: FetchJsonOptions): FetchJsonOptions {
      this.baseOptions = options;
      return this.baseOptions;
      },

   request(method: FetchJsonMethod, url: string, data?: unknown,
         options?: FetchJsonOptions): Promise<any> {
      const defaults: FetchJsonOptions = {
         method:      method,
         credentials: 'same-origin',
         };
      const settings =  { ...defaults, ...this.baseOptions, ...options };
      const badMethod = !settings.method || typeof settings.method !== 'string';
      fetchJson.assert(!badMethod, 'HTTP method missing or invalid.');
      fetchJson.assert(typeof url === 'string', 'URL must be a string.');
      const httpMethod =   settings.method!.trim().toUpperCase();
      const isGetRequest = httpMethod === 'GET';
      const jsonHeaders: HeadersInit = { accept: 'application/json' };
      if (!isGetRequest && data)
         jsonHeaders['content-type'] = 'application/json';
      settings.headers = { ...jsonHeaders, ...settings.headers };  //eslint-disable-line @typescript-eslint/no-misused-spread
      const paramKeys =  isGetRequest && data ? Object.keys(data) : <string[]>[];
      const getValue =   (key: string) => data ? data[<keyof typeof data>key] : '';
      const toPair =     (key: string) => key + '=' + encodeURIComponent(getValue(key));  //build query string field-value
      const params =     () => paramKeys.map(toPair).join('&');
      const requestUrl = !paramKeys.length ? url : url + (url.includes('?') ? '&' : '?') + params();
      const httpLine =   `${httpMethod} ${requestUrl}`;
      settings.body =    !isGetRequest && data ? JSON.stringify(data) : null;
      const log = (type: 'response' | 'request', ...items: (string | number | boolean | null)[]) => {
         const logUrl = url.replace(/[?].*/, '');  //security: prevent logging url parameters
         const domain = logUrl.replace(/.*:[/][/]/, '').replace(/[:/].*/, '');  //extract hostname
         if (this.logger)
            this.logger(new Date().toISOString(), type, httpMethod, domain, logUrl, ...<boolean[]>items);
         };
      const toJson = (value: unknown): Promise<any> => {
         const response =    <Response>value;
         const contentType = response.headers.get('content-type');
         const isHead =      httpMethod === 'HEAD';
         const isJson =      !!contentType && /json|javascript/.test(contentType);  //match "application/json" or "text/javascript"
         const headersObj =  () => Object.fromEntries(response.headers.entries());
         const textToObj = (httpBody: string, data?: Json): FetchJsonAltResponse => ({
            http:        httpLine,
            ok:          response.ok,
            error:       !response.ok,
            status:      response.status,
            message:     'Response not JSON',
            contentType: contentType,
            bodyText:    httpBody,
            data:        data ?? null,
            response:    response,
            });
         const jsonToObj = (data: Json): any =>
            response.ok ? data : textToObj(JSON.stringify(data), data);
         const httpErrToObj = (error: Error): FetchJsonAltResponse => ({
            http:        httpLine,
            ok:          false,
            error:       true,
            status:      500,
            message:     'Invalid JSON',
            contentType: contentType,
            bodyText:    error.toString(),
            data:        null,
            response:    response,
            });
         log('response', response.ok, response.status, contentType);
         const returnObj =
            isHead ? response.text().then(headersObj) :
            isJson ? response.json().then(jsonToObj).catch(httpErrToObj) :
            response.text().then(textToObj);
         return returnObj;
         };
      log('request');
      const settingsRequestInit = <RequestInit>JSON.parse(JSON.stringify(settings));  //TODO: <RequestInit>
      const exceptionToObj = (error: Error): FetchJsonAltResponse => ({
         http:        httpLine,
         ok:          false,
         error:       true,
         status:      499,
         message:     'Fetch API exception [' + error.constructor.name + ']',
         contentType: null,
         bodyText:    String(error) + ', Cause: ' + String(error.cause),
         data:        null,
         response:    null,
         });
      return fetch(requestUrl, settingsRequestInit).then(toJson).catch(exceptionToObj);
      },

   get(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<any> {
      return this.request('GET', url, params, options);
      },

   post(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any> {
      return this.request('POST', url, resource, options);
      },

   put(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any> {
      return this.request('PUT', url, resource, options);
      },

   patch(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any> {
      return this.request('PATCH', url, resource, options);
      },

   delete(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any> {
      return this.request('DELETE', url, resource, options);
      },

   head(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<any> {
      return this.request('HEAD', url, params, options);
      },

   logger: <FetchJsonLogger | null>null,

   getLogHeaders(): string[] {
      return ['Timestamp', 'HTTP', 'Method', 'Domain', 'URL', 'Ok', 'Status', 'Type'];
      },

   getLogHeaderIndexMap(): { [header: string]: number } {
      return { timestamp: 0, http: 1, method: 2, domain: 3, url: 4, ok: 5, status: 6, type: 7 };
      },

   enableLogger(customLogger?: FetchJsonLogger): FetchJsonLogger {
      this.logger = customLogger ?? console.log;
      return this.logger;
      },

   disableLogger(): void {
      this.logger = null;
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
