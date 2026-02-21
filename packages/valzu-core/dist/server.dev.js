#!/usr/bin/env node
import {
  renderToString
} from "./chunk-67RIZRTL.js";

// src/server.dev.ts
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
function useServerDev(options) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const cwd = process.cwd();
  const pagesDir = options?.pagesDir ? path.resolve(options.pagesDir) : path.resolve(cwd, "pages");
  if (!fs.existsSync(pagesDir)) {
    console.error(`\u274C Pages directory not found at ${pagesDir}`);
    process.exit(1);
  }
  const pageFiles = fs.readdirSync(pagesDir).filter((file) => /\.(ts|tsx)$/.test(file));
  const routes = {};
  pageFiles.forEach((file) => {
    const name = file.replace(/\.(ts|tsx)$/, "");
    const route = name === "index" ? "/" : `/${name}`;
    routes[route] = file;
  });
  const sseClients = [];
  const server = http.createServer(async (req, res) => {
    const reqUrl = req.url || "/";
    if (reqUrl === "/hmr") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });
      res.write("\n");
      sseClients.push(res);
      req.on("close", () => {
        const index = sseClients.indexOf(res);
        if (index !== -1) sseClients.splice(index, 1);
      });
      return;
    }
    if (reqUrl === "/client.js") {
      const clientFile = path.resolve(cwd, ".valzu/client.js");
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
    if (routes[reqUrl] !== void 0) {
      try {
        const file = routes[reqUrl];
        const modulePath = path.join(pagesDir, file);
        const moduleUrl = pathToFileURL(modulePath).href;
        const importedModule = await import(moduleUrl);
        const Component = importedModule.default;
        if (!Component) throw new Error(`Component not found in ${file}`);
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
          `<script type="module" src="/client.js"></script>
           <script type="module">
             const evtSource = new EventSource('/hmr');
             evtSource.onmessage = (event) => {
               if (event.data === 'reload') {
                 console.log('Changes detected. Reloading page...');
                 location.reload();
               }
             };
           </script>
           </body>`
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
    console.log(`\u2705 Dev server running on http://localhost:${port}`);
  });
  function notifyClients() {
    for (const client of sseClients) {
      client.write("data: reload\n\n");
    }
  }
  fs.watch(pagesDir, { recursive: true }, (event, filename) => {
    console.log(`File changed in pages: ${filename} (event: ${event})`);
    notifyClients();
  });
  const clientPath = path.resolve(cwd, ".valzu/client.js");
  fs.watchFile(clientPath, (curr, prev) => {
    if (curr.mtime.getTime() !== prev.mtime.getTime()) {
      console.log("Client bundle changed.");
      notifyClients();
    }
  });
}
export {
  useServerDev
};
//# sourceMappingURL=server.dev.js.map