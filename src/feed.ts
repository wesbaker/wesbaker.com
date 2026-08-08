import { getCollection, render, type CollectionEntry } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";

import { BYLINE, SITE } from "./consts";
import type { SiteDate } from "./date";
import { getPosts, postPath, projectPath } from "./utils";

export interface FeedItem {
  title: string;
  /** Where the title points: the external URL for link posts, else the post. */
  link: string;
  /** Canonical page on this site; doubles as the entry id. */
  permalink: string;
  /** Present only when `link` points somewhere else. */
  related?: string;
  published: SiteDate;
  updated: SiteDate;
  content: string;
}

/**
 * Rewrites root-relative `src`/`href` values to absolute URLs. Feed readers
 * resolve them inconsistently, and `xml:base` alone is not enough in practice.
 */
function absolutizeUrls(html: string): string {
  return html.replace(
    /(\s(?:src|href)=")(\/[^"]*)"/g,
    (_match, attr: string, path: string) =>
      `${attr}${new URL(path, SITE.url).href}"`,
  );
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** One entry's metadata, before its body has been rendered. */
interface FeedSource {
  entry: CollectionEntry<"posts"> | CollectionEntry<"projects">;
  title: string;
  path: string;
  /** Link posts point their title at somewhere else. */
  external?: string;
  published: SiteDate;
  updated: SiteDate;
}

/**
 * Everything the feeds syndicate, newest first: posts plus any dated project
 * page. Zola's site-wide feed included both, so both stay in.
 */
async function getFeedSources(): Promise<FeedSource[]> {
  const posts: FeedSource[] = (await getPosts()).map((entry) => ({
    entry,
    title: entry.data.title,
    path: postPath(entry.id),
    external: entry.data.external_url,
    published: entry.data.date,
    updated: entry.data.updated ?? entry.data.date,
  }));

  const projects: FeedSource[] = (await getCollection("projects")).flatMap(
    (entry) =>
      entry.data.date
        ? [
            {
              entry,
              title: entry.data.title,
              path: projectPath(entry.id),
              published: entry.data.date,
              updated: entry.data.date,
            },
          ]
        : [],
  );

  return [...posts, ...projects].sort(
    (a, b) =>
      b.published.value.valueOf() - a.published.value.valueOf() ||
      a.entry.id.localeCompare(b.entry.id),
  );
}

/** Renders each syndicated entry to standalone HTML for feed consumers. */
export async function getFeedItems(): Promise<FeedItem[]> {
  const container = await AstroContainer.create();
  container.addServerRenderer({ name: "@astrojs/mdx", renderer: mdxRenderer });

  const sources = await getFeedSources();

  return Promise.all(
    sources.map(async (source) => {
      const { Content } = await render(source.entry);
      const content = absolutizeUrls(await container.renderToString(Content));
      const permalink = new URL(source.path, SITE.url).href;

      return {
        title: source.title,
        link: source.external ?? permalink,
        permalink,
        related: source.external ? permalink : undefined,
        published: source.published,
        updated: source.updated,
        content,
      };
    }),
  );
}

export function bylineContributors(indent: string): string {
  const pad = (depth: number) => indent + "  ".repeat(depth);
  return [
    `${pad(0)}<byline:contributors>`,
    `${pad(1)}<byline:person id="${BYLINE.id}">`,
    `${pad(2)}<byline:name>${escapeXml(BYLINE.name)}</byline:name>`,
    `${pad(2)}<byline:context>${escapeXml(BYLINE.context)}</byline:context>`,
    `${pad(2)}<byline:url>${BYLINE.url}</byline:url>`,
    ...BYLINE.profiles.map(
      (p) => `${pad(2)}<byline:profile href="${p.href}" rel="${p.rel}"/>`,
    ),
    `${pad(2)}<byline:now>${BYLINE.now}</byline:now>`,
    `${pad(2)}<byline:uses>${BYLINE.uses}</byline:uses>`,
    `${pad(1)}</byline:person>`,
    `${pad(0)}</byline:contributors>`,
  ].join("\n");
}

export const xmlResponse = (body: string) =>
  new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
