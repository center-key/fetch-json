declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'trace';
declare type Credential = 'omit' | 'same-origin' | 'include';
declare type Mode = 'cors' | 'no-cors' | 'same-origin';
interface RequestOptions {
    method: Method;
    headers: RequestHeaders;
    body: string;
    strictErrors: boolean;
    credentials?: Credential;
    mode: Mode;
    referrer: string;
}
declare type RequestData = {
    [key: string]: string | number | boolean;
};
declare type FetchRequest = (method: Method, url: string, data: RequestData, options: RequestOptions) => Promise<Response>;
declare type FetchRequestWithMethod = (url: string, data: RequestData, options: RequestOptions) => Promise<Response>;
export declare type LoggerFn = (dateIso?: string, type?: 'response' | 'request', method?: Method, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string) => void;
declare type Log = (...x: any[]) => void;
declare type Logger = LoggerFn | null | Log;
export declare type RequestHeaders = Headers | {
    [key: string]: string;
};
export default interface FetchJson {
    version: string;
    request: FetchRequest;
    get: FetchRequestWithMethod;
    post: FetchRequestWithMethod;
    put: FetchRequestWithMethod;
    patch: FetchRequestWithMethod;
    delete: FetchRequestWithMethod;
    logger?: Logger;
    getLogHeaders: () => string[];
    getLogHeaderIndex: () => {
        [key: string]: number;
    };
    enableLogger: (x: boolean | LoggerFn) => Logger;
}
export {};
