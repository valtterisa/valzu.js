import { useServer as prodServer } from "./server";
import { useServerDev as devServer } from "./server.dev";

const mainModule = process.argv[1] || "";

export const useServer = mainModule.includes("server.dev")
  ? devServer
  : prodServer;

export * from "./utils";
