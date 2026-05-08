# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/portfolio site for Wes Baker, built with [Zola](https://www.getzola.org/) (a Rust-based static site generator). Uses the [Apollo theme](https://github.com/not-matthias/apollo) as a git submodule.

## Commands

```bash
zola serve          # Start local dev server (usually at http://127.0.0.1:1111)
zola build          # Build the site to /public
zola check --skip-external-links  # Validate internal links (used in CI)
```

After cloning, initialize the theme submodule:
```bash
git submodule update --init --recursive
```

## Architecture

- **`config.toml`** — Site-wide settings, menu items, social links, and theme extras
- **`content/`** — All Markdown content; `posts/` contains blog articles
- **`templates/`** — Tera templates that override the Apollo theme defaults
  - `base.html` adds Giscus comments, Plausible analytics, and custom header/footer
  - `homepage.html` overrides the theme's index page
- **`sass/main.scss`** — Imports the Apollo theme SCSS, then adds site-specific overrides
- **`themes/apollo/`** — Git submodule; don't edit directly
- **`static/covers/`** — Board game cover images referenced in posts

## Content Authoring

Posts live in `content/posts/` as Markdown files with TOML front matter. Example:

```toml
+++
title = "Post Title"
date = 2026-01-01
[taxonomies]
tags = ["tag1", "tag2"]
+++
```

Zola automatically compiles SCSS, generates RSS/Atom feeds, and paginates posts (10 per page).

## Style Guide

`content/posts/style-guide.md` is a draft page that demonstrates every visual element used on posts. Any time you add or change a style that affects post presentation — new frontmatter fields, new CSS classes, template changes — add a representative example to the style guide. Preview it with:

```bash
zola serve --drafts
# visit http://127.0.0.1:1111/posts/style-guide/
```
