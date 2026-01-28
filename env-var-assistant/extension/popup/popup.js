/**
 * Popup script for Env Var Assistant
 */

// API key patterns (duplicated here for popup-side detection)
const API_KEY_PATTERNS = [
  {
    provider: 'openai',
    name: 'OpenAI API Key',
    pattern: /sk-[a-zA-Z0-9]{48,}/,
    dashboardUrl: 'https://platform.openai.com/api-keys',
    tags: ['env-var', 'openai', 'ai']
  },
  {
    provider: 'openai-project',
    name: 'OpenAI Project Key',
    pattern: /sk-proj-[a-zA-Z0-9_-]{80,}/,
    dashboardUrl: 'https://platform.openai.com/api-keys',
    tags: ['env-var', 'openai', 'ai']
  },
  {
    provider: 'anthropic',
    name: 'Anthropic API Key',
    pattern: /sk-ant-[a-zA-Z0-9-]{95,}/,
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
    tags: ['env-var', 'anthropic', 'ai']
  },
  {
    provider: 'github-pat',
    name: 'GitHub Personal Access Token',
    pattern: /ghp_[a-zA-Z0-9]{36}/,
    dashboardUrl: 'https://github.com/settings/tokens',
    tags: ['env-var', 'github', 'vcs']
  },
  {
    provider: 'github-pat-fine',
    name: 'GitHub Fine-Grained PAT',
    pattern: /github_pat_[a-zA-Z0-9_]{82}/,
    dashboardUrl: 'https://github.com/settings/tokens',
    tags: ['env-var', 'github', 'vcs']
  },
  {
    provider: 'aws-access-key',
    name: 'AWS Access Key ID',
    pattern: /AKIA[0-9A-Z]{16}/,
    dashboardUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials',
    tags: ['env-var', 'aws', 'cloud']
  },
  {
    provider: 'stripe-live',
    name: 'Stripe Live Secret Key',
    pattern: /sk_live_[a-zA-Z0-9]{24,}/,
    dashboardUrl: 'https://dashboard.stripe.com/apikeys',
    tags: ['env-var', 'stripe', 'payments']
  },
  {
    provider: 'stripe-test',
    name: 'Stripe Test Secret Key',
    pattern: /sk_test_[a-zA-Z0-9]{24,}/,
    dashboardUrl: 'https://dashboard.stripe.com/test/apikeys',
    tags: ['env-var', 'stripe', 'payments']
  },
  {
    provider: 'sendgrid',
    name: 'SendGrid API Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/,
    dashboardUrl: 'https://app.sendgrid.com/settings/api_keys',
    tags: ['env-var', 'sendgrid', 'email']
  },
  {
    provider: 'twilio-account-sid',
    name: 'Twilio Account SID',
    pattern: /AC[a-f0-9]{32}/,
    dashboardUrl: 'https://console.twilio.com/',
    tags: ['env-var', 'twilio', 'communications']
  },
  {
    provider: 'slack-bot',
    name: 'Slack Bot Token',
    pattern: /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/,
    dashboardUrl: 'https://api.slack.com/apps',
    tags: ['env-var', 'slack', 'messaging']
  },
  {
    provider: 'slack-user',
    name: 'Slack User Token',
    pattern: /xoxp-[0-9]+-[0-9]+-[0-9]+-[a-f0-9]+/,
    dashboardUrl: 'https://api.slack.com/apps',
    tags: ['env-var', 'slack', 'messaging']
  }
]

// DOM elements
const connectionStatus = document.getElementById('connection-status')
const statusDot = connectionStatus.querySelector('.status-dot')
const statusText = connectionStatus.querySelector('.status-text')
const checkClipboardBtn = document.getElementById('check-clipboard')
const detectedKeys = document.getElementById('detected-keys')
const secretsList = document.getElementById('secrets-list')
const refreshSecretsBtn = document.getElementById('refresh-secrets')
const clipboardMonitoring = document.getElementById('clipboard-monitoring')
const autoFill = document.getElementById('auto-fill')
const defaultVault = document.getElementById('default-vault')
const settingsSection = document.getElementById('settings-section')
const open1Password = document.getElementById('open-1password')

/**
 * Initialize popup
 */
async function init() {
  // Setup event listeners
  checkClipboardBtn.addEventListener('click', checkClipboard)
  refreshSecretsBtn.addEventListener('click', loadSecrets)

  // Settings toggle
  settingsSection.querySelector('.collapsible').addEventListener('click', () => {
    settingsSection.classList.toggle('collapsed')
  })

  // Settings changes
  clipboardMonitoring.addEventListener('change', saveSettings)
  autoFill.addEventListener('change', saveSettings)
  defaultVault.addEventListener('change', saveSettings)

  // Open 1Password
  open1Password.addEventListener('click', (e) => {
    e.preventDefault()
    chrome.tabs.create({ url: 'onepassword://search/env-var' })
  })

  // Check connection and load data
  await checkConnection()
  await loadSettings()
  await loadSecrets()
}

/**
 * Send message to service worker
 */
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else {
        resolve(response)
      }
    })
  })
}

/**
 * Check connection to native host
 */
async function checkConnection() {
  try {
    const response = await sendMessage({ action: 'checkConnection' })

    if (response.success) {
      statusDot.classList.add('connected')
      statusDot.classList.remove('error')
      statusText.textContent = 'Connected to 1Password'
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    statusDot.classList.add('error')
    statusDot.classList.remove('connected')
    statusText.textContent = error.message || 'Connection failed'
    showToast('Failed to connect to 1Password CLI', 'error')
  }
}

/**
 * Detect API keys in text
 */
function detectApiKeys(text) {
  const detected = []

  for (const pattern of API_KEY_PATTERNS) {
    const match = text.match(pattern.pattern)
    if (match) {
      detected.push({
        provider: pattern.provider,
        name: pattern.name,
        value: match[0],
        dashboardUrl: pattern.dashboardUrl,
        tags: pattern.tags
      })
    }
  }

  return detected
}

/**
 * Check if a key is likely real (not a placeholder)
 */
function isLikelyRealKey(value) {
  const placeholders = [
    /^sk-xxx+$/i,
    /^your[_-]?api[_-]?key$/i,
    /^insert[_-]?here$/i,
    /^replace[_-]?me$/i,
    /^todo$/i,
    /^example$/i,
    /^test$/i,
    /^demo$/i
  ]

  return !placeholders.some(p => p.test(value))
}

/**
 * Check clipboard for API keys - reads directly in popup
 */
async function checkClipboard() {
  checkClipboardBtn.disabled = true
  checkClipboardBtn.textContent = 'Checking...'

  try {
    // Read clipboard directly from popup (has permission)
    const text = await navigator.clipboard.readText()

    if (!text) {
      detectedKeys.innerHTML = '<div class="empty">Clipboard is empty</div>'
      return
    }

    // Detect API keys
    const detected = detectApiKeys(text)
    const realKeys = detected.filter(k => isLikelyRealKey(k.value))

    if (realKeys.length > 0) {
      renderDetectedKeys(realKeys)
      showToast(`Found ${realKeys.length} API key(s)`, 'success')
    } else {
      detectedKeys.innerHTML = '<div class="empty">No API keys detected in clipboard</div>'
    }
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      detectedKeys.innerHTML = '<div class="error">Clipboard access denied. Click the page first, then try again.</div>'
    } else {
      showToast(error.message, 'error')
    }
  } finally {
    checkClipboardBtn.disabled = false
    checkClipboardBtn.textContent = 'Check Clipboard'
  }
}

/**
 * Render detected API keys
 */
function renderDetectedKeys(keys) {
  // Store keys in a map for retrieval (avoids JSON in HTML attributes)
  const keyMap = new Map()

  detectedKeys.innerHTML = keys.map((key, index) => {
    keyMap.set(index, key)
    return `
    <div class="key-item" data-key-index="${index}">
      <div class="key-info">
        <div class="key-name">${escapeHtml(key.name)}</div>
        <div class="key-value">${maskValue(key.value)}</div>
      </div>
      <div class="key-actions">
        <button class="btn btn-success save-key">Save</button>
      </div>
    </div>
  `}).join('')

  // Add save handlers
  detectedKeys.querySelectorAll('.save-key').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const item = e.target.closest('.key-item')
      const index = parseInt(item.dataset.keyIndex, 10)
      const key = keyMap.get(index)
      if (key) {
        await saveKey(key, e.target)
      }
    })
  })
}

/**
 * Save a detected key to 1Password
 */
async function saveKey(key, button) {
  button.disabled = true
  button.textContent = 'Saving...'

  try {
    const response = await sendMessage({
      action: 'saveDetected',
      detected: key,
      vault: defaultVault.value || undefined
    })

    if (response.success) {
      button.textContent = 'Saved!'
      button.classList.remove('btn-success')
      button.classList.add('btn-secondary')
      showToast('Saved to 1Password', 'success')
      await loadSecrets()
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    button.disabled = false
    button.textContent = 'Save'
    showToast(error.message, 'error')
  }
}

/**
 * Load saved secrets from 1Password
 */
async function loadSecrets() {
  secretsList.innerHTML = '<div class="loading">Loading...</div>'

  try {
    const response = await sendMessage({
      action: 'listEnvVars',
      vault: defaultVault.value || undefined
    })

    if (response.success) {
      renderSecrets(response.data || [])
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    secretsList.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`
  }
}

/**
 * Render saved secrets list
 */
function renderSecrets(secrets) {
  if (secrets.length === 0) {
    secretsList.innerHTML = '<div class="empty">No env vars saved yet</div>'
    return
  }

  secretsList.innerHTML = secrets.map(secret => `
    <div class="key-item" data-id="${escapeHtml(secret.id)}">
      <div class="key-info">
        <div class="key-name">${escapeHtml(secret.title)}</div>
        <div class="key-provider">${escapeHtml(secret.vault || 'Private')}</div>
      </div>
      <div class="key-actions">
        <button class="btn btn-primary copy-key" data-reference="${escapeHtml(secret.reference)}">
          Copy
        </button>
        <button class="btn btn-secondary fill-key" data-reference="${escapeHtml(secret.reference)}">
          Fill
        </button>
      </div>
    </div>
  `).join('')

  // Add copy handlers
  secretsList.querySelectorAll('.copy-key').forEach(btn => {
    btn.addEventListener('click', () => copySecret(btn.dataset.reference, btn))
  })

  // Add fill handlers
  secretsList.querySelectorAll('.fill-key').forEach(btn => {
    btn.addEventListener('click', () => fillSecret(btn.dataset.reference))
  })
}

/**
 * Copy a secret to clipboard
 */
async function copySecret(reference, button) {
  button.disabled = true

  try {
    const response = await sendMessage({
      action: 'readSecret',
      reference
    })

    if (response.success) {
      await navigator.clipboard.writeText(response.data)
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = 'Copy'
        button.disabled = false
      }, 1500)
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    button.disabled = false
    showToast(error.message, 'error')
  }
}

/**
 * Fill a secret on the current page
 */
async function fillSecret(reference) {
  try {
    // Get the secret value
    const secretResponse = await sendMessage({
      action: 'readSecret',
      reference
    })

    if (!secretResponse.success) {
      throw new Error(secretResponse.error)
    }

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab?.id) {
      throw new Error('No active tab')
    }

    // Extract env var name from reference (op://vault/item/field)
    const parts = reference.split('/')
    const envVarName = parts[parts.length - 1] || 'API_KEY'

    // Send fill command to content script
    try {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'fillEnvVar',
        envVarName,
        value: secretResponse.data
      })
      showToast('Filled on page', 'success')
      window.close()
    } catch (error) {
      // Content script not available - copy to clipboard instead
      await navigator.clipboard.writeText(secretResponse.data)
      showToast('Copied to clipboard (page not supported for auto-fill)', 'success')
    }
  } catch (error) {
    showToast(error.message, 'error')
  }
}

/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const response = await sendMessage({ action: 'getSettings' })

    if (response.success && response.data) {
      clipboardMonitoring.checked = response.data.clipboardMonitoring ?? true
      autoFill.checked = response.data.autoFill ?? true
      defaultVault.value = response.data.defaultVault || ''
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

/**
 * Save settings to storage
 */
async function saveSettings() {
  try {
    await sendMessage({
      action: 'updateSettings',
      settings: {
        clipboardMonitoring: clipboardMonitoring.checked,
        autoFill: autoFill.checked,
        defaultVault: defaultVault.value || null
      }
    })
  } catch (error) {
    showToast('Failed to save settings', 'error')
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = `toast ${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

/**
 * Mask a secret value for display
 */
function maskValue(value) {
  if (value.length <= 8) {
    return '........'
  }
  return value.slice(0, 4) + '....' + value.slice(-4)
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init)
