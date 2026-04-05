#!/bin/bash
set -e

# Install Zola
ZOLA_VERSION="${ZOLA_VERSION:-0.22.0}"
echo "Installing Zola v${ZOLA_VERSION}..."

# Download and extract Zola
wget -q -O zola.tar.gz "https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz"
tar -xzf zola.tar.gz
chmod +x zola
mkdir -p /opt/buildhome/.local/bin
mv zola /opt/buildhome/.local/bin/
export PATH="/opt/buildhome/.local/bin:$PATH"

echo "Zola installed successfully!"
zola --version
