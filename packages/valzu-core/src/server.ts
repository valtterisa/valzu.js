import express from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { renderToString } from "./utils";
import { Request, Response } from "express";

export interface ServerOptions {
  pagesDir?: string;
  publicDir?: string;
  port?: number;
}

/**
 * Starts the Express server.
 * @param options Optional configuration object.
 */
export function useServer(options?: ServerOptions): void {
  // Create an Express app instance.
  const app = express();
  const cwd = process.cwd();

  // Determine the directories to use.
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

  // Automatically register routes based on page files (.ts or .tsx)
  const pageFiles = fs
    .readdirSync(pagesDir)
    .filter((file: string) => /\.(ts|tsx)$/.test(file));

  pageFiles.forEach((file: string) => {
    const pageName = file.replace(/\.(ts|tsx)$/, "");
    const routePath = pageName === "index" ? "/" : `/${pageName}`;

    app.get(routePath, async (req: Request, res: Response) => {
      try {
        const modulePath = path.join(pagesDir, file);
        // Convert the absolute path to a file URL for ESM dynamic import
        const moduleUrl = pathToFileURL(modulePath).href;
        const { default: Component } = await import(moduleUrl);
        if (!Component) {
          throw new Error(`Component not found in ${file}`);
        }

        const vnode = await Component();
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

  // Serve static files from the public directory.
  app.use(express.static(publicDir));
  app.use("/client.js", express.static(path.resolve(cwd, "dist/client.js")));

  // Determine the port and start listening.
  const port = options?.port || Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`✅ Valzu server running on http://localhost:${port}`);
  });
}
