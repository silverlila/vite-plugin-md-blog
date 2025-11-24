import fs from "fs";
import {
  generateStaticSite,
  type MdBlogPluginOptions,
} from "../plugin/index.js";

let config: MdBlogPluginOptions = {};
try {
  const configFile = fs.readFileSync(".vite-md-blog.config.json", "utf-8");
  config = JSON.parse(configFile);
  console.log("[md-blog] Loaded config:", config);
} catch (error) {
  console.warn("[md-blog] No config found, using defaults");
}

generateStaticSite(config)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to generate static site:", error);
    process.exit(1);
  });
