import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: true,
    sourcemap: true,
  },
  ssr: {
    noExternal: ["@landr/core", "@landr/blocks"],
  },
});
