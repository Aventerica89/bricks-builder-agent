# Env Var Assistant

A Chrome extension that detects API keys from your clipboard and stores them in 1Password, with auto-fill support for provider dashboards.

## Features

- **Clipboard Detection**: Automatically detects API keys when you copy them
- **1Password Storage**: Saves detected keys to 1Password with proper tagging
- **Auto-Fill**: Fill environment variables on provider dashboards (Cloudflare, Vercel, Netlify, etc.)
- **Pattern Recognition**: Recognizes keys from OpenAI, Anthropic, GitHub, AWS, Stripe, and more

## Requirements

- Google Chrome
- [1Password CLI](https://1password.com/downloads/command-line/) (`brew install 1password-cli`)
- 1Password desktop app (for biometric authentication)
- Node.js 18+

## Installation

### 1. Install 1Password CLI

```bash
brew install 1password-cli
```

### 2. Sign in to 1Password CLI

```bash
op signin
```

Make sure biometric unlock is enabled in your 1Password desktop app.

### 3. Install the Native Messaging Host

```bash
cd native-host
./install.sh
```

### 4. Load the Chrome Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder

### 5. Update the Extension ID

1. Copy the extension ID from `chrome://extensions`
2. Re-run the install script with your extension ID:

```bash
EXTENSION_ID=your-extension-id-here ./install.sh
```

## Usage

### Detecting API Keys

1. Copy an API key to your clipboard
2. The extension will detect it and show a notification
3. Click "Save to 1Password" to store it

Or manually:
1. Click the extension icon
2. Click "Check Clipboard"
3. If a key is detected, click "Save"

### Auto-Filling on Dashboards

1. Navigate to a supported dashboard (Cloudflare, Vercel, Netlify, etc.)
2. Click the floating key button or the extension popup
3. Select a saved secret and click "Fill"

### Supported Providers

Detection:
- OpenAI (sk-...)
- Anthropic (sk-ant-...)
- GitHub (ghp_..., github_pat_...)
- AWS (AKIA...)
- Stripe (sk_live_..., sk_test_...)
- SendGrid (SG....)
- Twilio
- Slack (xoxb-..., xoxp-...)

Auto-fill dashboards:
- Cloudflare Workers & Pages
- Vercel
- Netlify
- GitHub Secrets

## Project Structure

```
env-var-assistant/
├── extension/
│   ├── manifest.json          # Chrome extension manifest
│   ├── service-worker.js      # Background service worker
│   ├── popup/                 # Popup UI
│   ├── content/               # Content scripts
│   └── lib/                   # Shared libraries
├── native-host/
│   ├── host.js               # Native messaging host
│   ├── install.sh            # Installation script
│   └── com.envvar.assistant.json
└── README.md
```

## Troubleshooting

### "Connection failed" in popup

1. Check that 1Password CLI is installed: `op --version`
2. Check that you're signed in: `op vault list`
3. Re-run the install script with your extension ID
4. Restart Chrome

### Keys not being detected

The extension only detects specific patterns. Make sure the key matches one of the supported formats. Generic tokens (like Cloudflare API tokens) require context to be detected.

### Auto-fill not working

1. Make sure you're on a supported dashboard
2. Navigate to the environment variables section
3. The page structure may have changed - please file an issue

## Security

- All secrets are stored in 1Password, never in browser storage
- Native messaging uses Chrome's secure protocol
- The extension only has access to specified dashboard URLs
- Clipboard is only read on user action or with explicit permission
