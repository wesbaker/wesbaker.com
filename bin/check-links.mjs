#!/usr/bin/env node
// Validates internal links in the built site, replacing `zola check`.
//
// Walks every HTML file in dist/ and confirms that each same-site href and src
// resolves to a file that was actually built, and that every fragment points at
// an id on the target page.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, posix } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");

if (!existsSync(DIST)) {
  console.error(`check-links: ${DIST} does not exist — run the build first.`);
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

/** Every path the built site can serve, as a site-absolute URL path. */
const served = new Set();
for (const file of files) {
  const url = "/" + relative(DIST, file).split(/[\\/]/).join("/");
  served.add(url);
  if (url.endsWith("/index.html")) served.add(url.slice(0, -"index.html".length));
}

/** Element ids per page, for checking fragments. */
const idsByPage = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  );
  idsByPage.set("/" + relative(DIST, file).split(/[\\/]/).join("/"), ids);
}

const isExternal = (url) =>
  /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//");

const errors = [];

for (const file of htmlFiles) {
  const pagePath = "/" + relative(DIST, file).split(/[\\/]/).join("/");
  const pageDir = posix.dirname(pagePath);
  const html = readFileSync(file, "utf8");

  for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const raw = match[1];
    if (!raw || isExternal(raw) || raw.startsWith("data:")) continue;

    const [pathPart, fragment] = raw.split("#");

    // A bare fragment refers to the current page.
    const target = pathPart
      ? pathPart.startsWith("/")
        ? pathPart
        : posix.normalize(posix.join(pageDir, pathPart))
      : pagePath;

    const resolved = target.endsWith("/") ? target + "index.html" : target;

    if (!served.has(target) && !served.has(resolved)) {
      errors.push(`${pagePath}: broken link to ${raw}`);
      continue;
    }

    if (fragment) {
      const ids = idsByPage.get(served.has(resolved) ? resolved : target);
      if (ids && !ids.has(fragment)) {
        errors.push(`${pagePath}: missing anchor #${fragment} in ${target}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`check-links: ${errors.length} problem(s) found\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(
  `check-links: OK — ${htmlFiles.length} page(s), no broken internal links.`,
);
