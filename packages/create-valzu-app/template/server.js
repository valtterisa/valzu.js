import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

async function createServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    // In development, use Vite's dev server as middleware
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static assets
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(sirv(path.join(__dirname, "dist/client"), { gzip: true }));
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template;
      let render;

      if (!isProduction) {
        // In development, read template and load module fresh each request
        template = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        // In production, use pre-built assets
        template = fs.readFileSync(
          path.join(__dirname, "dist/client/index.html"),
          "utf-8"
        );
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const { html: appHtml, head } = render(url);

      // Inject the rendered app HTML and head tags
      const finalHtml = template
        .replace("<!--head-tags-->", head)
        .replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(finalHtml);
    } catch (e) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    if (!isProduction) {
      console.log("📦 Running in development mode with Vite HMR");
    } else {
      console.log("🚀 Running in production mode");
    }
  });
}

createServer();
