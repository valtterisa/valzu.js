"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express = require("express");
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
/**
 * Starts the Express server.
 * @param options Optional configuration object.
 */
function createServer(options) {
    // Create an Express app instance.
    const app = express();
    const cwd = process.cwd();
    // Determine the directories to use.
    const pagesDir = (options === null || options === void 0 ? void 0 : options.pagesDir)
        ? path.resolve(options.pagesDir)
        : path.resolve(cwd, "src/pages");
    const publicDir = (options === null || options === void 0 ? void 0 : options.publicDir)
        ? path.resolve(options.publicDir)
        : path.resolve(cwd, "public");
    if (!fs.existsSync(pagesDir)) {
        console.error(`❌ Pages directory not found at ${pagesDir}`);
        process.exit(1);
    }
    // Automatically register routes based on page files (.ts or .tsx)
    const pageFiles = fs
        .readdirSync(pagesDir)
        .filter((file) => /\.(ts|tsx)$/.test(file));
    pageFiles.forEach((file) => {
        const pageName = file.replace(/\.(ts|tsx)$/, "");
        const routePath = pageName === "index" ? "/" : `/${pageName}`;
        app.get(routePath, async (req, res) => {
            var _a;
            try {
                const modulePath = path.join(pagesDir, file);
                const { default: Component } = await (_a = modulePath, Promise.resolve().then(() => require(_a)));
                if (!Component) {
                    throw new Error(`Component not found in ${file}`);
                }
                const vnode = Component();
                const appHtml = (0, utils_1.renderToString)(vnode);
                const templatePath = path.resolve(publicDir, "index.html");
                let template = fs.readFileSync(templatePath, "utf8");
                template = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`);
                template = template.replace("</body>", `<script type="module" src="/client.js"></script></body>`);
                res.send(template);
            }
            catch (error) {
                console.error(`❌ Error rendering route ${routePath}:`, error);
                res.status(500).send("Internal Server Error");
            }
        });
    });
    // Serve static files from the public directory.
    app.use(express.static(publicDir));
    app.use("/client.js", express.static(path.resolve(cwd, "dist/client.js")));
    // Determine the port and start listening.
    const port = (options === null || options === void 0 ? void 0 : options.port) || Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`✅ Valzu server running on http://localhost:${port}`);
    });
}
exports.createServer = createServer;
