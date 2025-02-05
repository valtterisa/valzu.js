"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
function createServer() {
    const app = (0, express_1.default)();
    const cwd = process.cwd(); // Assumes user’s project root is current working directory
    const pagesDir = path_1.default.resolve(cwd, "src/pages");
    const publicDir = path_1.default.resolve(cwd, "public");
    if (!fs_1.default.existsSync(pagesDir)) {
        console.error(`❌ Pages directory not found at ${pagesDir}`);
        process.exit(1);
    }
    // Automatically register routes based on page files (.ts or .tsx)
    const pageFiles = fs_1.default
        .readdirSync(pagesDir)
        .filter((file) => /\.(ts|tsx)$/.test(file));
    pageFiles.forEach((file) => {
        const pageName = file.replace(/\.(ts|tsx)$/, "");
        const routePath = pageName === "index" ? "/" : `/${pageName}`;
        app.get(routePath, async (req, res) => {
            var _a;
            try {
                const modulePath = path_1.default.join(pagesDir, file);
                // Dynamically import the page module (in production, pages should be pre-compiled)
                const { default: Component } = await (_a = modulePath, Promise.resolve().then(() => __importStar(require(_a))));
                if (!Component) {
                    throw new Error(`Component not found in ${file}`);
                }
                const vnode = Component();
                const appHtml = (0, utils_1.renderToString)(vnode);
                const templatePath = path_1.default.resolve(publicDir, "index.html");
                let template = fs_1.default.readFileSync(templatePath, "utf8");
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
    app.use(express_1.default.static(publicDir));
    app.use("/client.js", express_1.default.static(path_1.default.resolve(cwd, "dist/client.js")));
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Valzu server running on http://localhost:${PORT}`);
    });
}
exports.createServer = createServer;
