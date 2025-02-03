import express from "express";
import fs from "fs";
import path from "path";

export function createElement(
  type: string,
  props: Record<string, any> = {},
  ...children: any[]
) {
  return { type, props, children };
}

export function renderToString(vnode: any): string {
  if (typeof vnode === "string") return vnode;
  const props = Object.entries(vnode.props || {})
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  const children = vnode.children.map(renderToString).join("");
  return `<${vnode.type} ${props}>${children}</${vnode.type}>`;
}

export function useState<T>(initialValue: T): [() => T, (value: T) => void] {
  let state = initialValue;
  const getState = () => state;
  const setState = (newValue: T) => {
    state = newValue;
  };
  return [getState, setState];
}

export async function useClient<T>(
  endpoint: string,
  method: string = "GET",
  data: any = null
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  });
  return response.json();
}

export async function useServer<T>(
  fetchFunction: () => Promise<T>
): Promise<T> {
  return await fetchFunction();
}

export function createServer(routes: { path: string; component?: any }[]) {
  const app = express();
  app.use(express.json());
  app.use(express.static("public"));

  routes.forEach(({ path, component }) => {
    if (component) {
      app.get(path, async (req, res) => {
        let appHtml = "";
        if (typeof component === "function") {
          const data = component.getServerData
            ? await component.getServerData()
            : {};
          appHtml = renderToString(component(data));
        } else {
          appHtml = renderToString(component);
        }

        const template = fs.readFileSync(
          path.resolve("public/index.html"),
          "utf8"
        );
        res.send(template.replace("<!-- APP -->", appHtml));
      });
    }
  });

  app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  );
}

export default {
  createElement,
  renderToString,
  useState,
  useClient,
  useServer,
  createServer,
};
