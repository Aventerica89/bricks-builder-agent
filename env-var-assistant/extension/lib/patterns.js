/**
 * API key detection patterns
 * Each pattern includes regex, provider name, and dashboard URL
 */
export const API_KEY_PATTERNS = [
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
    provider: 'vercel',
    name: 'Vercel Token',
    pattern: /[a-zA-Z0-9]{24}/,
    // Vercel tokens are generic - only match in context
    contextRequired: true,
    dashboardUrl: 'https://vercel.com/account/tokens',
    tags: ['env-var', 'vercel', 'hosting']
  },
  {
    provider: 'cloudflare-api',
    name: 'Cloudflare API Token',
    pattern: /[a-zA-Z0-9_-]{40}/,
    // Cloudflare tokens are generic - only match in context
    contextRequired: true,
    dashboardUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    tags: ['env-var', 'cloudflare', 'cdn']
  },
  {
    provider: 'supabase-anon',
    name: 'Supabase Anon Key',
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
    // JWT format - context dependent
    contextRequired: true,
    dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    tags: ['env-var', 'supabase', 'database']
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
    provider: 'twilio-auth-token',
    name: 'Twilio Auth Token',
    pattern: /[a-f0-9]{32}/,
    contextRequired: true,
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

/**
 * Detect API keys in text
 * @param {string} text - Text to scan for API keys
 * @param {string} [context] - Optional context (e.g., page URL) for context-dependent patterns
 * @returns {Array<{provider: string, name: string, value: string, dashboardUrl: string, tags: string[]}>}
 */
export function detectApiKeys(text, context = '') {
  const detected = []

  for (const pattern of API_KEY_PATTERNS) {
    // Skip context-required patterns if no relevant context
    if (pattern.contextRequired && !isRelevantContext(pattern.provider, context)) {
      continue
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
 * Check if context is relevant for a provider
 */
function isRelevantContext(provider, context) {
  const contextPatterns = {
    vercel: /vercel/i,
    'cloudflare-api': /cloudflare/i,
    'supabase-anon': /supabase/i,
    'twilio-auth-token': /twilio/i
  }

  const pattern = contextPatterns[provider]
  return pattern ? pattern.test(context) : true
}

/**
 * Validate that a detected key is likely real (not a placeholder)
 */
export function isLikelyRealKey(value) {
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
