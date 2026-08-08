import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { siteDate } from "./date";

/** Strips the `YYYY-MM-DD-` prefix and extension from a post filename. */
const postId = (filePath: string) =>
  filePath
    .replace(/\.mdx?$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./content/posts",
    generateId: ({ entry }) => postId(entry),
  }),
  schema: z.object({
    title: z.string(),
    date: siteDate,
    updated: siteDate.optional(),
    description: z.string().optional(),
    subtitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Link post: the title points here, with a permalink back to this site. */
    external_url: z.url().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: "*/index.{md,mdx}",
    base: "./content/projects",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: siteDate.optional(),
      /** Lower weights sort first, matching the previous Zola ordering. */
      weight: z.number().default(0),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
      github: z.url().optional(),
      demo: z.url().optional(),
      /** When set, the card title links here instead of to the project page. */
      link_to: z.url().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "*.{md,mdx}",
    base: "./content/pages",
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, projects, pages };
