#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { renderToString } from "./utils";

export interface ServerOptions {
  pagesDir?: string;
  // publicDir is now removed since index.html is at the root.
  port?: number;
}

/**
 * Legacy server for backward compatibility
 * @deprecated Use the Vite SSR setup instead
 */
export function useServer(options?: ServerOptions): void {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const cwd: string = process.cwd();

  const compiledPagesDir: string = options?.pagesDir
    ? path.resolve(options.pagesDir)
    : path.resolve(cwd, ".valzu", "pages");

  if (!fs.existsSync(compiledPagesDir)) {
    console.error(
      `❌ Compiled pages directory not found at ${compiledPagesDir}. Please run your build process to compile your pages.`
    );
    process.exit(1);
  }

  const pageFiles: string[] = fs
    .readdirSync(compiledPagesDir)
    .filter((file) => file.endsWith(".js"));

  const routes: { [route: string]: string } = {};
  pageFiles.forEach((file) => {
    const name: string = file.replace(/\.js$/, "");
    const route: string = name === "index" ? "/" : `/${name}`;
    routes[route] = file;
  });

  const server = http.createServer(async (req, res) => {
    const reqUrl: string = req.url || "/";

    // Serve the client bundle.
    if (reqUrl === "/client.js") {
      const clientFile: string = path.resolve(cwd, ".valzu", "client.js");
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

    // If you had other static assets before in the public directory,
    // you may need to update or remove this block if they're no longer used.
    const staticPath: string = path.resolve(cwd, "." + reqUrl);
    if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      let contentType: string = "text/plain";
      const ext: string = path.extname(staticPath);
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

    // Handle dynamic routes.
    if (routes[reqUrl] !== undefined) {
      try {
        const file: string = routes[reqUrl];
        const modulePath: string = path.join(compiledPagesDir, file);
        const moduleUrl: string = pathToFileURL(modulePath).href;
        const importedModule = await import(moduleUrl);
        const Component = importedModule.default;
        if (!Component) {
          throw new Error(`Component not found in ${file}`);
        }
        const vnode: any = await Component();
        const appHtml: string = renderToString(vnode);

        // Read the HTML template from the project root.
        const templatePath: string = path.resolve(cwd, "index.html");
        let template: string = fs.readFileSync(templatePath, "utf8");
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
        console.error("❌ Error rendering route:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
      return;
    }

    res.statusCode = 404;
    res.end("Not Found");
  });

  const port: number = options?.port || Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`✅ Production server running on http://localhost:${port}`);
  });
}

/**
 * Creates an SSR handler for Express.js
 * Use this with Vite in production for React-based SSR
 */
export function createSSRHandler(options: {
  template: string;
  render: (url: string) => Promise<{ html: string; head: string }>;
}) {
  return async (req: any, res: any) => {
    try {
      const url = req.originalUrl || req.url;
      const { html, head } = await options.render(url);

      let finalHtml = options.template;
      
      // Replace the head placeholder with collected SEO tags
      finalHtml = finalHtml.replace("<!--head-tags-->", head);
      
      // Replace the app placeholder with rendered HTML
      finalHtml = finalHtml.replace("<!--ssr-outlet-->", html);

      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    } catch (e) {
      console.error("SSR Error:", e);
      res.status(500).end("Internal Server Error");
    }
  };
}

