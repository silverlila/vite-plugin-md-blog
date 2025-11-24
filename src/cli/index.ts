#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command = process.argv[2];
const args = process.argv.slice(3);

function runCommand(cmd: string, cmdArgs: string[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      resolve(code || 0);
    });
  });
}

async function main() {
  switch (command) {
    case "dev":
      console.log("[md-blog] Starting development server...");
      const devCode = await runCommand("npx", ["vite", "dev", ...args]);
      process.exit(devCode);
      break;

    case "build":
      console.log("[md-blog] Building for production...");
      const buildCode = await runCommand("npx", ["vite", "build", ...args]);

      if (buildCode === 0) {
        console.log("\n[md-blog] Running static site generation...");

        const generateScript = join(__dirname, "../scripts/generate.js");
        const generateCode = await runCommand("node", [generateScript]);

        process.exit(generateCode);
      } else {
        console.error("[md-blog] Build failed");
        process.exit(buildCode);
      }
      break;

    case "preview":
      console.log("[md-blog] Starting preview server...");
      const previewCode = await runCommand("npx", ["vite", "preview", ...args]);
      process.exit(previewCode);
      break;

    case "help":
    case "--help":
    case "-h":
      showHelp();
      process.exit(0);
      break;

    default:
      console.error(`Unknown command: ${command}\n`);
      showHelp();
      process.exit(1);
  }
}

function showHelp() {
  console.log(`
╭─────────────────────────────────────────────╮
│                                             │
│  Vite Markdown Blog CLI                     │
│                                             │
╰─────────────────────────────────────────────╯

Usage:
  md-blog <command> [options]

Commands:
  dev        Start development server
  build      Build for production (includes static generation)
  preview    Preview production build
  help       Show this help message

Examples:
  md-blog dev             # Start dev server
  md-blog build           # Build for production
  md-blog preview         # Preview built site

Options:
  All options are passed to the underlying Vite command.

  md-blog dev --port 3000
  md-blog build --outDir public
  md-blog preview --port 8080

Documentation:
  https://github.com/yourusername/vite-plugin-md-blog

`);
}

main().catch((error) => {
  console.error("[md-blog] Error:", error);
  process.exit(1);
});
