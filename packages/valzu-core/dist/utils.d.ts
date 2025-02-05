/**
 * Create JSX-like elements.
 */
export declare function createElement(type: string, props?: Record<string, any>, ...children: any[]): {
    type: string;
    props: Record<string, any>;
    children: any[];
};
/**
 * Render a virtual DOM node (or tree) to an HTML string.
 */
export declare function renderToString(vnode: any): string;
/**
 * Hydrate the server-rendered content by binding events
 * from the virtual DOM (vDOM) to the actual DOM.
 */
export declare function hydrate(container: HTMLElement): void;
