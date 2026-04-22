import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Elysia } from "elysia";
import {
  renderDocument,
  resolveRouteModule,
  runServerDataLoader,
  safeSerialize,
} from "@landrr/core/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);
const devAssetPort = Number(process.env.LANDRR_VITE_PORT || 5174);

const app = new Elysia();

const ASSET_PREFIXES = ["/@vite", "/src/", "/node_modules/", "/@fs/", "/@id/"];
const ASSET_EXTENSIONS = [".js", ".ts", ".tsx", ".css", ".map", ".json", ".ico", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".woff", ".woff2"];

function isAssetRequest(pathname) {
  return (
    ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    ASSET_EXTENSIONS.some((extension) => pathname.endsWith(extension))
  );
}

function getContentType(filePath) {
  if (filePath.endsWith(".js")) return "text/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".gif")) return "image/gif";
  if (filePath.endsWith(".woff")) return "font/woff";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

async function createRuntime() {
  let vite;
  let viteOrigin = "";
  if (!isProduction) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { port: devAssetPort, strictPort: false },
      appType: "custom",
    });
    await vite.listen();
    const addressInfo = vite.httpServer?.address();
    const resolvedPort =
      addressInfo && typeof addressInfo === "object" ? addressInfo.port : devAssetPort;
    viteOrigin = `http://127.0.0.1:${resolvedPort}`;
  }
  return { vite, viteOrigin };
}

const runtime = await createRuntime();

app.all("/webhook/cms", async ({ request }) => {
  const modules = !isProduction
    ? await runtime.vite.ssrLoadModule("/src/server-modules.ts")
    : await import("./dist/server/server-modules.js");
  if (request.method === "GET" && modules.webhookCmsGet) {
    return modules.webhookCmsGet({ request });
  }
  if (request.method === "POST" && modules.webhookCmsPost) {
    return modules.webhookCmsPost({ request });
  }
  return new Response("Method Not Allowed", { status: 405 });
});

app.all("*", async ({ request }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!isProduction && isAssetRequest(pathname)) {
    return fetch(`${runtime.viteOrigin}${url.pathname}${url.search}`);
  }

  if (isProduction && isAssetRequest(pathname)) {
    try {
      const assetPath = path.join(__dirname, "dist/client", pathname.replace(/^\/+/, ""));
      const file = await fs.readFile(assetPath);
      return new Response(file, {
        status: 200,
        headers: { "content-type": getContentType(assetPath) },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  }

  try {
    const template = !isProduction
      ? await fs.readFile(path.join(__dirname, "index.html"), "utf-8")
      : await fs.readFile(path.join(__dirname, "dist/client/index.html"), "utf-8");
    const transformedTemplate = !isProduction
      ? (await runtime.vite.transformIndexHtml(pathname, template))
          .replaceAll('"/@vite/', `"${runtime.viteOrigin}/@vite/`)
          .replaceAll('"/src/', `"${runtime.viteOrigin}/src/`)
      : template;
    const modules = !isProduction
      ? await runtime.vite.ssrLoadModule("/src/server-modules.ts")
      : await import("./dist/server/server-modules.js");

    const { module: routeModule, params } = resolveRouteModule(pathname, modules.routes);
    const routeData = await runServerDataLoader(routeModule, {
      url: pathname,
      params,
      query: Object.fromEntries(url.searchParams.entries()),
      request,
    });

    const initialRouteData = { [pathname]: routeData };
    const rendered = await renderDocument({
      render: modules.render,
      url: pathname,
      props: initialRouteData,
    });

    const html = transformedTemplate
      .replace("<!--head-tags-->", rendered.head ?? "")
      .replace("<!--ssr-outlet-->", rendered.html ?? "")
      .replace(
        "<!--app-data-->",
        `<script>window.__LANDRR_DATA__=${safeSerialize(initialRouteData)}</script>`
      );

    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    if (!isProduction && runtime.vite) {
      runtime.vite.ssrFixStacktrace(error);
    }
    const message = error instanceof Error ? error.stack || error.message : "Internal Server Error";
    return new Response(message, { status: 500 });
  }
});

app.listen(port);
