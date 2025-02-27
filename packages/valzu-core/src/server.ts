#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { renderToString } from "./utils";

export interface ServerOptions {
  pagesDir?: string;
  publicDir?: string;
  port?: number;
}

/**
 * Starts the production server.
 *
 * This version loads compiled page modules from .valzu/pages instead of the raw TypeScript files.
 */
export function useServer(options?: ServerOptions): void {
  // Create __dirname in ESM.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const cwd: string = process.cwd();

  // Use the compiled pages directory instead of the raw pages folder.
  const compiledPagesDir: string = options?.pagesDir
    ? path.resolve(options.pagesDir)
    : path.resolve(cwd, ".valzu", "pages");
  const publicDir: string = options?.publicDir
    ? path.resolve(options.publicDir)
    : path.resolve(cwd, "public");

  if (!fs.existsSync(compiledPagesDir)) {
    console.error(
      `❌ Compiled pages directory not found at ${compiledPagesDir}. Please run your build process to compile your pages.`
    );
    process.exit(1);
  }

  // Read compiled pages (only .js files) from the compiled directory.
  const pageFiles: string[] = fs
    .readdirSync(compiledPagesDir)
    .filter((file) => file.endsWith(".js"));

  // Build route mapping: index.js -> "/", about.js -> "/about", etc.
  const routes: { [route: string]: string } = {};
  pageFiles.forEach((file) => {
    const name: string = file.replace(/\.js$/, "");
    const route: string = name === "index" ? "/" : `/${name}`;
    routes[route] = file;
  });

  // Create the HTTP server.
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

    // Serve static files from the public directory.
    const staticPath: string = path.resolve(publicDir, "." + reqUrl);
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

        // Read the HTML template.
        const templatePath: string = path.resolve(publicDir, "index.html");
        let template: string = fs.readFileSync(templatePath, "utf8");
        template = template.replace(
          '<div id="app"></div>',
          `<div id="app">${appHtml}</div>`
        );
        // Inject the client bundle.
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
