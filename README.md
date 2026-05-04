# wesbaker.com

Personal site built with [Zola](https://www.getzola.org/) and the Apollo theme.

## Setup

1. Clone the repository.
2. Initialize the theme submodule:

```bash
git submodule update --init --recursive
```

3. Install Zola.

If you use Homebrew:

```bash
brew install zola
```

4. Enable the repo's versioned Git hooks:

```bash
bin/setup-git-hooks
```

That hook runs `zola check --skip-external-links` before each commit so malformed front matter and broken internal links fail locally.


### Codex setup script

If you are using Codex's **Setup script** field, use:

```bash
git submodule update --init --recursive
./bin/install-zola.sh
bin/setup-git-hooks
```

This ensures `zola` is available before running local checks/builds in the container.

## Common Commands

```bash
zola serve                        # Start local dev server
zola build                        # Build the site into public/
zola check --skip-external-links  # Validate site content and internal links
```

## GitHub Checks

GitHub Actions also runs `zola check --skip-external-links` on pull requests and pushes to `main`.
