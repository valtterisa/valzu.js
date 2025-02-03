export declare function createElement(type: string, props?: Record<string, any>, ...children: any[]): {
    type: string;
    props: Record<string, any>;
    children: any[];
};
export declare function renderToString(vnode: any): string;
export declare function useState<T>(initialValue: T): [() => T, (value: T) => void];
export declare function useClient<T>(endpoint: string, method?: string, data?: any): Promise<T>;
export declare function useServer<T>(fetchFunction: () => Promise<T>): Promise<T>;
export declare function createServer(routes: {
    path: string;
    component?: any;
}[]): void;
declare const _default: {
    createElement: typeof createElement;
    renderToString: typeof renderToString;
    useState: typeof useState;
    useClient: typeof useClient;
    useServer: typeof useServer;
    createServer: typeof createServer;
};
export default _default;
