import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corePath = path.resolve(__dirname, "../../valzu-core");
const alias: Record<string, string> = {};
if (existsSync(path.join(corePath, "package.json"))) {
  alias["@landrr/core"] = corePath;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias },
  build: {
    minify: true,
    sourcemap: true,
  },
  ssr: {
    noExternal: ["@landrr/core"],
  },
});
