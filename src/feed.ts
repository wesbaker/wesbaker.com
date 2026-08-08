import { render, type CollectionEntry } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";

import { BYLINE, SITE } from "./consts";
import type { SiteDate } from "./date";
import { getPosts, postPath } from "./utils";

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

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Renders each published post to standalone HTML for feed consumers. */
export async function getFeedItems(): Promise<FeedItem[]> {
  const container = await AstroContainer.create();
  container.addServerRenderer({ name: "@astrojs/mdx", renderer: mdxRenderer });

  const posts = await getPosts();

  return Promise.all(
    posts.map(async (post: CollectionEntry<"posts">) => {
      const { Content } = await render(post);
      const content = await container.renderToString(Content);
      const permalink = new URL(postPath(post.id), SITE.url).href;

      return {
        title: post.data.title,
        link: post.data.external_url ?? permalink,
        permalink,
        related: post.data.external_url ? permalink : undefined,
        published: post.data.date,
        updated: post.data.updated ?? post.data.date,
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
