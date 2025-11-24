import { Plugin, ViteDevServer } from "vite";
import type { DevEnvironment } from "vite";
import fs from "fs";
import path from "path";
import { renderToString } from "react-dom/server";
import { marked } from "marked";
import React from "react";

function isRunnableDevEnvironment(
  env: DevEnvironment
): env is DevEnvironment & {
  runner: { import: (url: string) => Promise<any> };
} {
  return "runner" in env && env.runner !== undefined;
}

export interface MdBlogPluginOptions {
  /**
   * Directory containing markdown files
   * @default "src/content"
   */
  contentDir?: string;

  /**
   * Path to the Page component (homepage)
   * @default "src/components/Page.tsx"
   */
  pageComponent?: string;

  /**
   * Path to the Slug component (individual post)
   * @default "src/components/Slug.tsx"
   */
  slugComponent?: string;

  /**
   * Output directory for generated static files
   * @default "dist"
   */
  outDir?: string;
}

interface Post {
  slug: string;
  title: string;
  html: string;
}

export default function mdBlogPlugin(
  options: MdBlogPluginOptions = {}
): Plugin {
  const config = {
    contentDir: options.contentDir || path.resolve("./src/content"),
    pageComponent: options.pageComponent || "/src/components/Page.tsx",
    slugComponent: options.slugComponent || "/src/components/Slug.tsx",
    outDir: options.outDir || "dist",
  };

  // Cache posts so we don't re-read files constantly
  let posts: Post[] = [];

  function loadPosts(): Post[] {
    try {
      const files = fs
        .readdirSync(config.contentDir)
        .filter((file) => file.endsWith(".md"));

      return files.map((file) => {
        const filePath = path.join(config.contentDir, file);
        const raw = fs.readFileSync(filePath, "utf-8");

        const html = marked.parse(raw, { async: false });

        const titleMatch = raw.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1] : "Untitled";

        return {
          slug: file.replace(/\.md$/, ""),
          title,
          html,
        };
      });
    } catch (error) {
      console.error("Error loading posts:", error);
      return [];
    }
  }

  return {
    name: "vite-plugin-md-blog",

    buildStart() {
      fs.writeFileSync(
        ".vite-md-blog.config.json",
        JSON.stringify(config, null, 2)
      );
    },

    configureServer(server: ViteDevServer) {
      posts = loadPosts();
      console.log(`[md-blog] Loaded ${posts.length} posts`);

      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.originalUrl || req.url;

          if (
            url !== "/" &&
            url !== "/index.html" &&
            !url?.startsWith("/post/")
          ) {
            return next();
          }

          try {
            const template = fs.readFileSync("index.html", "utf-8");
            const transformedTemplate = await server.transformIndexHtml(
              url,
              template
            );

            const ssrEnv = server.environments.ssr;
            if (!isRunnableDevEnvironment(ssrEnv)) {
              throw new Error("SSR environment is not runnable");
            }

            const { default: Page } = await ssrEnv.runner.import(
              config.pageComponent
            );
            const { default: Slug } = await ssrEnv.runner.import(
              config.slugComponent
            );

            let html = "";

            if (url === "/" || url === "/index.html") {
              // Homepage: List all posts
              html = renderToString(React.createElement(Page, { posts }));
            } else if (url?.startsWith("/post/")) {
              // Individual post page
              const slug = url.replace(/^\/post\/(.+?)(?:\.html)?$/, "$1");
              const post = posts.find((p) => p.slug === slug);

              if (post) {
                html = renderToString(React.createElement(Slug, { post }));
              } else {
                res.statusCode = 404;
                html = "<h1>Post not found</h1>";
              }
            }

            const finalHtml = transformedTemplate.replace(
              '<div id="app"></div>',
              `<div id="app">${html}</div>`
            );

            res.setHeader("Content-Type", "text/html");
            res.end(finalHtml);
          } catch (error) {
            console.error("[md-blog] Error:", error);
            next(error);
          }
        });
      };
    },
  };
}

export async function generateStaticSite(options: MdBlogPluginOptions = {}) {
  const config = {
    contentDir: options.contentDir || path.resolve("src/content"),
    pageComponent: options.pageComponent || "/src/components/Page.tsx",
    slugComponent: options.slugComponent || "/src/components/Slug.tsx",
    outDir: options.outDir || "dist",
  };

  try {
    console.log("[md-blog] Generating static pages...");

    const files = fs
      .readdirSync(config.contentDir)
      .filter((file) => file.endsWith(".md"));

    const posts = files.map((file) => {
      const filePath = path.join(config.contentDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const html = marked.parse(raw, { async: false });
      const titleMatch = raw.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1] : "Untitled";

      return {
        slug: file.replace(/\.md$/, ""),
        title,
        html,
      };
    });

    console.log(`[md-blog] Found ${posts.length} posts to generate`);

    const { createServer } = await import("vite");
    const react = await import("@vitejs/plugin-react");
    const tailwindcss = await import("@tailwindcss/vite");

    const vite = await createServer({
      logLevel: "error",
      server: { middlewareMode: true },
      appType: "custom",
      plugins: [react.default(), tailwindcss.default()],
    });

    const buildSsrEnv = vite.environments.ssr;
    if (!isRunnableDevEnvironment(buildSsrEnv)) {
      throw new Error("SSR environment is not runnable during build");
    }

    const { default: Page } = await buildSsrEnv.runner.import(
      config.pageComponent
    );
    const { default: Slug } = await buildSsrEnv.runner.import(
      config.slugComponent
    );

    const template = fs.readFileSync(
      path.join(config.outDir, "index.html"),
      "utf-8"
    );

    fs.mkdirSync(path.join(config.outDir, "post"), { recursive: true });

    const indexHtml = renderToString(React.createElement(Page, { posts }));
    const finalIndex = template.replace(
      '<div id="app"></div>',
      `<div id="app">${indexHtml}</div>`
    );
    fs.writeFileSync(path.join(config.outDir, "index.html"), finalIndex);
    console.log("[md-blog] ✓ Generated /");

    for (const post of posts) {
      const postHtml = renderToString(React.createElement(Slug, { post }));
      const finalPost = template.replace(
        '<div id="app"></div>',
        `<div id="app">${postHtml}</div>`
      );
      fs.writeFileSync(
        path.join(config.outDir, "post", `${post.slug}.html`),
        finalPost
      );
      console.log(`[md-blog] ✓ Generated /post/${post.slug}`);
    }

    await vite.close();
    console.log("[md-blog] ✅ Static site generation complete!");
  } catch (error) {
    console.error("[md-blog] Build error:", error);
    throw error;
  }
}
