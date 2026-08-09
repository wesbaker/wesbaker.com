# Dependabot Automation for wesbaker.com

**Date:** 2026-08-08
**Status:** Approved, pending implementation
**Branch:** `claude/astro-dependabot-automation-eba573`

## Problem

The site moved from Zola to Astro (#1243), which introduced a real npm
dependency tree for the first time. Nine direct dependencies now need routine
upgrades. The goal is weekly Monday updates with as much of the review and
merge flow automated as is safe.

A prior attempt on another repo (`wesbaker/littlepagevet`) used Playwright
visual regression tests as the safety net. Those tests never pass on Dependabot
pull requests. This spec replaces that approach.

## Background: why Playwright fails on Dependabot PRs

Confirmed by reading `littlepagevet`'s `.github/workflows/visual-test.yml`:

1. **Secrets resolve to a different store.** The job reads
   `secrets.CLOUDFLARE_ACCOUNT_ID` and `secrets.CLOUDFLARE_API_TOKEN`. On a
   `pull_request` event opened by Dependabot, `secrets.*` resolves against the
   *Dependabot* secrets store, not Actions secrets. Unless duplicated there,
   both are empty and the job exits on its own guard clause before Playwright
   runs. This is the primary failure.
2. **Baselines drift.** Snapshots regenerate from live production
   (`BASE_URL: https://littlepage.vet`), so they change with content
   independently of any PR.
3. **No write path.** Dependabot's `GITHUB_TOKEN` is read-only by default, so
   Dependabot could never push corrected snapshots back to its own branch.

Screenshot testing is the wrong tool here. A static site has a better signal
available: the built output itself.

## Background: the compatibility score

Dependabot embeds a compatibility badge in single-dependency PR bodies:

```
https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=X&package-manager=npm_and_yarn&previous-version=A&new-version=B
```

`api.dependabot.com` 301-redirects to that host. The SVG contains
`aria-label="compatibility: 83%"`, which is straightforward to parse.

Two constraints were verified empirically against this repo's dependencies:

**Coverage is partial.** Of the nine direct dependencies:

| Dependency | Bump tested | Score |
| --- | --- | --- |
| `@astrojs/mdx` | 7.0.4 → 7.0.5 | 88% |
| `sass` | 1.101.7 → 1.102.0 | 85% |
| `@astrojs/check` | 0.9.9 → 0.9.10 | 81% |
| `@astrojs/sitemap` | 3.7.2 → 3.7.3 | 81% |
| `typescript` | 6.0.3 → 7.0.2 | 40% |
| `astro` | 7.1.6 → 7.2.0 | unknown |
| `rehype-slug` | 5.1.0 → 6.0.0 | unknown |
| `rehype-autolink-headings` | 7.0.0 → 7.1.0 | unknown |
| `rehype-external-links` | 2.1.0 → 3.0.0 | unknown |

A strict `>= 80%` requirement would permanently block `astro` minors — the most
frequent and most important update — plus all three rehype packages. Therefore
the score is treated as a **veto, not a visa**: a known score below the
threshold blocks; `unknown` falls through to CI.

**Grouped PRs have no badges.** Verified on `littlepagevet` PR #360, a
two-dependency PR: zero `compatibility_score` URLs in the body. Grouping and
score-gating are mutually exclusive. npm updates therefore stay ungrouped.

## Design

### 1. `.github/dependabot.yml`

Two ecosystems, both weekly on Monday at 06:00 `America/New_York`.

- **npm — ungrouped.** One PR per dependency preserves the compatibility badge.
  PR volume is acceptable because passing updates auto-merge without attention.
- **github-actions — grouped.** Action updates have no compatibility scores at
  all, so grouping costs no signal and collapses routine bumps into one PR.

Label both `dependencies`.

Note: `littlepagevet`'s config omits `day:`, and weekly already defaults to
Monday, so that repo was on Monday incidentally. Here it is explicit. That repo
also has no `github-actions` entry, so its Action versions have never updated.

### 2. `bin/dependabot-compat-score.rb`

Ruby, stdlib only (`net/http`, `uri`). Ruby is preinstalled on
`ubuntu-latest`, and this avoids adding npm dependencies to a repo whose
dependency surface we are specifically trying to keep small. The repo already
contains Ruby scripts in `bin/`.

**Interface:** reads a PR body on stdin, writes one line to stdout.

- Body contains a badge and the fetched SVG has a percentage → that integer
  (e.g. `83`)
- Body contains no badge URL (grouped or multi-dependency PR) → `unknown`
- Badge present but SVG says `unknown`, or the fetch fails → `unknown`

Exit status is `0` in all of the above. `unknown` is a normal outcome, not an
error — the whole point of the veto model is that absence of data does not
block.

### 3. `.github/workflows/dependabot-auto-merge.yml`

Trigger `pull_request`, guarded by `github.actor == 'dependabot[bot]'`.
Declares `permissions: { contents: write, pull-requests: write }`, which is the
documented way to elevate Dependabot's otherwise read-only token.

Uses `dependabot/fetch-metadata@v2` and `gh pr merge --auto --squash`. The repo
has squash merge and auto-delete-branch enabled.

| Condition | Action |
| --- | --- |
| `update-type` is major | Hold; comment stating the reason |
| Score is known and `< 80` | Hold; comment including the score |
| Score `>= 80` or `unknown` | `gh pr merge --auto --squash` |
| `package-ecosystem` is `github-actions` | Auto-merge on CI alone |

`--auto` is what defers the merge until required checks pass; it depends on the
ruleset in section 5.

### 4. `.github/workflows/output-diff.yml`

Replaces visual regression testing. Deterministic, needs no browser, no
committed baselines, and no secrets — so it works under Dependabot's token.

1. Build the PR ref → `dist-pr/`
2. Build the base ref → `dist-base/`
3. Normalize both
4. `diff -ru`, post a single sticky comment (created once, updated thereafter)

**Normalization is the one piece of real engineering.** Astro emits
content-hashed asset names such as `_astro/index.BX3kLm2p.css`. The hash must be
rewritten to a stable placeholder in *both* filenames and every HTML reference.
Without this, one changed CSS byte cascades into a diff on every page and the
output is useless. Genuine content changes still surface in the normalized
file's own diff.

**Non-blocking and reporting-only.** It must not be added to the ruleset's
required checks. Merge logic stays the single condition in section 3.

Scope to Dependabot PRs initially. Broadening to all PRs is a one-line change
if it proves useful.

### 5. Branch ruleset on `main`

Auto-merge is meaningless without a required check: with no protection,
`gh pr merge --auto` merges immediately, before CI runs. Add a ruleset on `main`
requiring the `check` status check.

**Gotcha:** required status checks block direct pushes, because the check cannot
be evaluated ahead of a push. Recent history shows direct pushes to `main`
(`0fec9c2`, `0a8d860`). The ruleset therefore needs a **bypass actor for the
repo owner**, so Dependabot is gated while direct pushes still work.

Do **not** require a pull request — that would also break direct pushes.

**This is a live repository settings change.** Show the exact ruleset JSON and
get explicit confirmation before applying it.

## Testing

Minitest (Ruby stdlib, no new dependencies). The score parser is the only
component with real logic; the rest is declarative YAML.

Cases:

1. Body with a badge whose SVG reports a percentage → that integer
2. Body with a badge whose SVG reports `unknown` → `unknown`
3. Body with no badge URL (multi-dependency PR) → `unknown`
4. Network failure while fetching the badge → `unknown`, exit 0

HTTP is stubbed; tests make no network calls.

Follow red/green/refactor: write each failing test, confirm it fails for the
right reason, then implement.

## Out of scope

- Grouping npm updates (forfeits the compatibility score)
- Making the output diff blocking
- Migrating or fixing `littlepagevet`; findings there informed this design only
- Reclassifying build-time packages from `dependencies` to `devDependencies`

## Verification

- `npm run check` passes
- Minitest suite passes
- `.github/dependabot.yml` parses as valid Dependabot v2 config
- Both workflows parse as valid Actions YAML
- `WORKLOG.md` updated (site changes are logged; new posts are not)
