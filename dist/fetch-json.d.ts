//! fetch-json v2.4.10 ~ github.com/center-key/fetch-json ~ MIT License

export declare type FetchJsonInit = {
    strictErrors: boolean;
};
export declare type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export declare type FetchJsonMethod = RequestInit['method'];
export declare type FetchJsonParams = Record<string, string | number | boolean | null | undefined>;
export declare type FetchJsonBody = Record<string | number, any> | any[];
export declare type FetchJsonParsedResponse = string | number | boolean | null | any | FetchJsonParsedResponse[] | {
    [prop: string]: FetchJsonParsedResponse;
};
export declare type FetchJsonTextResponse = {
    ok: boolean;
    error: boolean;
    status: number;
    contentType: string | null;
    bodyText: string;
    response: Response;
};
export declare type FetchJsonResponse = FetchJsonParsedResponse | FetchJsonTextResponse;
export declare type FetchJsonLogger = (dateIso: string, type?: 'response' | 'request', method?: FetchJsonMethod, logDomain?: string, logUrl?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    baseOptions: FetchJsonOptions;
    getBaseOptions(): FetchJsonOptions;
    setBaseOptions(options: FetchJsonOptions): FetchJsonOptions;
    request(method: FetchJsonMethod, url: string, data?: FetchJsonParams | FetchJsonBody | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    get(url: string, params?: FetchJsonParams | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    post(url: string, resource?: FetchJsonBody | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    put(url: string, resource?: FetchJsonBody | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    patch(url: string, resource?: FetchJsonBody | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    delete(url: string, resource?: FetchJsonBody | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(booleanOrFn?: boolean | FetchJsonLogger | undefined): FetchJsonLogger | null;
};
export { fetchJson };
