var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import fs from "fs";
import path from "path";
export function createElement(type, props = {}, ...children) {
    return { type, props, children };
}
export function renderToString(vnode) {
    if (typeof vnode === "string")
        return vnode;
    const props = Object.entries(vnode.props || {})
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ");
    const children = vnode.children.map(renderToString).join("");
    return `<${vnode.type} ${props}>${children}</${vnode.type}>`;
}
export function useState(initialValue) {
    let state = initialValue;
    const getState = () => state;
    const setState = (newValue) => {
        state = newValue;
    };
    return [getState, setState];
}
export function useClient(endpoint, method = "GET", data = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: data ? JSON.stringify(data) : null,
        });
        return response.json();
    });
}
export function useServer(fetchFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetchFunction();
    });
}
export function createServer(routes) {
    const app = express();
    app.use(express.json());
    app.use(express.static("public"));
    routes.forEach(({ path: routePath, component }) => {
        if (component) {
            app.get(routePath, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let appHtml = "";
                if (typeof component === "function") {
                    const data = component.getServerData
                        ? yield component.getServerData()
                        : {};
                    appHtml = renderToString(component(data));
                }
                else {
                    appHtml = renderToString(component);
                }
                const template = fs.readFileSync(path.resolve("public/index.html"), "utf8");
                res.send(template.replace("<!-- APP -->", appHtml));
            }));
        }
    });
    app.listen(3000, () => console.log("Server running on http://localhost:3000"));
}
export default {
    createElement,
    renderToString,
    useState,
    useClient,
    useServer,
    createServer,
};
