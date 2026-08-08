# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/portfolio site for Wes Baker, built with [Astro](https://astro.build/).
The look and feel is a port of the [Apollo](https://github.com/not-matthias/apollo)
Zola theme, now maintained in-tree under `src/styles/`.

## Commands

```bash
npm install      # Install dependencies (first run only)
npm run dev      # Start the dev server (http://localhost:4321), drafts included
npm run build    # Build the site into dist/
npm run preview  # Serve the built site
npm run check    # Type-check, build, and validate internal links (used in CI)
```

## Architecture

- **`astro.config.mjs`** — Site URL, markdown pipeline (Shiki, heading anchors), integrations
- **`src/consts.ts`** — Site title, menu, social links, and feed author metadata
- **`src/content.config.ts`** — Collection definitions and front-matter schemas
- **`content/`** — All Markdown content, kept outside `src/`
  - `posts/` — Blog articles; the `YYYY-MM-DD-` filename prefix is stripped from the URL
  - `projects/` — One directory per project, with co-located images
  - `pages/` — Standalone pages; `home.md` supplies the homepage intro
- **`src/pages/`** — Routes, including the `atom.xml` and `rss.xml` feed endpoints
- **`src/components/`**, **`src/layouts/`** — Shared markup
- **`src/styles/`** — SCSS, compiled and bundled by Astro
- **`public/`** — Copied verbatim to the site root (fonts, icons, `_redirects`, `robots.txt`)
- **`bin/check-links.mjs`** — Post-build validation of internal links and anchors

## Content Authoring

Posts live in `content/posts/` as Markdown with YAML front matter:

```yaml
---
title: "Post Title"
date: "2026-01-01T09:00:00-05:00"
tags: ["tag1", "tag2"]
---
```

Supported post fields: `title`, `date`, `updated`, `description`, `subtitle`,
`tags`, `draft`, and `external_url` (link posts, whose title points at the
external URL with a permalink back to this site).

**Quote any date that includes a time.** The YAML parser turns unquoted
timestamps into `Date` objects and loses the UTC offset, which is what
determines the displayed day.

Projects use `.mdx` when they need the `Figure` component for captioned,
optimized screenshots; otherwise plain `.md` is fine.

## Style Guide

`content/posts/style-guide.md` is a draft page that demonstrates every visual element used on posts. Any time you add or change a style that affects post presentation — new frontmatter fields, new CSS classes, template changes — add a representative example to the style guide. Preview it with:

```bash
npm run dev
# visit http://localhost:4321/posts/style-guide/
```
