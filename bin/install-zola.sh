#!/usr/bin/env bash
set -euo pipefail

# Install Zola
ZOLA_VERSION="${ZOLA_VERSION:-0.22.0}"
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
  x86_64|amd64) ARCH="x86_64" ;;
  aarch64|arm64) ARCH="aarch64" ;;
  *)
    echo "Unsupported architecture: $ARCH" >&2
    exit 1
    ;;
esac

ASSET="zola-v${ZOLA_VERSION}-${ARCH}-unknown-${OS}-gnu.tar.gz"
URL="https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/${ASSET}"
INSTALL_DIR="${ZOLA_INSTALL_DIR:-$HOME/.local/bin}"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$INSTALL_DIR"
cd "$TMP_DIR"

echo "Installing Zola v${ZOLA_VERSION} for ${OS}/${ARCH}..."
curl -fsSL "$URL" -o zola.tar.gz
tar -xzf zola.tar.gz
chmod +x zola
mv zola "$INSTALL_DIR/zola"

if ! command -v zola >/dev/null 2>&1; then
  echo "Zola installed to $INSTALL_DIR. Add this to your shell profile if needed:"
  echo "  export PATH=\"$INSTALL_DIR:\$PATH\""
  export PATH="$INSTALL_DIR:$PATH"
fi

echo "Zola installed successfully: $(zola --version)"
