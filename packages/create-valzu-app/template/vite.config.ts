import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
    sourcemap: true,
  },
  ssr: {
    // Add external packages that should not be bundled for SSR
    noExternal: ["valzu-core"],
  },
});
