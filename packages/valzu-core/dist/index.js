import { useServer as prodServer } from "./server";
import { useServerDev as devServer } from "./server.dev";
export const useServer = process.env.NODE_ENV === "production" ? prodServer : devServer;
export * from "./utils";
