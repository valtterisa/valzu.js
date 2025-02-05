import express from "express";
import fs from "fs";
import path from "path";
import { renderToString } from "./utils";

export function createServer() {
  const app = express();
  const cwd = process.cwd(); // Assumes user’s project root is current working directory
  const pagesDir = path.resolve(cwd, "src/pages");
  const publicDir = path.resolve(cwd, "public");

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
      try {
        const modulePath = path.join(pagesDir, file);
        // Dynamically import the page module (in production, pages should be pre-compiled)
        const { default: Component } = await import(modulePath);
        if (!Component) {
          throw new Error(`Component not found in ${file}`);
        }

        const vnode = Component();
        const appHtml = renderToString(vnode);

        const templatePath = path.resolve(publicDir, "index.html");
        let template = fs.readFileSync(templatePath, "utf8");
        template = template.replace(
          '<div id="app"></div>',
          `<div id="app">${appHtml}</div>`
        );
        template = template.replace(
          "</body>",
          `<script type="module" src="/client.js"></script></body>`
        );
        res.send(template);
      } catch (error) {
        console.error(`❌ Error rendering route ${routePath}:`, error);
        res.status(500).send("Internal Server Error");
      }
    });
  });

  app.use(express.static(publicDir));
  app.use("/client.js", express.static(path.resolve(cwd, "dist/client.js")));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Valzu server running on http://localhost:${PORT}`);
  });
}
