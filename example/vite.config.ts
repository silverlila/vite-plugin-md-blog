import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdBlogPlugin from "vite-plugin-md-blog";

export default defineConfig({
  plugins: [
    react(),
    mdBlogPlugin({
      contentDir: "./src/content",
      pageComponent: "/src/components/Page.tsx",
      slugComponent: "/src/components/Slug.tsx",
      outDir: "dist",
    }),
  ],
});
