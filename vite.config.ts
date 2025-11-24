import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdBlogPlugin from "./lib/plugin/index.js";

export default defineConfig({
  plugins: [react(), mdBlogPlugin(), tailwindcss()],

  build: {
    outDir: "dist",
    minify: false,
    sourcemap: true,
  },
});
