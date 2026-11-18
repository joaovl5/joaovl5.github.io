// @ts-check

import { unified } from "@astrojs/markdown-remark";
import svelte from "@astrojs/svelte";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import path from "path";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { siteConfig } from "./src/config/site.config";
import remarkImageOptimize from "./src/plugin/remark-image-optimize.js";
import remarkLinkPreview from "./src/plugin/remark-link-preview.js";
import remarkPostLinks from "./src/plugin/remark-post-links.js";
import remarkSpoiler from "./src/plugin/remark-spoiler.js";

export default defineConfig({
  site: siteConfig.site,
  base: siteConfig.base,
  trailingSlash: "always",
  compressHTML: true,
  build: { format: "directory" },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Abril Fatface",
      cssVariable: "--font-serif",
    },
  ],
  image: {
    domains: [
      "docs.astro.build",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "raw.githubusercontent.com",
      "res.cloudinary.com",
    ],
  },
  integrations: [
    svelte(),
    expressiveCode({
      themes: ["tokyo-night", "one-light"],
      styleOverrides: {
        borderRadius: "8px",
        borderColor: "var(--border-color)",
        codeFontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      },
      themeCssSelector: (theme) => {
        if (theme.name === "tokyo-night") {
          return '[data-theme="dark"]';
        }
        if (theme.name === "one-light") {
          return '[data-theme="light"]';
        }
        return false;
      },
      useDarkModeMediaQuery: true,
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkMath,
        remarkSpoiler,
        [remarkPostLinks, { base: siteConfig.base }],
        remarkLinkPreview,
        remarkImageOptimize,
      ],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
