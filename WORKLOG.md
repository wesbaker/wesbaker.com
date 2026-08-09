# WORKLOG

## 2026-08-09
Added Dependabot automation. `dependabot.yml` schedules weekly Monday updates: npm ungrouped (one PR per dependency, to preserve Dependabot's compatibility-score badge), github-actions grouped (no scores exist for Actions, so grouping costs no signal). `dependabot-auto-merge.yml` reads that score via a new stdlib-only Ruby parser (`bin/dependabot-compat-score.rb`) and auto-merges on `>= 80%` or `unknown`, holding for a comment on major bumps or a known low score. `output-diff.yml` replaces Playwright visual regression (which never worked on Dependabot PRs — secrets resolve to the wrong store on `pull_request` events) with a deterministic diff of the built `dist/` between base and PR, normalizing Astro's content-hashed asset names (`bin/normalize-dist-hashes.rb`) so the diff shows genuine changes instead of hash churn. Reporting-only, not a merge gate. Added a `main` ruleset requiring the `check` status, with the repo owner as bypass actor so direct pushes still work.

## 2026-08-08
Converted the site from Zola to Astro. Every URL is unchanged, including `/posts/<slug>/`, `/posts/page/N/`, `/tags/`, the feeds, and `_redirects`. The Apollo theme submodule is gone — its styles now live in `src/styles/`, ported to plain SCSS with the site's own overrides folded in. Content moved to Astro collections (`taxonomies`/`extra` front matter flattened to plain keys, dates quoted to preserve their UTC offset), the `figure` shortcode became an MDX `Figure` component with real image optimization, and `zola check` was replaced by `npm run check` (`astro check` + build + `bin/check-links.mjs`). Feeds now emit absolute URLs, which the old `base_url = "/"` had broken.

## 2026-04-14
Added link post support (PR #1236). Posts with `extra.external_url` in frontmatter render their title as a link to the external URL, with a Lucide external link icon inline and an anchor permalink icon linking back to the post page. Atom and RSS feeds follow Daring Fireball's pattern — external URL as the primary link, post permalink as a related link. Post page title changed from `<div>` to semantic `<h1>`. Fixed cramped line-height on wrapping titles on mobile.

## 2026-04-11
Removed blights-of-the-eastern-forest post and added redirects to wanderingreferee.com (#1235). Also removed other content that had moved to wanderingreferee.com.

## 2026-04-06
Added git hook to run `zola check` on pre-commit. Added "Managing Well, Part 1" post.

## 2026-04-05
Added projects page. Added "Hidden Apps" post. Updated Apollo theme. Switched primary link color from red to blue. Added `bin/` scripts, Ruby version, and Claude config.

## 2026-01-12
Added GitHub Action for `zola check` on push/PR. Fixed zola config (#1234).

## 2025-01-05
Converted site from Gatsby/Jekyll to Zola (#1233). Added Plausible analytics.
