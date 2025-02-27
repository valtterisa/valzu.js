#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { renderToString } from "./utils";
export function useServer(options) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const cwd = process.cwd();
    const compiledPagesDir = options?.pagesDir
        ? path.resolve(options.pagesDir)
        : path.resolve(cwd, ".valzu", "pages");
    if (!fs.existsSync(compiledPagesDir)) {
        console.error(`❌ Compiled pages directory not found at ${compiledPagesDir}. Please run your build process to compile your pages.`);
        process.exit(1);
    }
    const pageFiles = fs
        .readdirSync(compiledPagesDir)
        .filter((file) => file.endsWith(".js"));
    const routes = {};
    pageFiles.forEach((file) => {
        const name = file.replace(/\.js$/, "");
        const route = name === "index" ? "/" : `/${name}`;
        routes[route] = file;
    });
    const server = http.createServer(async (req, res) => {
        const reqUrl = req.url || "/";
        // Serve the client bundle.
        if (reqUrl === "/client.js") {
            const clientFile = path.resolve(cwd, ".valzu", "client.js");
            fs.readFile(clientFile, (err, data) => {
                if (err) {
                    res.statusCode = 404;
                    res.end("Not Found");
                }
                else {
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
            if (ext === ".html")
                contentType = "text/html";
            else if (ext === ".css")
                contentType = "text/css";
            else if (ext === ".js")
                contentType = "application/javascript";
            fs.readFile(staticPath, (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end("Internal Server Error");
                }
                else {
                    res.setHeader("Content-Type", contentType);
                    res.end(data);
                }
            });
            return;
        }
        // Handle dynamic routes.
        if (routes[reqUrl] !== undefined) {
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
                const templatePath = path.resolve(__dirname, "index.html");
                let template = fs.readFileSync(templatePath, "utf8");
                template = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
                template = template.replace("</body>", `<script type="module" src="/client.js"></script></body>`);
                res.setHeader("Content-Type", "text/html");
                res.end(template);
            }
            catch (error) {
                console.error("❌ Error rendering route:", error);
                res.statusCode = 500;
                res.end("Internal Server Error");
            }
            return;
        }
        res.statusCode = 404;
        res.end("Not Found");
    });
    const port = options?.port || Number(process.env.PORT) || 3000;
    server.listen(port, () => {
        console.log(`✅ Production server running on http://localhost:${port}`);
    });
}
