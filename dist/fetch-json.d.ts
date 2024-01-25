//! fetch-json v3.3.0 ~~ https://fetch-json.js.org ~~ MIT License

export type Json = string | number | boolean | null | undefined | JsonObject | Json[];
export type JsonObject = {
    [key: string]: Json;
};
export type JsonData = JsonObject | Json[];
export type FetchJsonInit = {
    strictErrors: boolean;
};
export type FetchJsonOptions = RequestInit & Partial<FetchJsonInit>;
export type FetchJsonMethod = string;
export type FetchJsonParams = {
    [field: string]: string | number | boolean | null | undefined;
};
export type FetchJsonParsedResponse = Json | any;
export type FetchJsonTextResponse = FetchJsonAltResponse;
export type FetchJsonAltResponse = {
    ok: boolean;
    error: boolean;
    status: number;
    contentType: string | null;
    bodyText: string;
    data: Json | null;
    response: Response;
};
export type FetchJsonResponse = FetchJsonParsedResponse | FetchJsonAltResponse;
export type FetchJsonLogger = (dateIso: string, type?: 'response' | 'request', method?: FetchJsonMethod, domain?: string, url?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    baseOptions: FetchJsonOptions;
    getBaseOptions(): FetchJsonOptions;
    setBaseOptions(options: FetchJsonOptions): FetchJsonOptions;
    request<T>(method: FetchJsonMethod, url: string, data?: Json | FetchJsonParams | T, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    get(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    post<T_1>(url: string, resource?: Json | T_1, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    put<T_2>(url: string, resource?: Json | T_2, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    patch<T_3>(url: string, resource?: Json | T_3, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    delete<T_4>(url: string, resource?: Json | T_4, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    head(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<FetchJsonResponse>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndexMap(): {
        [header: string]: number;
    };
    getLogHeaderIndex(): {
        [header: string]: number;
    };
    enableLogger(customLogger?: FetchJsonLogger): FetchJsonLogger;
    disableLogger(): void;
};
declare class FetchJson {
    fetchJson: typeof fetchJson;
    constructor(options?: FetchJsonOptions);
}
export { fetchJson, FetchJson };
