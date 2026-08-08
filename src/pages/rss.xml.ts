import type { APIRoute } from "astro";

import { BYLINE, SITE } from "../consts";
import {
  bylineContributors,
  escapeXml,
  getFeedItems,
  xmlResponse,
} from "../feed";

export const GET: APIRoute = async () => {
  const items = await getFeedItems();
  const self = new URL("/rss.xml", SITE.url).href;
  const lastBuildDate =
    items[0]?.updated.rfc822 ??
    new Date().toUTCString().replace("GMT", "+0000");

  const entries = items.map((item) =>
    [
      `      <item>`,
      `          <title>${escapeXml(item.title)}</title>`,
      `          <pubDate>${item.published.rfc822}</pubDate>`,
      `          <author>${escapeXml(BYLINE.name)}</author>`,
      `          <byline:author ref="${BYLINE.id}"/>`,
      `          <byline:perspective>${BYLINE.perspective}</byline:perspective>`,
      `          <link>${escapeXml(item.link)}</link>`,
      ...(item.related
        ? [
            `          <guid isPermaLink="false">${escapeXml(item.permalink)}</guid>`,
            `          <atom:link rel="related" type="text/html" href="${escapeXml(item.related)}"/>`,
          ]
        : [`          <guid>${escapeXml(item.permalink)}</guid>`]),
      `          <description xml:base="${escapeXml(item.permalink)}">${escapeXml(item.content)}</description>`,
      `      </item>`,
    ].join("\n"),
  );

  return xmlResponse(
    [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:byline="https://bylinespec.org/1.0" version="2.0">`,
      `    <channel>`,
      `      <title>${escapeXml(SITE.title)}</title>`,
      `      <link>${SITE.url}/</link>`,
      `      <description></description>`,
      `      <language>${SITE.lang}</language>`,
      `      <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
      bylineContributors("      "),
      `      <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
      ...entries,
      `    </channel>`,
      `</rss>`,
      ``,
    ].join("\n"),
  );
};
