//! fetch-json v2.4.1 ~ github.com/center-key/fetch-json ~ MIT License

declare type FetchJsonInit = {
    strictErrors: boolean;
};
declare type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
declare type FetchJsonMethod = RequestInit['method'];
declare type FetchJsonBody = RequestInit['body'];
declare type FetchJsonResponseExtra = {
    error: boolean;
    contentType: string | null;
    bodyText: string;
};
declare type FetchJsonResponse = Response & Partial<FetchJsonResponseExtra>;
declare type FetchJsonLogger = (dateIso: string, type?: 'response' | 'request', method?: FetchJsonMethod, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    request(method: FetchJsonMethod, url: string, data?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    get(url: string, params?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    post(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    put(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    patch(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    delete(url: string, resource?: FetchJsonBody, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(booleanOrFn: boolean | FetchJsonLogger): FetchJsonLogger | null;
};
export { fetchJson };
