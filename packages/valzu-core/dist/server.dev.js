#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { renderToString } from "./utils";
/**
 * Starts the development server with a simple HMR system.
 */
export function useServerDev(options) {
    // Create __dirname in ESM.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const cwd = process.cwd();
    const pagesDir = options?.pagesDir
        ? path.resolve(options.pagesDir)
        : path.resolve(cwd, "pages");
    const publicDir = options?.publicDir
        ? path.resolve(options.publicDir)
        : path.resolve(cwd, "public");
    if (!fs.existsSync(pagesDir)) {
        console.error(`❌ Pages directory not found at ${pagesDir}`);
        process.exit(1);
    }
    // Build a route mapping.
    const pageFiles = fs
        .readdirSync(pagesDir)
        .filter((file) => /\.(ts|tsx)$/.test(file));
    const routes = {};
    pageFiles.forEach((file) => {
        const name = file.replace(/\.(ts|tsx)$/, "");
        const route = name === "index" ? "/" : `/${name}`;
        routes[route] = file;
    });
    // Array to hold active SSE responses.
    const sseClients = [];
    // Create the HTTP server.
    const server = http.createServer(async (req, res) => {
        const reqUrl = req.url || "/";
        // SSE endpoint for HMR.
        if (reqUrl === "/hmr") {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            });
            res.write("\n"); // Establish connection.
            sseClients.push(res);
            req.on("close", () => {
                const index = sseClients.indexOf(res);
                if (index !== -1)
                    sseClients.splice(index, 1);
            });
            return;
        }
        // Serve client.js from .valzu.
        if (reqUrl === "/client.js") {
            const clientFile = path.resolve(cwd, ".valzu/client.js");
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
        // Serve static files from the public directory.
        const staticPath = path.resolve(publicDir, "." + reqUrl);
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
                const modulePath = path.join(pagesDir, file);
                const moduleUrl = pathToFileURL(modulePath).href;
                const importedModule = await import(moduleUrl);
                const Component = importedModule.default;
                if (!Component)
                    throw new Error(`Component not found in ${file}`);
                const vnode = await Component();
                const appHtml = renderToString(vnode);
                const templatePath = path.resolve(publicDir, "index.html");
                let template = fs.readFileSync(templatePath, "utf8");
                template = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
                // Inject client bundle and HMR client code (using SSE).
                template = template.replace("</body>", `<script type="module" src="/client.js"></script>
           <script type="module">
             const evtSource = new EventSource('/hmr');
             evtSource.onmessage = (event) => {
               if (event.data === 'reload') {
                 console.log('Changes detected. Reloading page...');
                 location.reload();
               }
             };
           </script>
           </body>`);
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
        // Fallback: 404 Not Found.
        res.statusCode = 404;
        res.end("Not Found");
    });
    const port = options?.port || Number(process.env.PORT) || 3000;
    server.listen(port, () => {
        console.log(`✅ Dev server running on http://localhost:${port}`);
    });
    // Helper: notify all connected SSE clients.
    function notifyClients() {
        for (const client of sseClients) {
            client.write("data: reload\n\n");
        }
    }
    // Watch for changes in the pages directory.
    fs.watch(pagesDir, { recursive: true }, (event, filename) => {
        console.log(`File changed in pages: ${filename} (event: ${event})`);
        notifyClients();
    });
    // Also watch for changes in the client bundle.
    const clientPath = path.resolve(cwd, ".valzu/client.js");
    fs.watchFile(clientPath, (curr, prev) => {
        if (curr.mtime.getTime() !== prev.mtime.getTime()) {
            console.log("Client bundle changed.");
            notifyClients();
        }
    });
}
