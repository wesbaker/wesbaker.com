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
  const self = new URL("/atom.xml", SITE.url).href;
  const lastUpdated = items[0]?.updated.rfc3339 ?? new Date().toISOString();

  const entries = items.map((item) =>
    [
      `    <entry xml:lang="${SITE.lang}">`,
      `        <title>${escapeXml(item.title)}</title>`,
      `        <published>${item.published.rfc3339}</published>`,
      `        <updated>${item.updated.rfc3339}</updated>`,
      `        <author>`,
      `          <name>${escapeXml(BYLINE.name)}</name>`,
      `        </author>`,
      `        <byline:author ref="${BYLINE.id}"/>`,
      `        <byline:perspective>${BYLINE.perspective}</byline:perspective>`,
      `        <link rel="alternate" type="text/html" href="${escapeXml(item.link)}"/>`,
      ...(item.related
        ? [
            `        <link rel="related" type="text/html" href="${escapeXml(item.related)}"/>`,
          ]
        : []),
      `        <id>${escapeXml(item.permalink)}</id>`,
      `        <content type="html" xml:base="${escapeXml(item.permalink)}">${escapeXml(item.content)}</content>`,
      `    </entry>`,
    ].join("\n"),
  );

  return xmlResponse(
    [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:byline="https://bylinespec.org/1.0" xml:lang="${SITE.lang}">`,
      `    <title>${escapeXml(SITE.title)}</title>`,
      `    <link rel="self" type="application/atom+xml" href="${self}"/>`,
      `    <link rel="alternate" type="text/html" href="${SITE.url}/"/>`,
      `    <updated>${lastUpdated}</updated>`,
      `    <id>${self}</id>`,
      bylineContributors("    "),
      ...entries,
      `</feed>`,
      ``,
    ].join("\n"),
  );
};
