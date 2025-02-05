export declare function createElement(type: string, props?: Record<string, any>, ...children: any[]): {
    type: string;
    props: Record<string, any>;
    children: any[];
};
export declare function renderToString(vnode: any): string;
export declare function loadPage(filePath: string): Promise<any>;
export declare function createServer(): void;
export declare function hydrate(container: HTMLElement): void;
declare const _default: {
    createElement: typeof createElement;
    renderToString: typeof renderToString;
    createServer: typeof createServer;
    hydrate: typeof hydrate;
};
export default _default;
