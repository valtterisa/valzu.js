import express from "express";
import fs from "fs";
import path from "path";

// 🔹 Create JSX-like Elements
export function createElement(
  type: string,
  props: Record<string, any> = {},
  ...children: any[]
) {
  return { type, props, children };
}

// 🔹 Server-Side Rendering (Convert Elements to HTML)
export function renderToString(vnode: any): string {
  if (typeof vnode === "string") return vnode;
  const props = Object.entries(vnode.props || {})
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  const children = vnode.children.map(renderToString).join("");
  return `<${vnode.type} ${props}>${children}</${vnode.type}>`;
}

// Ensure we use the user's project `/pages/` directory
const pagesDir = path.resolve(process.cwd(), "src/pages");

export function createServer() {
  const app = express();
  console.log("🚀 Starting Valzu.js server...");

  app.use(express.json());

  // Ensure the user's project has a `/pages/` directory
  if (!fs.existsSync(pagesDir)) {
    console.error(
      `❌ Error: The /pages/ directory is missing in ${process.cwd()}`
    );
    return;
  }

  const pageFiles = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".ts"));

  pageFiles.forEach((file) => {
    const pageName = file.replace(/\.ts$/, "");
    const routePath = pageName === "index" ? "/" : `/${pageName}`;

    loadPage(path.resolve(pagesDir, file))
      .then(({ default: component }) => {
        if (!component) {
          console.error(`❌ Failed to load component for ${routePath}`);
          return;
        }

        console.log(`✅ Route registered: ${routePath}`);

        app.get(routePath, async (req, res) => {
          console.log(`➡️ Request received for ${routePath}`);

          let appHtml = renderToString(component());

          let template = fs.readFileSync(
            path.resolve(process.cwd(), "public/index.html"),
            "utf8"
          );

          if (template.includes('<div id="app"></div>')) {
            template = template.replace(
              '<div id="app"></div>',
              `<div id="app">${appHtml}</div>`
            );

            // Auto-inject hydration script
            template = template.replace(
              "</body>",
              `<script type="module" src="/client.js"></script></body>`
            );

            console.log("✅ Injected hydration script!");
          } else {
            console.error(
              "❌ Could not find <div id='app'></div> in index.html!"
            );
          }

          res.send(template);
        });
      })
      .catch((err) => console.error(`❌ Failed to load ${file}:`, err));
  });

  app.use(
    "/client.js",
    express.static(path.resolve(process.cwd(), "dist/client.js"))
  );
  app.use(express.static(path.resolve(process.cwd(), "public")));

  // Prevent multiple server instances
  if (!process.env.VALZU_STARTED) {
    process.env.VALZU_STARTED = "true";
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`✅ Valzu.js server running on http://localhost:${PORT}`)
    );
  }
}

// Auto-start server when Valzu.js is loaded
if (typeof process !== "undefined") {
  console.log("🟢 Starting Valzu.js...");
}

// 🔹 Hydration Function (Runs Automatically in Browser)
export function hydrate(container: HTMLElement) {
  if (!container) {
    console.error("❌ Hydration failed: No container element found.");
    return;
  }

  console.log("🛠️ Hydrating server-rendered content...");

  function bindEvents(node: HTMLElement, vnode: any) {
    if (!vnode || typeof vnode === "string") return;

    Object.entries(vnode.props || {}).forEach(([key, value]) => {
      if (key.startsWith("on")) {
        const eventName = key.substring(2).toLowerCase();
        node.addEventListener(
          eventName as keyof HTMLElementEventMap,
          value as EventListener
        );
      } else {
        node.setAttribute(key, value as string);
      }
    });

    Array.from(node.children).forEach((childNode, index) => {
      bindEvents(childNode as HTMLElement, vnode.children?.[index]);
    });
  }

  function retrieveVNode(container: HTMLElement): any {
    const parseNode = (node: HTMLElement | ChildNode): any => {
      if (node.nodeType === 3) return node.textContent;

      const props: Record<string, any> = {};
      for (const attr of (node as HTMLElement).attributes || []) {
        props[attr.name] = attr.value;
      }

      return {
        type: node.nodeName.toLowerCase(),
        props,
        children: Array.from(node.childNodes).map(parseNode),
      };
    };

    return parseNode(container);
  }

  const serverVNode = retrieveVNode(container);
  bindEvents(container, serverVNode);

  console.log("✅ Hydration complete!");

  // 🔥 Detect page navigation & rehydrate new pages
  window.addEventListener("popstate", () => {
    console.log("🔄 Page changed, rehydrating...");
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
          const newAppContent = newDoc.querySelector("#app")?.innerHTML || "";
          container.innerHTML = newAppContent;
          hydrate(container);
        });
    }
  });
}

// 🔹 Auto-run hydration in the browser
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("🔄 Hydrating page...");
    const container = document.querySelector("#app");
    if (container) hydrate(container as HTMLElement);
  });
}

// 🔹 Auto-start server when Valzu.js is loaded
if (typeof process !== "undefined") {
  console.log("🟢 Starting Valzu.js...");
  createServer(); // Automatically runs when project starts
}

export default {
  createElement,
  renderToString,
  createServer,
  hydrate,
};
