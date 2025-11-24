# Vite Markdown Blog Plugin

A **zero-cost**, **zero-server** static blog generator built with Vite's Environment API.

Transform markdown files into a blazing-fast static blog with one command!

## Installation

```bash
npm install vite-plugin-md-blog
# or
pnpm add vite-plugin-md-blog
# or
yarn add vite-plugin-md-blog
```

## Quick Start

1. **Add the plugin to your `vite.config.ts`:**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mdBlogPlugin } from "vite-plugin-md-blog";

export default defineConfig({
  plugins: [react(), mdBlogPlugin()],
});
```

2. **Use the CLI commands:**

```bash
# Start development server
md-blog dev

# Build for production (includes static generation)
md-blog build

# Preview production build
md-blog preview
```

That's it! Your blog is ready to deploy.

## Features

✅ **Static site generation** - No server needed, deploy anywhere
✅ **Markdown-based** - Write posts in `.md` files
✅ **React components** - Full control over layout and styling
✅ **Tailwind CSS** - Beautiful, responsive design out of the box
✅ **Vite Environment API** - Modern SSR approach
✅ **Hot Module Replacement** - Instant updates during development
✅ **Type-safe** - Full TypeScript support
✅ **Configurable** - Customize paths, components, and more

## Writing Blog Posts

1. Create a new `.md` file in `src/content/`
2. Start with a `#` heading (becomes the title)
3. Write your content in Markdown

```markdown
# My Awesome Post

This is **bold** and this is _italic_.

## Subheading

- List item 1
- List item 2
```

## Configuration

Customize the plugin in `vite.config.ts`:

```typescript
import { mdBlogPlugin } from "vite-plugin-md-blog";

export default defineConfig({
  plugins: [
    mdBlogPlugin({
      contentDir: "src/content",              // Where your .md files are
      pageComponent: "/src/components/Page.tsx",  // Homepage layout
      slugComponent: "/src/components/Slug.tsx",  // Blog post layout
      outDir: "dist",                          // Build output directory
    }),
  ],
});
```

## How It Works

### Development Mode
- Vite dev server with HMR
- Markdown → HTML conversion on-the-fly
- React components rendered server-side
- Uses Vite's Environment API for SSR

### Production Build
1. **`vite build`** - Builds optimized assets (CSS, JS)
2. **Static generation** - Automatically generates HTML files
3. **Result:** Fully static site in `dist/` ready to deploy!

The `md-blog build` command handles both steps automatically!

## Deployment

Your blog is a **static site** - deploy it anywhere for free!

**Recommended hosts:**
- [Netlify](https://netlify.com) - Easiest, automatic clean URLs
- [Vercel](https://vercel.com) - Great DX, serverless ready
- [Cloudflare Pages](https://pages.cloudflare.com) - Fastest, global CDN
- [GitHub Pages](https://pages.github.com) - Simple, GitHub integrated

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Page.tsx       # Homepage (lists all posts)
│   │   └── Slug.tsx       # Individual blog post page
│   ├── content/
│   │   └── *.md           # Your blog posts
│   ├── main.tsx           # Client entry (imports CSS)
│   └── style.css          # Tailwind CSS
├── vite.config.ts         # Vite configuration with mdBlogPlugin
└── package.json
```

The plugin handles all the build logic internally - no need for custom scripts!

## Documentation

- **[LEARNING.md](LEARNING.md)** - How it all works (great for learning Vite!)
- **[FAQ.md](FAQ.md)** - Common questions answered in detail
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Step-by-step deployment guide

## Why Vite?

This project uses Vite's **Environment API** - the modern way to handle SSR:

```typescript
// Old way (deprecated):
await server.ssrLoadModule('/component.tsx')

// New way (Environment API):
await server.environments.ssr.runner.import('/component.tsx')
```

**Benefits:**
- Better HMR (Hot Module Replacement)
- Clearer separation of client vs server code
- Type-safe environments
- Future-proof for edge/worker targets

## Customization

### Custom Components

Replace `Page.tsx` and `Slug.tsx` with your own:

```typescript
// src/components/MyLayout.tsx
export default function MyLayout({ posts }) {
  return (
    <div className="my-custom-layout">
      {/* Your design here */}
    </div>
  );
}
```

Then update `vite.config.ts`:

```typescript
mdBlogPlugin({
  pageComponent: "/src/components/MyLayout.tsx",
})
```

### Custom Styles

Edit `src/style.css` - it uses Tailwind CSS:

```css
@import "tailwindcss";

h1 {
  @apply text-5xl font-extrabold text-purple-600;
}

/* Your custom styles */
```

## Learning Resources

This project is a great way to learn:

- **Vite's Environment API** - Modern SSR approach
- **Static Site Generation** - How SSG works under the hood
- **Vite Plugin Development** - Build your own plugins
- **TypeScript** - Full type safety
- **React Server Components** - Server-side rendering concepts

Check out [LEARNING.md](LEARNING.md) for detailed explanations!

## Tech Stack

- **Vite 6** - Build tool with Environment API
- **React 19** - UI components
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Marked** - Markdown parsing
- **Node.js** - Build scripts

## License

MIT

---

**Built with ❤️ using Vite's Environment API**

Want to learn how it works? Read [LEARNING.md](LEARNING.md)!
Ready to deploy? Check [DEPLOYMENT.md](DEPLOYMENT.md)!
Have questions? See [FAQ.md](FAQ.md)!
