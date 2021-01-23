//! fetch-json v2.4.3 ~ github.com/center-key/fetch-json ~ MIT License

export declare type FetchJsonInit = {
    strictErrors: boolean;
};
export declare type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export declare type FetchJsonMethod = RequestInit['method'];
export declare type FetchJsonObject = Record<string | number, unknown>;
export declare type FetchJsonParams = FetchJsonObject;
export declare type FetchJsonBody = FetchJsonObject | unknown[];
export declare type FetchJsonTextResponse = {
    ok: boolean;
    error: boolean;
    status: number;
    contentType: string | null;
    bodyText: string;
    response: Response;
};
export declare type FetchJsonResponse = unknown | FetchJsonTextResponse;
export declare type FetchJsonLogger = (dateIso: string, type?: 'response' | 'request', method?: FetchJsonMethod, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    request(method: FetchJsonMethod, url: string, data?: unknown[] | Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    get(url: string, params?: Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    post(url: string, resource?: unknown[] | Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    put(url: string, resource?: unknown[] | Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    patch(url: string, resource?: unknown[] | Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    delete(url: string, resource?: unknown[] | Record<string | number, unknown> | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(booleanOrFn?: boolean | FetchJsonLogger | undefined): FetchJsonLogger | null;
};
export { fetchJson };
