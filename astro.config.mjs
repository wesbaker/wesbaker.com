// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import { SITE } from "./src/consts.ts";

export default defineConfig({
  site: SITE.url,
  trailingSlash: "always",
  integrations: [
    mdx(),
    // `/posts/page/1/` only exists to redirect to `/posts/`.
    sitemap({ filter: (page) => !page.endsWith("/posts/page/1/") }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: false,
    },
    processor: unified({
      // Zola did not apply smart punctuation, and posts already contain the
      // curly quotes and dashes their author wanted. Leaving this on would
      // silently rewrite punctuation across the whole archive.
      smartypants: false,
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            // Wrap the heading text itself, the way Zola's anchor links did.
            behavior: "wrap",
            properties: (node) => ({
              class: "heading-anchor",
              ariaLabel: `Anchor link for: ${node.properties?.id ?? ""}`,
            }),
          },
        ],
        [rehypeExternalLinks, { rel: ["external"] }],
      ],
    }),
  },
});
