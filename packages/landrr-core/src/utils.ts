/**
 * Create JSX-like elements (legacy API).
 * @deprecated Use React components instead
 */
export function element(
  type: string,
  props: Record<string, any> = {},
  ...children: any[]
) {
  const vnode = { type, props, children };
  return vnode;
}

/**
 * Render a virtual DOM node (or tree) to an HTML string (legacy API).
 * @deprecated Use React's renderToString instead
 */
export function renderToString(vnode: any): string {
  if (typeof vnode === "string") return vnode;
  const propsString = vnode.props
    ? Object.entries(vnode.props)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")
    : "";
  const childrenString = vnode.children
    ? vnode.children.map(renderToString).join("")
    : "";
  return `<${vnode.type}${
    propsString ? " " + propsString : ""
  }>${childrenString}</${vnode.type}>`;
}

/**
 * Hydrate the server-rendered content by binding events
 * from the virtual DOM (vDOM) to the actual DOM (legacy API).
 * @deprecated Use React's hydrateRoot instead
 */
export function hydrate(container: HTMLElement) {
  if (!container) {
    return;
  }

  // Reconstruct vDOM from actual DOM.
  function retrieveVNode(node: Element | ChildNode): any {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    const element = node as Element;
    const props: Record<string, any> = {};
    if (element.attributes) {
      for (const attr of Array.from(element.attributes)) {
        props[attr.name] = attr.value;
      }
    }
    const children = Array.from(element.childNodes).map((child) =>
      retrieveVNode(child)
    );
    return {
      type: element.nodeName.toLowerCase(),
      props,
      children,
    };
  }

  // Bind event listeners from the vDOM to the actual DOM.
  function bindEvents(domNode: Element | ChildNode, vnode: any) {
    if (typeof vnode === "string") return;
    const element = domNode as Element;
    if (vnode.props) {
      Object.entries(vnode.props).forEach(([key, value]) => {
        if (key.startsWith("on") && typeof value === "function") {
          const eventName = key.slice(2).toLowerCase();
          element.addEventListener(eventName, value as EventListener);
        }
      });
    }
    const domChildren = Array.from(element.childNodes);
    if (vnode.children) {
      vnode.children.forEach((childVNode: any, index: number) => {
        const childDomNode = domChildren[index];
        if (childDomNode) {
          bindEvents(childDomNode, childVNode);
        }
      });
    }
  }

  const serverVNode = retrieveVNode(container);
  bindEvents(container, serverVNode);

  // Optional: rehydrate on navigation events.
  window.addEventListener("popstate", () => {
    hydrate(container);
  });

  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLAnchorElement;
    if (
      target.tagName === "A" &&
      target.href.startsWith(window.location.origin)
    ) {
      event.preventDefault();
      window.history.pushState({}, "", target.pathname);
      fetch(target.pathname)
        .then((res) => res.text())
        .then((html) => {
          const newDoc = new DOMParser().parseFromString(html, "text/html");
          const newApp = newDoc.querySelector("#app");
          if (newApp) {
            container.innerHTML = newApp.innerHTML;
            hydrate(container);
          }
        });
    }
  });
}
