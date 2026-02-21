#!/usr/bin/env node
export interface ServerOptions {
    pagesDir?: string;
    port?: number;
}
/**
 * Legacy server for backward compatibility
 * @deprecated Use the Vite SSR setup instead
 */
export declare function useServer(options?: ServerOptions): void;
/**
 * Creates an SSR handler for Express.js
 * Use this with Vite in production for React-based SSR
 */
export declare function createSSRHandler(options: {
    template: string;
    render: (url: string) => Promise<{
        html: string;
        head: string;
    }>;
}): (req: any, res: any) => Promise<void>;
//# sourceMappingURL=server.d.ts.map