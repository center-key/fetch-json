//! fetch-json v3.3.9 ~~ https://fetch-json.js.org ~~ MIT License

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
export type FetchJsonAltResponse = {
    ok: boolean;
    error: boolean;
    status: number;
    contentType: string | null;
    bodyText: string;
    data: Json;
    response: Response;
};
export type FetchJsonResponse = Json | FetchJsonAltResponse;
export type FetchJsonLogger = (dateIso: string, type?: 'response' | 'request', method?: FetchJsonMethod, domain?: string, url?: string, ok?: boolean, status?: number, statusText?: string, contentType?: string | null) => void;
declare const fetchJson: {
    version: string;
    baseOptions: FetchJsonOptions;
    assert(ok: unknown, message: string | null): void;
    getBaseOptions(): FetchJsonOptions;
    setBaseOptions(options: FetchJsonOptions): FetchJsonOptions;
    request(method: FetchJsonMethod, url: string, data?: unknown, options?: FetchJsonOptions): Promise<any>;
    get(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<any>;
    post(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any>;
    put(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any>;
    patch(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any>;
    delete(url: string, resource?: unknown, options?: FetchJsonOptions): Promise<any>;
    head(url: string, params?: FetchJsonParams, options?: FetchJsonOptions): Promise<any>;
    logger: FetchJsonLogger | null;
    getLogHeaders(): string[];
    getLogHeaderIndexMap(): {
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
