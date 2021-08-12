//! fetch-json v2.6.0 ~ github.com/center-key/fetch-json ~ MIT License

export declare type Json = string | number | boolean | null | undefined | Json[] | {
    [key: string]: Json;
};
export declare type JsonObject = {
    [key: string]: Json;
};
export declare type JsonArray = Json[];
export declare type JsonData = JsonObject | JsonArray;
export declare type FetchJsonInit = {
    strictErrors: boolean;
};
export declare type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export declare type FetchJsonMethod = RequestInit['method'];
export declare type FetchJsonParams = {
    [field: string]: string | number | boolean | null | undefined;
};
export declare type FetchJsonParsedResponse = Json | any;
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
    request<T>(method: FetchJsonMethod, url: string, data?: Json | FetchJsonParams | T, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    get(url: string, params?: FetchJsonParams | undefined, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    post<T_1>(url: string, resource?: Json | T_1, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    put<T_2>(url: string, resource?: Json | T_2, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    patch<T_3>(url: string, resource?: Json | T_3, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    delete<T_4>(url: string, resource?: Json | T_4, options?: FetchJsonOptions | undefined): Promise<FetchJsonResponse>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(booleanOrFn?: boolean | FetchJsonLogger | undefined): FetchJsonLogger | null;
};
declare class FetchJson {
    fetchJson: typeof fetchJson;
    constructor(options?: FetchJsonOptions);
}
export { fetchJson, FetchJson };
