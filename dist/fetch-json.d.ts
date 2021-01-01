//! fetch-json v2.3.0 ~ github.com/center-key/fetch-json ~ MIT License

declare type FetchOptions = {
    [key: string]: number | string | boolean | HttpHeaders;
};
declare type HttpHeaders = {
    [key: string]: number | string | boolean;
};
declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE';
declare type RequestData = {
    [key in number | string]: RequestDataValue;
} | RequestDataValue[] | UrlParams;
declare type RequestDataValue = number | string | boolean | null | RequestData;
declare type UrlParams = {
    [key in number | string]: UrlParamValue;
};
declare type UrlParamValue = number | string | boolean;
declare type FetchResponseText = {
    error?: boolean;
    contentType?: string | null;
    bodyText?: string;
};
declare type FetchResponse = Response & FetchResponseText;
declare type Logger = (dateIso?: string, type?: 'response' | 'request', method?: HttpMethod, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    request(method: HttpMethod, url: string, data?: {
        [x: string]: RequestDataValue;
        [x: number]: RequestDataValue;
    } | RequestDataValue[] | UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    get(url: string, params?: UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    post(url: string, resource?: {
        [x: string]: RequestDataValue;
        [x: number]: RequestDataValue;
    } | RequestDataValue[] | UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    put(url: string, resource?: {
        [x: string]: RequestDataValue;
        [x: number]: RequestDataValue;
    } | RequestDataValue[] | UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    patch(url: string, resource?: {
        [x: string]: RequestDataValue;
        [x: number]: RequestDataValue;
    } | RequestDataValue[] | UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    delete(url: string, resource?: {
        [x: string]: RequestDataValue;
        [x: number]: RequestDataValue;
    } | RequestDataValue[] | UrlParams | undefined, options?: FetchOptions | undefined): Promise<FetchResponse>;
    logger: Logger | null;
    getLogHeaders(): string[];
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(booleanOrFn: boolean | Logger): Logger | null;
};
export { fetchJson };
