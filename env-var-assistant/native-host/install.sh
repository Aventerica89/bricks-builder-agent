#!/bin/bash

# Native Messaging Host Installation Script for Env Var Assistant
# This script installs the native messaging host manifest for Chrome

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_NAME="com.envvar.assistant"

# Determine Chrome native messaging hosts directory
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  CHROME_HOSTS_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
  CHROMIUM_HOSTS_DIR="$HOME/Library/Application Support/Chromium/NativeMessagingHosts"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  CHROME_HOSTS_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
  CHROMIUM_HOSTS_DIR="$HOME/.config/chromium/NativeMessagingHosts"
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

# Make host script executable
chmod +x "$SCRIPT_DIR/host.js"

# Function to install manifest
install_manifest() {
  local hosts_dir="$1"
  local browser_name="$2"

  # Create directory if it doesn't exist
  mkdir -p "$hosts_dir"

  # Get extension ID from user or use placeholder
  local extension_id="${EXTENSION_ID:-EXTENSION_ID_PLACEHOLDER}"

  # Create manifest with correct path and extension ID
  cat > "$hosts_dir/$HOST_NAME.json" << EOF
{
  "name": "$HOST_NAME",
  "description": "Env Var Assistant Native Messaging Host",
  "path": "$SCRIPT_DIR/host.js",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$extension_id/"
  ]
}
EOF

  echo "Installed native messaging host for $browser_name"
  echo "  Manifest: $hosts_dir/$HOST_NAME.json"
}

# Check for 1Password CLI
echo "Checking for 1Password CLI..."
if command -v op &> /dev/null; then
  OP_VERSION=$(op --version)
  echo "  Found: op version $OP_VERSION"
else
  echo "  WARNING: 1Password CLI (op) not found!"
  echo "  Install it with: brew install 1password-cli"
  echo ""
fi

# Install for Chrome
if [[ -d "$(dirname "$CHROME_HOSTS_DIR")" ]]; then
  install_manifest "$CHROME_HOSTS_DIR" "Chrome"
fi

# Install for Chromium
if [[ -d "$(dirname "$CHROMIUM_HOSTS_DIR")" ]]; then
  install_manifest "$CHROMIUM_HOSTS_DIR" "Chromium"
fi

echo ""
echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Load the extension in Chrome:"
echo "   - Go to chrome://extensions"
echo "   - Enable 'Developer mode'"
echo "   - Click 'Load unpacked'"
echo "   - Select: $SCRIPT_DIR/../extension"
echo ""
echo "2. Copy the extension ID from chrome://extensions"
echo ""
echo "3. Update the manifest with your extension ID:"
echo "   EXTENSION_ID=your-extension-id $0"
echo ""
echo "4. Make sure you're signed in to 1Password:"
echo "   op signin"
