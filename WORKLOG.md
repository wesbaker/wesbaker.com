# WORKLOG

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
