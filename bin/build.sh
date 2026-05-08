#!/usr/bin/env bash
set -euo pipefail

# Show draft posts on preview deployments; hide them on production (main).
if [ "${CF_PAGES_BRANCH:-main}" = "main" ]; then
  zola build
else
  zola build --drafts
fi
