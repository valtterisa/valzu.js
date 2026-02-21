/**
 * Create JSX-like elements (legacy API).
 * @deprecated Use React components instead
 */
export declare function element(type: string, props?: Record<string, any>, ...children: any[]): {
    type: string;
    props: Record<string, any>;
    children: any[];
};
/**
 * Render a virtual DOM node (or tree) to an HTML string (legacy API).
 * @deprecated Use React's renderToString instead
 */
export declare function renderToString(vnode: any): string;
/**
 * Hydrate the server-rendered content by binding events
 * from the virtual DOM (vDOM) to the actual DOM (legacy API).
 * @deprecated Use React's hydrateRoot instead
 */
export declare function hydrate(container: HTMLElement): void;
//# sourceMappingURL=utils.d.ts.map