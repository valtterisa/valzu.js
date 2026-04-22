import path from "node:path";
import { fileURLToPath } from "node:url";
import { startLandrrServer } from "@landrr/core/server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const devAssetPort = Number(process.env.LANDRR_VITE_PORT || 5174);
await startLandrrServer({
  rootDir: __dirname,
  port,
  devAssetPort,
});
