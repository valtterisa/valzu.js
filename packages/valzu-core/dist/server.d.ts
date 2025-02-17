export interface ServerOptions {
    pagesDir?: string;
    publicDir?: string;
    port?: number;
}
/**
 * Starts the Express server.
 * @param options Optional configuration object.
 */
export declare function useServer(options?: ServerOptions): void;
