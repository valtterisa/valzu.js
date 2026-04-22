import { Elysia } from "elysia";
import { lookup as lookupMimeType } from "mime-types";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

export function createServerApp() {
  return new Elysia();
}

export function resolveMimeType(pathname: string) {
  return lookupMimeType(pathname);
}

export async function createViteRuntime(options: {
  isProduction: boolean;
  port: number;
  devAssetPort: number;
}) {
  let vite;
  if (!options.isProduction) {
    const { createServer: createViteServer } = await import("vite");
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          clientPort: options.port,
          port: options.devAssetPort,
          host: "localhost",
        },
      },
      appType: "custom",
    });
  }
  return { vite };
}

export async function runViteMiddlewares(vite: any, request: any, response: any) {
  await new Promise<void>((resolve, reject) => {
    vite.middlewares(request, response, (error: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
  return Boolean(response.writableEnded);
}

export function toWebRequest(
  request: {
    headers: { host?: string };
    url?: string;
    method?: string;
  } & Readable,
  port: number
) {
  const host = request.headers.host ?? `localhost:${port}`;
  const url = `http://${host}${request.url ?? "/"}`;
  const method = request.method ?? "GET";
  const body = method === "GET" || method === "HEAD" ? undefined : request;
  if (!body) {
    return new Request(url, {
      method,
      headers: request.headers as HeadersInit,
    });
  }
  return new Request(
    url,
    {
      method,
      headers: request.headers as HeadersInit,
      body: body as unknown as BodyInit,
      duplex: "half",
    } as any
  );
}

export async function sendNodeResponse(
  response: {
    statusCode: number;
    setHeader: (name: string, value: string) => void;
    end: () => void;
  } & NodeJS.WritableStream,
  webResponse: Response
) {
  response.statusCode = webResponse.status;
  for (const [key, value] of webResponse.headers.entries()) {
    response.setHeader(key, value);
  }
  if (!webResponse.body) {
    response.end();
    return;
  }
  Readable.fromWeb(webResponse.body as never).pipe(response);
}

export async function tryServeClientAsset(options: {
  isProduction: boolean;
  clientDistRoot: string;
  pathname: string;
}) {
  if (!options.isProduction || options.pathname.endsWith("/")) {
    return null;
  }
  const relativePath = decodeURIComponent(options.pathname).replace(/^\/+/, "");
  if (!relativePath) {
    return null;
  }
  const assetPath = path.resolve(options.clientDistRoot, relativePath);
  if (!assetPath.startsWith(options.clientDistRoot)) {
    return new Response("Not Found", { status: 404 });
  }
  try {
    const file = await fs.readFile(assetPath);
    const headers = new Headers();
    const mimeType = resolveMimeType(assetPath);
    if (mimeType) {
      headers.set("content-type", mimeType);
    }
    return new Response(file, { status: 200, headers });
  } catch {
    return null;
  }
}

export function createNodeHttpServer(handler: (request: any, response: any) => void | Promise<void>) {
  return createServer(handler);
}

export function attachViteUpgrade(options: {
  isProduction: boolean;
  runtime: any;
  server: any;
}): void {
  if (!options.isProduction && options.runtime.vite) {
    options.server.on("upgrade", (request: any, socket: any, head: any) => {
      options.runtime.vite?.ws?.handleUpgrade?.(request, socket, head);
    });
  }
}

export async function shutdownRuntime(options: {
  runtime: { vite?: { close: () => Promise<void> } };
  server: { stop?: () => Promise<void>; close?: (cb: () => void) => void };
}) {
  if (options.runtime.vite) {
    await options.runtime.vite.close();
  }
  if (typeof options.server.stop === "function") {
    await options.server.stop();
    return;
  }
  if (typeof options.server.close === "function") {
    await new Promise<void>((resolve) => options.server.close?.(resolve));
  }
}

export async function startLandrrServer(options: {
  rootDir: string;
  port?: number;
  devAssetPort?: number;
  isProduction?: boolean;
}) {
  const isProduction = options.isProduction ?? process.env.NODE_ENV === "production";
  const port = options.port ?? Number(process.env.PORT || 3000);
  const devAssetPort = options.devAssetPort ?? Number(process.env.LANDRR_VITE_PORT || 5174);
  const app = createServerApp();
  const clientDistRoot = path.resolve(options.rootDir, "dist/client");
  const runtime = await createViteRuntime({ isProduction, port, devAssetPort });
  let shuttingDown = false;

  async function loadServerModules() {
    return !isProduction
      ? await runtime.vite!.ssrLoadModule("/src/server-modules.ts")
      : await import(path.resolve(options.rootDir, "./dist/server/server-modules.js"));
  }

  app.all("/webhook/cms", async ({ request }: { request: Request }) => {
    const modules = await loadServerModules();
    if (request.method === "GET" && modules.webhookCmsGet) {
      return modules.webhookCmsGet({ request });
    }
    if (request.method === "POST" && modules.webhookCmsPost) {
      return modules.webhookCmsPost({ request });
    }
    return new Response("Method Not Allowed", { status: 405 });
  });

  app.all("*", async ({ request }: { request: Request }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const staticAssetResponse = await tryServeClientAsset({
      isProduction,
      clientDistRoot,
      pathname,
    });
    if (staticAssetResponse) {
      return staticAssetResponse;
    }
    if (pathname.includes(".")) {
      return new Response("Not Found", { status: 404 });
    }

    try {
      const template = !isProduction
        ? await fs.readFile(path.join(options.rootDir, "index.html"), "utf-8")
        : await fs.readFile(path.join(options.rootDir, "dist/client/index.html"), "utf-8");
      const transformedTemplate = !isProduction
        ? await runtime.vite!.transformIndexHtml(pathname, template)
        : template;
      const modules = await loadServerModules();

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
        runtime.vite.ssrFixStacktrace(error as Error);
      }
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  });

  const server = createNodeHttpServer(async (request, response) => {
    try {
      if (!isProduction && runtime.vite) {
        const handled = await runViteMiddlewares(runtime.vite, request, response);
        if (handled) {
          return;
        }
      }
      const webRequest = toWebRequest(request, port);
      const webResponse = await app.fetch(webRequest);
      await sendNodeResponse(response, webResponse);
    } catch (error) {
      if (!isProduction && runtime.vite) {
        runtime.vite.ssrFixStacktrace(error as Error);
      }
      console.error(error);
      response.statusCode = 500;
      response.end("Internal Server Error");
    }
  }).listen(port);

  attachViteUpgrade({ isProduction, runtime, server });

  const shutdown = async () => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    try {
      await shutdownRuntime({ runtime, server });
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("beforeExit", shutdown);

  return { app, runtime, server, shutdown };
}

export async function startLandrrServerFromImportMeta(importMetaUrl: string) {
  const rootDir = path.dirname(fileURLToPath(importMetaUrl));
  return startLandrrServer({ rootDir });
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * Context object passed to `getServerData(ctx)` in route modules.
 *
 * `url` is the resolved request pathname.
 * `params` and `query` are normalized string maps.
 * `request` is optional to support build-time or non-request execution paths.
 */
export interface LoaderContext {
  url: string;
  params: Record<string, string>;
  query: Record<string, string>;
  request?: Request;
}

/**
 * Route-level rendering and caching hints used by SSR/SSG runtime.
 *
 * - `mode`: choose per-request SSR or build-time SSG behavior.
 * - `revalidate`: regeneration TTL in seconds.
 * - `cache`: cache policy hint for the runtime.
 * - `tags`: invalidation groups used by revalidation helpers.
 */
export interface PageRuntimeConfig {
  mode?: "ssr" | "ssg";
  revalidate?: number;
  cache?: "no-store" | "force-cache";
  tags?: string[];
}

type SerializableRecord = Record<string, JsonValue>;

interface CacheEntry {
  value: string;
  expiresAt: number | null;
  tags: string[];
}

/**
 * Runtime cache contract used by `@landrr/core/server` helpers.
 */
export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    options?: { ttl?: number; tags?: string[] }
  ): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateTag(tag: string): Promise<void>;
  invalidatePath(path: string): Promise<void>;
}

/**
 * Default in-memory cache backend used by the runtime.
 */
class InMemoryCacheStore implements CacheStore {
  private entries = new Map<string, CacheEntry>();
  private tagIndex = new Map<string, Set<string>>();

  async get(key: string): Promise<string | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      await this.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(
    key: string,
    value: string,
    options?: { ttl?: number; tags?: string[] }
  ): Promise<void> {
    const ttl = options?.ttl;
    const tags = options?.tags ?? [];
    const expiresAt = typeof ttl === "number" ? Date.now() + ttl * 1000 : null;
    this.entries.set(key, { value, expiresAt, tags });
    for (const tag of tags) {
      const keys = this.tagIndex.get(tag) ?? new Set<string>();
      keys.add(key);
      this.tagIndex.set(tag, keys);
    }
  }

  async delete(key: string): Promise<void> {
    const entry = this.entries.get(key);
    if (!entry) return;
    this.entries.delete(key);
    for (const tag of entry.tags) {
      const keys = this.tagIndex.get(tag);
      if (!keys) continue;
      keys.delete(key);
      if (keys.size === 0) this.tagIndex.delete(tag);
    }
  }

  async invalidateTag(tag: string): Promise<void> {
    const keys = this.tagIndex.get(tag);
    if (!keys) return;
    for (const key of keys) {
      await this.delete(key);
    }
    this.tagIndex.delete(tag);
  }

  async invalidatePath(path: string): Promise<void> {
    await this.delete(`path:${path}`);
  }
}

const globalCacheStore = new InMemoryCacheStore();

/**
 * Returns the active cache store instance used by revalidation helpers.
 */
export function getCacheStore(): CacheStore {
  return globalCacheStore;
}

/**
 * Revalidate all cache entries linked to a tag.
 *
 * @param tag Tag identifier used by cached entries.
 * @returns Promise that resolves when invalidation is complete.
 */
export async function revalidateTag(tag: string): Promise<void> {
  await globalCacheStore.invalidateTag(tag);
}

/**
 * Revalidate cache entry associated with a path key.
 *
 * @param path Path key used by the cache backend.
 * @returns Promise that resolves when invalidation is complete.
 */
export async function revalidatePath(path: string): Promise<void> {
  await globalCacheStore.invalidatePath(path);
}

/**
 * Validates and serializes a value for inline hydration payload usage.
 *
 * Rejects unsupported values (`undefined`, `function`, `symbol`, `bigint`) and
 * circular structures. Escapes script-sensitive characters (`<`, U+2028, U+2029)
 * to keep inline `<script>` payloads safe.
 *
 * @param value Value to serialize.
 * @throws Error when value is non-serializable.
 * @returns Escaped JSON string safe for inline embedding.
 */
export function safeSerialize(value: unknown): string {
  const validate = (current: unknown, seen = new Set<unknown>()): void => {
    if (current === null) return;
    const valueType = typeof current;
    if (valueType === "string" || valueType === "number" || valueType === "boolean") {
      return;
    }
    if (valueType === "undefined" || valueType === "function" || valueType === "symbol" || valueType === "bigint") {
      throw new Error("Non-serializable value returned from getServerData");
    }
    if (seen.has(current)) {
      throw new Error("Circular value returned from getServerData");
    }
    seen.add(current);
    if (Array.isArray(current)) {
      for (const item of current) validate(item, seen);
      seen.delete(current);
      return;
    }
    if (current instanceof Date) {
      seen.delete(current);
      return;
    }
    if (valueType === "object") {
      for (const item of Object.values(current as Record<string, unknown>)) {
        validate(item, seen);
      }
      seen.delete(current);
    }
  };

  validate(value);
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

/**
 * Route module contract consumed by SSR loader/runtime helpers.
 */
export interface RouteModule {
  default?: unknown;
  getServerData?: (ctx: LoaderContext) => Promise<unknown> | unknown;
  ssr?: PageRuntimeConfig;
}

/**
 * Executes `getServerData` when available and normalizes output shape.
 *
 * If no loader exists, returns `{}`.
 * If loader returns a non-object, wraps value as `{ data: value }`.
 * Uses `safeSerialize` validation to enforce hydration-safe payloads.
 *
 * @param routeModule Matched route module.
 * @param ctx Loader execution context.
 * @throws Error when loader output is non-serializable.
 * @returns Serializable record used for SSR hydration.
 */
export async function runServerDataLoader(
  routeModule: RouteModule,
  ctx: LoaderContext
): Promise<SerializableRecord> {
  if (!routeModule.getServerData) return {};
  const data = await routeModule.getServerData(ctx);
  const normalized =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : { data };
  safeSerialize(normalized);
  return normalized as SerializableRecord;
}

export interface RenderDocumentResult {
  html: string;
  head?: string;
}

/**
 * Calls the runtime render function with a consistent signature.
 *
 * @param options Render function and invocation inputs.
 * @returns Rendered HTML/head payload from the runtime renderer.
 */
export async function renderDocument(options: {
  render: (
    url: string,
    props?: Record<string, unknown>
  ) => Promise<RenderDocumentResult> | RenderDocumentResult;
  url: string;
  props?: Record<string, unknown>;
}) {
  return options.render(options.url, options.props);
}

/**
 * Mapping of pathname keys to route modules.
 */
export type RouteModuleMap = Record<string, RouteModule>;

/**
 * Resolves route module by exact path, normalized path, then wildcard.
 *
 * Match priority:
 * 1) exact pathname
 * 2) pathname without trailing slash
 * 3) wildcard (`"*"`), if present
 *
 * @param pathname Request pathname.
 * @param routes Route map keyed by pathname.
 * @throws Error when no route matches.
 * @returns Matched route key, module, and params object.
 */
export function resolveRouteModule(
  pathname: string,
  routes: RouteModuleMap
): { route: string; module: RouteModule; params: Record<string, string> } {
  if (routes[pathname]) {
    return { route: pathname, module: routes[pathname], params: {} };
  }
  if (pathname !== "/" && routes[pathname.replace(/\/$/, "")]) {
    const normalized = pathname.replace(/\/$/, "");
    return { route: normalized, module: routes[normalized], params: {} };
  }
  if (routes["*"]) {
    return { route: "*", module: routes["*"], params: { wildcard: pathname } };
  }
  throw new Error(`No route module found for "${pathname}"`);
}

/**
 * Webhook invalidation mapping contract.
 */
export interface WebhookConfig {
  secretEnvKey: string;
  mapPayloadToTags?: (payload: unknown) => string[];
  mapPayloadToPaths?: (payload: unknown) => string[];
}

/**
 * Helper for declarative webhook invalidation configuration.
 *
 * @param config Webhook invalidation configuration.
 * @returns The same config object for typed composition.
 */
export function defineWebhookInvalidation(config: WebhookConfig) {
  return config;
}

/**
 * Validates webhook secret and triggers tag/path revalidation.
 *
 * Expects JSON body with `secret`. Secret is validated against
 * `process.env[config.secretEnvKey]`. Tag/path targets are computed from
 * mapper callbacks and revalidated sequentially.
 *
 * @param request Incoming webhook request.
 * @param config Webhook invalidation behavior.
 * @returns JSON response with success metadata, or 401 when unauthorized.
 */
export async function handleWebhookInvalidation(
  request: Request,
  config: WebhookConfig
): Promise<Response> {
  const payload = await request.json().catch(() => null);
  const secret =
    payload && typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>).secret
      : undefined;
  if (secret !== process.env[config.secretEnvKey]) {
    return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  const tags = config.mapPayloadToTags?.(payload) ?? [];
  const paths = config.mapPayloadToPaths?.(payload) ?? [];
  for (const tag of tags) await revalidateTag(tag);
  for (const path of paths) await revalidatePath(path);
  return new Response(JSON.stringify({ ok: true, tags, paths }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

