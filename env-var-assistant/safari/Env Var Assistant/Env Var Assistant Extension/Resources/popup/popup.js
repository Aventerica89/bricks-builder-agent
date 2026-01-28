/**
 * Popup script for Env Var Assistant
 */

// Import-like pattern definitions (duplicated for popup context)
// In production, these would be shared via ES modules

// API key patterns (duplicated here for popup-side detection)
// Expanded to cover 60+ services
const API_KEY_PATTERNS = [
  // AI / ML
  { provider: 'openai', name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{48,}/, dashboardUrl: 'https://platform.openai.com/api-keys', tags: ['env-var', 'openai', 'ai'] },
  { provider: 'openai-project', name: 'OpenAI Project Key', pattern: /sk-proj-[a-zA-Z0-9_-]{80,}/, dashboardUrl: 'https://platform.openai.com/api-keys', tags: ['env-var', 'openai', 'ai'] },
  { provider: 'anthropic', name: 'Anthropic API Key', pattern: /sk-ant-[a-zA-Z0-9_-]{90,}/, dashboardUrl: 'https://console.anthropic.com/settings/keys', tags: ['env-var', 'anthropic', 'ai'] },
  { provider: 'google-ai', name: 'Google AI API Key', pattern: /AIza[a-zA-Z0-9_-]{35}/, dashboardUrl: 'https://aistudio.google.com/app/apikey', tags: ['env-var', 'google', 'ai'] },
  { provider: 'replicate', name: 'Replicate API Token', pattern: /r8_[a-zA-Z0-9]{37}/, dashboardUrl: 'https://replicate.com/account/api-tokens', tags: ['env-var', 'replicate', 'ai'] },
  { provider: 'huggingface', name: 'Hugging Face Token', pattern: /hf_[a-zA-Z0-9]{34}/, dashboardUrl: 'https://huggingface.co/settings/tokens', tags: ['env-var', 'huggingface', 'ai'] },

  // Version Control
  { provider: 'github-pat', name: 'GitHub Personal Access Token', pattern: /ghp_[a-zA-Z0-9]{36}/, dashboardUrl: 'https://github.com/settings/tokens', tags: ['env-var', 'github', 'vcs'] },
  { provider: 'github-pat-fine', name: 'GitHub Fine-Grained PAT', pattern: /github_pat_[a-zA-Z0-9_]{82}/, dashboardUrl: 'https://github.com/settings/tokens', tags: ['env-var', 'github', 'vcs'] },
  { provider: 'github-oauth', name: 'GitHub OAuth Token', pattern: /gho_[a-zA-Z0-9]{36}/, dashboardUrl: 'https://github.com/settings/developers', tags: ['env-var', 'github', 'vcs'] },
  { provider: 'github-app', name: 'GitHub App Token', pattern: /ghu_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}/, dashboardUrl: 'https://github.com/settings/apps', tags: ['env-var', 'github', 'vcs'] },
  { provider: 'gitlab-pat', name: 'GitLab Personal Access Token', pattern: /glpat-[a-zA-Z0-9_-]{20}/, dashboardUrl: 'https://gitlab.com/-/profile/personal_access_tokens', tags: ['env-var', 'gitlab', 'vcs'] },
  { provider: 'bitbucket', name: 'Bitbucket App Password', pattern: /ATBB[a-zA-Z0-9]{32}/, dashboardUrl: 'https://bitbucket.org/account/settings/app-passwords/', tags: ['env-var', 'bitbucket', 'vcs'] },

  // Cloud
  { provider: 'aws-access-key', name: 'AWS Access Key ID', pattern: /AKIA[0-9A-Z]{16}/, dashboardUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials', tags: ['env-var', 'aws', 'cloud'] },
  { provider: 'netlify', name: 'Netlify Personal Access Token', pattern: /nfp_[a-zA-Z0-9]{40}/, dashboardUrl: 'https://app.netlify.com/user/applications#personal-access-tokens', tags: ['env-var', 'netlify', 'hosting'] },
  { provider: 'render', name: 'Render API Key', pattern: /rnd_[a-zA-Z0-9]{32}/, dashboardUrl: 'https://dashboard.render.com/u/settings#api-keys', tags: ['env-var', 'render', 'hosting'] },
  { provider: 'fly', name: 'Fly.io API Token', pattern: /fo1_[a-zA-Z0-9_-]{43}/, dashboardUrl: 'https://fly.io/user/personal_access_tokens', tags: ['env-var', 'fly', 'hosting'] },
  { provider: 'digitalocean', name: 'DigitalOcean Token', pattern: /dop_v1_[a-f0-9]{64}/, dashboardUrl: 'https://cloud.digitalocean.com/account/api/tokens', tags: ['env-var', 'digitalocean', 'cloud'] },
  { provider: 'cloudflare-api', name: 'Cloudflare API Token', pattern: /[A-Za-z][A-Za-z0-9_-]{38}[A-Za-z0-9]/, dashboardUrl: 'https://dash.cloudflare.com/profile/api-tokens', tags: ['env-var', 'cloudflare', 'cdn'] },

  // Database
  { provider: 'supabase-publishable', name: 'Supabase Publishable Key', pattern: /sb_publishable_[a-zA-Z0-9_-]{20,}/, dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api', tags: ['env-var', 'supabase', 'database'] },
  { provider: 'supabase-secret', name: 'Supabase Secret Key', pattern: /sb_secret_[a-zA-Z0-9_-]{20,}/, dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api', tags: ['env-var', 'supabase', 'database'] },
  { provider: 'planetscale', name: 'PlanetScale Password', pattern: /pscale_pw_[a-zA-Z0-9_-]{43}/, dashboardUrl: 'https://app.planetscale.com/', tags: ['env-var', 'planetscale', 'database'] },
  { provider: 'neon', name: 'Neon API Key', pattern: /neon_[a-zA-Z0-9_-]{32,}/, dashboardUrl: 'https://console.neon.tech/app/settings/api-keys', tags: ['env-var', 'neon', 'database'] },
  { provider: 'mongodb', name: 'MongoDB Connection String', pattern: /mongodb\+srv:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_.-]+/, dashboardUrl: 'https://cloud.mongodb.com/', tags: ['env-var', 'mongodb', 'database'] },
  { provider: 'redis', name: 'Redis/Upstash URL', pattern: /rediss?:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_.-]+/, dashboardUrl: 'https://console.upstash.com/', tags: ['env-var', 'redis', 'database'] },

  // Auth
  { provider: 'clerk-publishable', name: 'Clerk Publishable Key', pattern: /pk_(?:test|live)_[a-zA-Z0-9]{40,}/, dashboardUrl: 'https://dashboard.clerk.com/', tags: ['env-var', 'clerk', 'auth'] },
  { provider: 'clerk-secret', name: 'Clerk Secret Key', pattern: /sk_(?:test|live)_[a-zA-Z0-9]{40,}/, dashboardUrl: 'https://dashboard.clerk.com/', tags: ['env-var', 'clerk', 'auth'] },

  // Payments
  { provider: 'stripe-publishable-live', name: 'Stripe Live Publishable Key', pattern: /pk_live_[a-zA-Z0-9]{24,}/, dashboardUrl: 'https://dashboard.stripe.com/apikeys', tags: ['env-var', 'stripe', 'payments'] },
  { provider: 'stripe-publishable-test', name: 'Stripe Test Publishable Key', pattern: /pk_test_[a-zA-Z0-9]{24,}/, dashboardUrl: 'https://dashboard.stripe.com/test/apikeys', tags: ['env-var', 'stripe', 'payments'] },
  { provider: 'stripe-live', name: 'Stripe Live Secret Key', pattern: /sk_live_[a-zA-Z0-9]{24,}/, dashboardUrl: 'https://dashboard.stripe.com/apikeys', tags: ['env-var', 'stripe', 'payments'] },
  { provider: 'stripe-test', name: 'Stripe Test Secret Key', pattern: /sk_test_[a-zA-Z0-9]{24,}/, dashboardUrl: 'https://dashboard.stripe.com/test/apikeys', tags: ['env-var', 'stripe', 'payments'] },
  { provider: 'stripe-webhook', name: 'Stripe Webhook Secret', pattern: /whsec_[a-zA-Z0-9]{32,}/, dashboardUrl: 'https://dashboard.stripe.com/webhooks', tags: ['env-var', 'stripe', 'payments'] },

  // Email
  { provider: 'sendgrid', name: 'SendGrid API Key', pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/, dashboardUrl: 'https://app.sendgrid.com/settings/api_keys', tags: ['env-var', 'sendgrid', 'email'] },
  { provider: 'resend', name: 'Resend API Key', pattern: /re_[a-zA-Z0-9]{32,}/, dashboardUrl: 'https://resend.com/api-keys', tags: ['env-var', 'resend', 'email'] },
  { provider: 'mailgun', name: 'Mailgun API Key', pattern: /key-[a-f0-9]{32}|[a-f0-9]{32}-[a-f0-9]{8}-[a-f0-9]{8}/, dashboardUrl: 'https://app.mailgun.com/app/account/security/api_keys', tags: ['env-var', 'mailgun', 'email'] },
  { provider: 'mailchimp', name: 'Mailchimp API Key', pattern: /[a-f0-9]{32}-us[0-9]{1,2}/, dashboardUrl: 'https://admin.mailchimp.com/account/api/', tags: ['env-var', 'mailchimp', 'email'] },

  // Communication
  { provider: 'twilio-account-sid', name: 'Twilio Account SID', pattern: /AC[a-f0-9]{32}/, dashboardUrl: 'https://console.twilio.com/', tags: ['env-var', 'twilio', 'communications'] },
  { provider: 'slack-bot', name: 'Slack Bot Token', pattern: /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/, dashboardUrl: 'https://api.slack.com/apps', tags: ['env-var', 'slack', 'messaging'] },
  { provider: 'slack-user', name: 'Slack User Token', pattern: /xoxp-[0-9]+-[0-9]+-[0-9]+-[a-f0-9]+/, dashboardUrl: 'https://api.slack.com/apps', tags: ['env-var', 'slack', 'messaging'] },
  { provider: 'slack-webhook', name: 'Slack Webhook URL', pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9]+\/B[a-zA-Z0-9]+\/[a-zA-Z0-9]+/, dashboardUrl: 'https://api.slack.com/apps', tags: ['env-var', 'slack', 'messaging'] },
  { provider: 'discord-bot', name: 'Discord Bot Token', pattern: /[MN][a-zA-Z0-9_-]{23,}\.[a-zA-Z0-9_-]{6}\.[a-zA-Z0-9_-]{27,}/, dashboardUrl: 'https://discord.com/developers/applications', tags: ['env-var', 'discord', 'messaging'] },
  { provider: 'discord-webhook', name: 'Discord Webhook URL', pattern: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[a-zA-Z0-9_-]+/, dashboardUrl: 'https://discord.com/developers/applications', tags: ['env-var', 'discord', 'messaging'] },
  { provider: 'telegram', name: 'Telegram Bot Token', pattern: /[0-9]{9,10}:[a-zA-Z0-9_-]{35}/, dashboardUrl: 'https://t.me/BotFather', tags: ['env-var', 'telegram', 'messaging'] },

  // Analytics
  { provider: 'sentry', name: 'Sentry DSN', pattern: /https:\/\/[a-f0-9]{32}@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+/, dashboardUrl: 'https://sentry.io/settings/projects/', tags: ['env-var', 'sentry', 'monitoring'] },
  { provider: 'posthog', name: 'PostHog API Key', pattern: /phc_[a-zA-Z0-9]{32,}/, dashboardUrl: 'https://app.posthog.com/project/settings', tags: ['env-var', 'posthog', 'analytics'] },

  // Dev Tools
  { provider: 'linear', name: 'Linear API Key', pattern: /lin_api_[a-zA-Z0-9]{40}/, dashboardUrl: 'https://linear.app/settings/api', tags: ['env-var', 'linear', 'productivity'] },
  { provider: 'notion', name: 'Notion Integration Token', pattern: /secret_[a-zA-Z0-9]{43}|ntn_[a-zA-Z0-9]{43,}/, dashboardUrl: 'https://www.notion.so/my-integrations', tags: ['env-var', 'notion', 'productivity'] },
  { provider: 'airtable', name: 'Airtable API Key', pattern: /key[a-zA-Z0-9]{14}|pat[a-zA-Z0-9]{14}\.[a-f0-9]{64}/, dashboardUrl: 'https://airtable.com/account', tags: ['env-var', 'airtable', 'productivity'] },
  { provider: 'npm', name: 'NPM Access Token', pattern: /npm_[a-zA-Z0-9]{36}/, dashboardUrl: 'https://www.npmjs.com/settings/~/tokens', tags: ['env-var', 'npm', 'registry'] },
  { provider: 'docker', name: 'Docker Hub Token', pattern: /dckr_pat_[a-zA-Z0-9_-]{52}/, dashboardUrl: 'https://hub.docker.com/settings/security', tags: ['env-var', 'docker', 'registry'] },

  // E-commerce
  { provider: 'shopify-admin', name: 'Shopify Admin API Token', pattern: /shpat_[a-f0-9]{32}/, dashboardUrl: 'https://admin.shopify.com/store/', tags: ['env-var', 'shopify', 'ecommerce'] },
  { provider: 'shopify-storefront', name: 'Shopify Storefront Token', pattern: /shpss_[a-f0-9]{32}/, dashboardUrl: 'https://admin.shopify.com/store/', tags: ['env-var', 'shopify', 'ecommerce'] },

  // Maps
  { provider: 'mapbox', name: 'Mapbox Access Token', pattern: /pk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+|sk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, dashboardUrl: 'https://account.mapbox.com/access-tokens/', tags: ['env-var', 'mapbox', 'maps'] },

  // Media
  { provider: 'cloudinary', name: 'Cloudinary URL', pattern: /cloudinary:\/\/[0-9]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+/, dashboardUrl: 'https://console.cloudinary.com/settings/api-keys', tags: ['env-var', 'cloudinary', 'media'] },
  { provider: 'uploadthing', name: 'UploadThing Secret', pattern: /sk_live_[a-zA-Z0-9]{32,}/, dashboardUrl: 'https://uploadthing.com/dashboard', tags: ['env-var', 'uploadthing', 'media'] },

  // Context-dependent patterns (JWT, generic tokens)
  { provider: 'supabase-jwt', name: 'Supabase JWT Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api', tags: ['env-var', 'supabase', 'database'], contextRequired: true, contextPattern: /supabase/i },
  { provider: 'firebase-jwt', name: 'Firebase JWT', pattern: /eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, dashboardUrl: 'https://console.firebase.google.com/', tags: ['env-var', 'firebase', 'auth'], contextRequired: true, contextPattern: /firebase/i },
  { provider: 'generic-jwt', name: 'JWT Token', pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, dashboardUrl: null, tags: ['env-var', 'jwt'], contextRequired: true, contextPattern: /jwt|token|auth|api/i }
]

// DOM elements
const connectionStatus = document.getElementById('connection-status')
const statusDot = connectionStatus.querySelector('.status-dot')
const statusText = connectionStatus.querySelector('.status-text')

// Store for all secrets (for filtering)
let allSecrets = []
let hiddenSecretIds = new Set()
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

  // Filter secrets
  const secretsFilter = document.getElementById('secrets-filter')
  if (secretsFilter) {
    secretsFilter.addEventListener('input', (e) => {
      filterSecrets(e.target.value)
    })
  }

  // Restore hidden secrets
  const restoreHiddenBtn = document.getElementById('restore-hidden')
  if (restoreHiddenBtn) {
    restoreHiddenBtn.addEventListener('click', restoreAllHidden)
  }

  // Load hidden items from storage
  await loadHiddenItems()

  // Check connection and load data
  await checkConnection()
  await loadSettings()
  await loadSecrets()
}

/**
 * Load hidden item IDs from storage
 */
async function loadHiddenItems() {
  try {
    const data = await chrome.storage.local.get('hiddenSecretIds')
    if (data.hiddenSecretIds && Array.isArray(data.hiddenSecretIds)) {
      hiddenSecretIds = new Set(data.hiddenSecretIds)
    }
  } catch (error) {
    console.error('Failed to load hidden items:', error)
  }
}

/**
 * Save hidden item IDs to storage
 */
async function saveHiddenItems() {
  try {
    await chrome.storage.local.set({ hiddenSecretIds: [...hiddenSecretIds] })
  } catch (error) {
    console.error('Failed to save hidden items:', error)
  }
}

/**
 * Hide a secret from the list (local only, doesn't touch 1Password)
 */
async function hideSecret(secretId) {
  hiddenSecretIds.add(secretId)
  await saveHiddenItems()

  // Re-render with current filter
  const secretsFilter = document.getElementById('secrets-filter')
  const searchTerm = secretsFilter?.value || ''
  filterSecrets(searchTerm)

  showToast('Key hidden from list', 'success')
}

/**
 * Restore all hidden secrets
 */
async function restoreAllHidden() {
  const count = hiddenSecretIds.size
  hiddenSecretIds.clear()
  await saveHiddenItems()

  // Reload secrets to show all
  await loadSecrets()

  showToast(`Restored ${count} hidden key(s)`, 'success')
}

/**
 * Infer project name from URL
 */
function inferProjectFromUrl(url) {
  if (!url) return null

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    const pathname = urlObj.pathname

    // GitHub: github.com/owner/repo
    if (hostname === 'github.com') {
      const parts = pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return parts[1] // repo name
      }
    }

    // Vercel: vercel.com/team/project
    if (hostname === 'vercel.com') {
      const parts = pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return parts[1]
      }
    }

    // Cloudflare: dash.cloudflare.com/.../workers/...
    if (hostname === 'dash.cloudflare.com') {
      const match = pathname.match(/\/workers\/services\/view\/([^/]+)/)
      if (match) return match[1]
      const pagesMatch = pathname.match(/\/pages\/view\/([^/]+)/)
      if (pagesMatch) return pagesMatch[1]
    }

    // Supabase: supabase.com/dashboard/project/[project-id]
    if (hostname === 'supabase.com' || hostname.includes('supabase')) {
      const match = pathname.match(/\/project\/([^/]+)/)
      if (match) return match[1]
    }

    // Netlify: app.netlify.com/sites/[site-name]
    if (hostname === 'app.netlify.com') {
      const match = pathname.match(/\/sites\/([^/]+)/)
      if (match) return match[1]
    }

    // Generic: use subdomain or first path segment
    if (hostname.includes('.')) {
      const subdomain = hostname.split('.')[0]
      if (subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'dashboard') {
        return subdomain
      }
    }

    return null
  } catch {
    return null
  }
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
 * @param {string} text - Text to scan for API keys
 * @param {string} [context] - Optional context (e.g., page URL) for context-dependent patterns
 */
function detectApiKeys(text, context = '') {
  const detected = []

  for (const pattern of API_KEY_PATTERNS) {
    // Skip context-required patterns if context doesn't match
    if (pattern.contextRequired) {
      if (!context || !pattern.contextPattern.test(context)) {
        continue
      }
    }

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
 * Parse environment variable lines from text
 * Supports: KEY=value, KEY="value", KEY  value (tab-separated)
 */
function parseEnvVarPairs(text) {
  const pairs = []
  const seen = new Set()

  // Pattern 1: KEY=value or KEY="value" or KEY='value'
  const envPattern = /^([A-Z_][A-Z0-9_]*)\s*=\s*["']?([^"'\n\r]+?)["']?\s*$/gm

  // Pattern 2: Tab-separated (from HTML table copy)
  const tabPattern = /^([A-Z_][A-Z0-9_]*)\t+(\S+)$/gm

  let match
  while ((match = envPattern.exec(text)) !== null) {
    const envVarName = match[1]
    const value = match[2].trim()
    const key = `${envVarName}:${value}`

    if (value && !seen.has(key)) {
      seen.add(key)
      pairs.push({ envVarName, value })
    }
  }

  while ((match = tabPattern.exec(text)) !== null) {
    const envVarName = match[1]
    const value = match[2].trim()
    const key = `${envVarName}:${value}`

    if (value && !seen.has(key)) {
      seen.add(key)
      pairs.push({ envVarName, value })
    }
  }

  return pairs
}

/**
 * Check if a value looks like a secret (even without matching known patterns)
 */
function looksLikeSecret(value) {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()

  if (trimmed.length < 16 || trimmed.length > 500) {
    return false
  }

  if (/\s/.test(trimmed)) {
    return false
  }

  const secretIndicators = [
    // Starts with common API key prefixes
    /^(sk[-_]|pk[-_]|api[-_]|key[-_]|token[-_]|secret[-_]|auth[-_])/i,
    // Provider-specific prefixes (sb_ = Supabase, re_ = Resend, phc_ = PostHog, etc.)
    /^(sb_|re_|phc_|lin_api_|nfp_|rnd_|fo1_|dop_v1_|r8_|hf_|ghp_|gho_|ghs_|ghu_|glpat-|npm_|dckr_pat_|shpat_|shpss_|whsec_)/,
    // Contains mix of alphanumeric and special chars typical of tokens (min 24 chars)
    /^[a-zA-Z0-9_-]{24,}$/,
    // JWT format
    /^eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
    // Base64-like with significant length
    /^[A-Za-z0-9+/]{32,}={0,2}$/,
    // Hex strings of typical key lengths
    /^[a-fA-F0-9]{32,64}$/,
    // UUID format (common for API keys)
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    // Connection strings
    /^(mongodb\+srv|redis|rediss|postgres|postgresql):\/\//,
    // Webhook URLs
    /^https:\/\/hooks\.(slack|discord)/
  ]

  return secretIndicators.some(pattern => pattern.test(trimmed))
}

/**
 * Deduplicate detected keys by value
 */
function dedupeByValue(keys) {
  const seen = new Set()
  return keys.filter(key => {
    if (seen.has(key.value)) {
      return false
    }
    seen.add(key.value)
    return true
  })
}

/**
 * Check clipboard for API keys - reads directly in popup
 * Enhanced to parse KEY=value pairs and capture source URL
 */
async function checkClipboard() {
  checkClipboardBtn.disabled = true
  checkClipboardBtn.textContent = 'Checking...'

  try {
    // Read clipboard directly from popup (has permission)
    const text = await navigator.clipboard.readText()

    // Get current tab URL as source and infer project
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const sourceUrl = tab?.url || null
    const inferredProject = inferProjectFromUrl(sourceUrl)

    if (!text) {
      detectedKeys.innerHTML = '<div class="empty">Clipboard is empty</div>'
      return
    }

    // Parse KEY=value pairs first
    const envPairs = parseEnvVarPairs(text)

    // For each pair, validate the value against known patterns
    // Pass sourceUrl as context for context-dependent patterns (e.g., JWTs on Supabase pages)
    const detectedFromPairs = envPairs.map(pair => {
      const patternMatch = detectApiKeys(pair.value, sourceUrl)
      if (patternMatch.length > 0) {
        return {
          ...patternMatch[0],
          envVarName: pair.envVarName,
          sourceUrl,
          project: inferredProject
        }
      }
      // Even if no pattern match, include if it looks like a secret
      if (looksLikeSecret(pair.value)) {
        return {
          provider: 'unknown',
          name: pair.envVarName,
          value: pair.value,
          envVarName: pair.envVarName,
          sourceUrl,
          project: inferredProject,
          dashboardUrl: null,
          tags: ['env-var']
        }
      }
      return null
    }).filter(Boolean)

    // Also detect raw API keys not in KEY=value format
    // Pass sourceUrl as context for context-dependent patterns
    const rawDetected = detectApiKeys(text, sourceUrl).map(k => ({ ...k, sourceUrl, project: inferredProject }))

    // Dedupe and combine
    const allDetected = dedupeByValue([...detectedFromPairs, ...rawDetected])
    const realKeys = allDetected.filter(k => isLikelyRealKey(k.value))

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
 * Search for existing items that match a provider
 */
async function searchForExistingItems(provider, tags) {
  try {
    const response = await sendMessage({
      action: 'searchItems',
      tags: tags || ['env-var'],
      vault: defaultVault.value || undefined
    })

    if (response.success && response.data) {
      // Filter to items that might match this provider
      const providerLower = provider.toLowerCase()
      return response.data.filter(item => {
        const titleLower = item.title.toLowerCase()
        return titleLower.includes(providerLower) ||
          (item.tags || []).some(t => t.toLowerCase().includes(providerLower))
      })
    }
    return []
  } catch {
    return []
  }
}

/**
 * Render detected API keys
 */
async function renderDetectedKeys(keys) {
  // Store keys in a map for retrieval (avoids JSON in HTML attributes)
  const keyMap = new Map()
  const existingItemsMap = new Map()

  // Search for existing items for each unique provider
  const uniqueProviders = [...new Set(keys.map(k => k.provider))]
  for (const provider of uniqueProviders) {
    const key = keys.find(k => k.provider === provider)
    const existing = await searchForExistingItems(provider, key?.tags)
    if (existing.length > 0) {
      existingItemsMap.set(provider, existing)
    }
  }

  // Add "Save All" button if multiple keys
  const saveAllHtml = keys.length > 1 ? `
    <div class="save-all-container">
      <button class="btn btn-success save-all">Save All (${keys.length})</button>
    </div>
  ` : ''

  detectedKeys.innerHTML = saveAllHtml + keys.map((key, index) => {
    keyMap.set(index, key)
    const displayName = key.envVarName || key.name
    const subtitle = key.envVarName ? key.name : key.provider
    const existingItems = existingItemsMap.get(key.provider) || []

    // Build existing items dropdown if any
    let existingHtml = ''
    if (existingItems.length > 0) {
      existingHtml = `
        <div class="existing-items-dropdown">
          <button class="btn btn-secondary add-to-existing-toggle" title="Add to existing item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="existing-items-menu" style="display: none;">
            ${existingItems.map(item => `
              <button class="existing-item-option" data-item-id="${escapeHtml(item.id)}" data-item-title="${escapeHtml(item.title)}">
                Add to: ${escapeHtml(item.title)}
              </button>
            `).join('')}
          </div>
        </div>
      `
    }

    return `
    <div class="key-item" data-key-index="${index}">
      <div class="key-info">
        <div class="key-name">${escapeHtml(displayName)}</div>
        <div class="key-provider">${escapeHtml(subtitle)}</div>
        <div class="key-value">${maskValue(key.value)}</div>
      </div>
      <div class="key-actions">
        <button class="btn btn-success save-key">Save</button>
        ${existingHtml}
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

  // Add "Save All" handler
  const saveAllBtn = detectedKeys.querySelector('.save-all')
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', async () => {
      await saveAllKeys(keys, saveAllBtn)
    })
  }

  // Add existing items dropdown toggle handlers
  detectedKeys.querySelectorAll('.add-to-existing-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const menu = btn.nextElementSibling
      const isVisible = menu.style.display !== 'none'
      // Hide all other menus
      detectedKeys.querySelectorAll('.existing-items-menu').forEach(m => {
        m.style.display = 'none'
      })
      menu.style.display = isVisible ? 'none' : 'block'
    })
  })

  // Add existing item selection handlers
  detectedKeys.querySelectorAll('.existing-item-option').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation()
      const keyItem = e.target.closest('.key-item')
      const index = parseInt(keyItem.dataset.keyIndex, 10)
      const key = keyMap.get(index)
      const itemId = e.target.dataset.itemId
      const itemTitle = e.target.dataset.itemTitle

      if (key && itemId) {
        await addKeyToExistingItem(key, itemId, itemTitle, e.target)
      }
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    detectedKeys.querySelectorAll('.existing-items-menu').forEach(m => {
      m.style.display = 'none'
    })
  })
}

/**
 * Add a key to an existing 1Password item
 */
async function addKeyToExistingItem(key, itemId, itemTitle, button) {
  const originalText = button.textContent
  button.disabled = true
  button.textContent = 'Adding...'

  try {
    // Use the env var name as field name, or default to 'api_token'
    const fieldName = key.envVarName || 'api_token'

    const response = await sendMessage({
      action: 'addToExistingItem',
      itemId,
      fieldName,
      fieldValue: key.value,
      vault: defaultVault.value || undefined
    })

    if (response.success) {
      button.textContent = 'Added!'
      showToast(`Added to ${itemTitle}`, 'success')
      // Hide the dropdown
      const menu = button.closest('.existing-items-menu')
      if (menu) {
        menu.style.display = 'none'
      }
      await loadSecrets()
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    button.disabled = false
    button.textContent = originalText
    showToast(error.message, 'error')
  }
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
      detected: {
        ...key,
        envVarName: key.envVarName,
        sourceUrl: key.sourceUrl,
        project: key.project
      },
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
 * Save all detected keys to 1Password with progress UI
 */
async function saveAllKeys(keys, button) {
  const batchContainer = document.getElementById('batch-container')
  const batchStatus = document.getElementById('batch-status')
  const progressBar = document.getElementById('batch-progress')
  const batchResults = document.getElementById('batch-results')

  // Show batch UI
  batchContainer.style.display = 'block'
  button.disabled = true
  button.textContent = 'Saving...'

  // Reset progress
  progressBar.style.width = '0%'
  progressBar.classList.remove('complete', 'error')
  batchStatus.classList.remove('complete', 'error')
  batchStatus.classList.add('active')
  batchResults.innerHTML = ''

  const results = []
  let saved = 0
  let failed = 0

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const displayName = key.envVarName || key.name

    batchStatus.textContent = `Saving ${i + 1}/${keys.length}: ${displayName}`

    try {
      const response = await sendMessage({
        action: 'saveDetected',
        detected: {
          ...key,
          envVarName: key.envVarName,
          sourceUrl: key.sourceUrl,
          project: key.project
        },
        vault: defaultVault.value || undefined
      })

      if (response.success) {
        saved++
        results.push({ success: true, name: displayName })
      } else {
        failed++
        results.push({ success: false, name: displayName, error: response.error })
      }
    } catch (error) {
      failed++
      results.push({ success: false, name: displayName, error: error.message })
    }

    // Update progress bar
    const progress = ((i + 1) / keys.length) * 100
    progressBar.style.width = `${progress}%`
  }

  // Update final status
  batchStatus.classList.remove('active')
  if (failed === 0) {
    batchStatus.classList.add('complete')
    batchStatus.textContent = `Saved ${saved} keys successfully`
    progressBar.classList.add('complete')
  } else if (saved === 0) {
    batchStatus.classList.add('error')
    batchStatus.textContent = `Failed to save all ${failed} keys`
    progressBar.classList.add('error')
  } else {
    batchStatus.textContent = `Saved ${saved}/${keys.length} (${failed} failed)`
  }

  // Show results summary
  batchResults.innerHTML = results.map(r => `
    <div class="result-item ${r.success ? 'result-success' : 'result-error'}">
      <span>${r.success ? '✓' : '✗'}</span>
      <span>${escapeHtml(r.name)}</span>
      ${r.error ? `<span class="result-error-msg">- ${escapeHtml(r.error)}</span>` : ''}
    </div>
  `).join('')

  button.textContent = `Saved ${saved}/${keys.length}`
  button.classList.remove('btn-success')
  button.classList.add('btn-secondary')

  if (failed > 0) {
    showToast(`Saved ${saved}, failed ${failed}`, 'error')
  } else {
    showToast(`Saved ${saved} keys to 1Password`, 'success')
  }

  await loadSecrets()
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
      allSecrets = response.data || []

      // Filter out hidden items for display
      const visible = allSecrets.filter(secret => !hiddenSecretIds.has(secret.id))
      updateSecretsCount(visible.length)
      updateHiddenCount()
      renderSecrets(visible)

      // Clear filter
      const secretsFilter = document.getElementById('secrets-filter')
      if (secretsFilter) {
        secretsFilter.value = ''
      }
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    secretsList.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`
  }
}

/**
 * Update the secrets count badge
 */
function updateSecretsCount(count) {
  const countBadge = document.getElementById('secrets-count')
  if (countBadge) {
    countBadge.textContent = count
  }
}

/**
 * Filter secrets by search term (also excludes hidden items)
 */
function filterSecrets(searchTerm) {
  // First filter out hidden items
  const visible = allSecrets.filter(secret => !hiddenSecretIds.has(secret.id))

  if (!searchTerm || !searchTerm.trim()) {
    renderSecrets(visible)
    updateSecretsCount(visible.length)
    updateHiddenCount()
    return
  }

  const term = searchTerm.toLowerCase().trim()
  const filtered = visible.filter(secret => {
    return (
      secret.title?.toLowerCase().includes(term) ||
      secret.vault?.toLowerCase().includes(term) ||
      secret.category?.toLowerCase().includes(term)
    )
  })

  renderSecrets(filtered)
  updateSecretsCount(filtered.length)
  updateHiddenCount()
}

/**
 * Update the hidden count display
 */
function updateHiddenCount() {
  const hiddenCount = document.getElementById('hidden-count')
  const restoreBtn = document.getElementById('restore-hidden')

  if (hiddenCount && restoreBtn) {
    const count = hiddenSecretIds.size
    if (count > 0) {
      hiddenCount.textContent = `${count} hidden`
      hiddenCount.style.display = 'inline'
      restoreBtn.style.display = 'inline-flex'
    } else {
      hiddenCount.style.display = 'none'
      restoreBtn.style.display = 'none'
    }
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

  // Store secrets in a map for source URL retrieval
  const secretMap = new Map()

  secretsList.innerHTML = secrets.map((secret, index) => {
    secretMap.set(index, secret)
    return `
    <div class="key-item" data-id="${escapeHtml(secret.id)}" data-secret-index="${index}">
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
        <button class="btn btn-secondary visit-source" data-id="${escapeHtml(secret.id)}" title="Visit source page">
          Visit
        </button>
        <button class="btn btn-icon-only hide-key" data-id="${escapeHtml(secret.id)}" title="Hide from list">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </button>
      </div>
    </div>
  `}).join('')

  // Add copy handlers
  secretsList.querySelectorAll('.copy-key').forEach(btn => {
    btn.addEventListener('click', () => copySecret(btn.dataset.reference, btn))
  })

  // Add fill handlers
  secretsList.querySelectorAll('.fill-key').forEach(btn => {
    btn.addEventListener('click', () => fillSecret(btn.dataset.reference))
  })

  // Add visit source handlers
  secretsList.querySelectorAll('.visit-source').forEach(btn => {
    btn.addEventListener('click', () => visitSource(btn.dataset.id, btn))
  })

  // Add hide handlers
  secretsList.querySelectorAll('.hide-key').forEach(btn => {
    btn.addEventListener('click', () => hideSecret(btn.dataset.id))
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
 * Visit the source URL where a key was originally copied from
 */
async function visitSource(itemId, button) {
  button.disabled = true

  try {
    // Get item details from 1Password to retrieve source_url field
    const response = await sendMessage({
      action: 'getItem',
      itemId,
      vault: defaultVault.value || undefined
    })

    if (response.success && response.data) {
      // Look for source_url field in item
      const fields = response.data.fields || []
      const sourceUrlField = fields.find(f => f.label === 'source_url' || f.id === 'source_url')
      const dashboardUrlField = fields.find(f => f.label === 'dashboard_url' || f.id === 'dashboard_url')

      const url = sourceUrlField?.value || dashboardUrlField?.value

      if (url) {
        // Validate URL before opening
        try {
          const parsedUrl = new URL(url)
          if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            showToast('Invalid URL protocol', 'error')
            return
          }
          chrome.tabs.create({ url: parsedUrl.href })
          window.close()
        } catch {
          showToast('Invalid source URL format', 'error')
        }
      } else {
        showToast('No source URL saved for this key', 'error')
      }
    } else {
      throw new Error(response.error || 'Failed to get item details')
    }
  } catch (error) {
    showToast(error.message, 'error')
  } finally {
    button.disabled = false
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
