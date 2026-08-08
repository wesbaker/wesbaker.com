# wesbaker.com

Personal site built with [Astro](https://astro.build/).

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Enable the repo's versioned Git hooks:

```bash
bin/setup-git-hooks
```

That hook runs `npm run check` before each commit, so malformed front matter,
type errors, and broken internal links fail locally.

## Common Commands

```bash
npm run dev      # Start the dev server (http://localhost:4321), drafts included
npm run build    # Build the site into dist/
npm run preview  # Serve the built site
npm run check    # Type-check, build, and validate internal links
```

Drafts (`draft: true` in front matter) are always shown by `npm run dev` and
hidden by `npm run build`. To include them in a build, set `INCLUDE_DRAFTS=true`
— which is what `bin/build.sh` does for Cloudflare Pages preview deployments.

## Deployment

Cloudflare Pages builds the site with `bin/build.sh` and publishes `dist/`.
`.node-version` pins the Node version Pages uses, so a change to its default
can't break the build.

## GitHub Checks

GitHub Actions runs `npm run check` on pull requests and pushes to `main`.
