#!/usr/bin/env node
import {
  renderToString
} from "./chunk-67RIZRTL.js";

// src/server.ts
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
function useServer(options) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const cwd = process.cwd();
  const compiledPagesDir = options?.pagesDir ? path.resolve(options.pagesDir) : path.resolve(cwd, ".landr", "pages");
  if (!fs.existsSync(compiledPagesDir)) {
    console.error(
      `\u274C Compiled pages directory not found at ${compiledPagesDir}. Please run your build process to compile your pages.`
    );
    process.exit(1);
  }
  const pageFiles = fs.readdirSync(compiledPagesDir).filter((file) => file.endsWith(".js"));
  const routes = {};
  pageFiles.forEach((file) => {
    const name = file.replace(/\.js$/, "");
    const route = name === "index" ? "/" : `/${name}`;
    routes[route] = file;
  });
  const server = http.createServer(async (req, res) => {
    const reqUrl = req.url || "/";
    if (reqUrl === "/client.js") {
      const clientFile = path.resolve(cwd, ".landr", "client.js");
      fs.readFile(clientFile, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("Not Found");
        } else {
          res.setHeader("Content-Type", "application/javascript");
          res.end(data);
        }
      });
      return;
    }
    const staticPath = path.resolve(cwd, "." + reqUrl);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      let contentType = "text/plain";
      const ext = path.extname(staticPath);
      if (ext === ".html") contentType = "text/html";
      else if (ext === ".css") contentType = "text/css";
      else if (ext === ".js") contentType = "application/javascript";
      fs.readFile(staticPath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          res.setHeader("Content-Type", contentType);
          res.end(data);
        }
      });
      return;
    }
    if (routes[reqUrl] !== void 0) {
      try {
        const file = routes[reqUrl];
        const modulePath = path.join(compiledPagesDir, file);
        const moduleUrl = pathToFileURL(modulePath).href;
        const importedModule = await import(moduleUrl);
        const Component = importedModule.default;
        if (!Component) {
          throw new Error(`Component not found in ${file}`);
        }
        const vnode = await Component();
        const appHtml = renderToString(vnode);
        const templatePath = path.resolve(cwd, "index.html");
        let template = fs.readFileSync(templatePath, "utf8");
        template = template.replace(
          '<div id="app"></div>',
          `<div id="app">${appHtml}</div>`
        );
        template = template.replace(
          "</body>",
          `<script type="module" src="/client.js"></script></body>`
        );
        res.setHeader("Content-Type", "text/html");
        res.end(template);
      } catch (error) {
        console.error("\u274C Error rendering route:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
      return;
    }
    res.statusCode = 404;
    res.end("Not Found");
  });
  const port = options?.port || Number(process.env.PORT) || 3e3;
  server.listen(port, () => {
    console.log(`\u2705 Production server running on http://localhost:${port}`);
  });
}
function createSSRHandler(options) {
  return async (req, res) => {
    try {
      const url = req.originalUrl || req.url;
      const { html, head } = await options.render(url);
      let finalHtml = options.template;
      finalHtml = finalHtml.replace("<!--head-tags-->", head);
      finalHtml = finalHtml.replace("<!--ssr-outlet-->", html);
      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    } catch (e) {
      console.error("SSR Error:", e);
      res.status(500).end("Internal Server Error");
    }
  };
}
export {
  createSSRHandler,
  useServer
};
//# sourceMappingURL=server.js.map