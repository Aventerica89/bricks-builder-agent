/**
 * Unit tests for API key pattern detection
 * Uses Node.js built-in test runner (Node 18+)
 */

import { test, describe } from 'node:test'
import assert from 'node:assert'

// Import patterns - we need to recreate them here since extension uses ES modules
// In a real setup, we'd share this via a common module
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

// Test data - fake keys that match the patterns
const TEST_KEYS = {
  openai: 'sk-' + 'a'.repeat(48),
  openaiProject: 'sk-proj-' + 'a'.repeat(80),
  anthropic: 'sk-ant-' + 'a'.repeat(95),
  githubPat: 'ghp_' + 'a'.repeat(36),
  githubPatFine: 'github_pat_' + 'a'.repeat(82),
  awsAccessKey: 'AKIA' + 'A'.repeat(16),
  stripeLive: 'sk_live_' + 'a'.repeat(24),
  stripeTest: 'sk_test_' + 'a'.repeat(24),
  sendgrid: 'SG.' + 'a'.repeat(22) + '.' + 'a'.repeat(43),
  twilioSid: 'AC' + 'a'.repeat(32),
  slackBot: 'xoxb-111111111-222222222-abcdefghij',
  slackUser: 'xoxp-111111111-222222222-333333333-' + 'a'.repeat(16)
}

describe('API Key Pattern Detection', () => {
  test('detects OpenAI API key', () => {
    const result = detectApiKeys(`Here is my key: ${TEST_KEYS.openai}`)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'openai')
    assert.strictEqual(result[0].value, TEST_KEYS.openai)
  })

  test('detects OpenAI Project key', () => {
    const result = detectApiKeys(`Key: ${TEST_KEYS.openaiProject}`)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'openai-project')
  })

  test('detects Anthropic API key', () => {
    const result = detectApiKeys(`ANTHROPIC_API_KEY=${TEST_KEYS.anthropic}`)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'anthropic')
  })

  test('detects GitHub PAT', () => {
    const result = detectApiKeys(`export GITHUB_TOKEN=${TEST_KEYS.githubPat}`)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'github-pat')
  })

  test('detects GitHub fine-grained PAT', () => {
    const result = detectApiKeys(TEST_KEYS.githubPatFine)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'github-pat-fine')
  })

  test('detects AWS Access Key ID', () => {
    const result = detectApiKeys(`AWS_ACCESS_KEY_ID=${TEST_KEYS.awsAccessKey}`)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'aws-access-key')
  })

  test('detects Stripe live key', () => {
    const result = detectApiKeys(TEST_KEYS.stripeLive)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'stripe-live')
  })

  test('detects Stripe test key', () => {
    const result = detectApiKeys(TEST_KEYS.stripeTest)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'stripe-test')
  })

  test('detects SendGrid API key', () => {
    const result = detectApiKeys(TEST_KEYS.sendgrid)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'sendgrid')
  })

  test('detects Twilio Account SID', () => {
    const result = detectApiKeys(TEST_KEYS.twilioSid)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'twilio-account-sid')
  })

  test('detects Slack bot token', () => {
    const result = detectApiKeys(TEST_KEYS.slackBot)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'slack-bot')
  })

  test('detects Slack user token', () => {
    const result = detectApiKeys(TEST_KEYS.slackUser)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'slack-user')
  })

  test('returns empty array for no matches', () => {
    const result = detectApiKeys('Hello world, no keys here')
    assert.strictEqual(result.length, 0)
  })

  test('detects multiple keys in same text', () => {
    const text = `
      OPENAI_KEY=${TEST_KEYS.openai}
      GITHUB_TOKEN=${TEST_KEYS.githubPat}
    `
    const result = detectApiKeys(text)
    assert.strictEqual(result.length, 2)
    const providers = result.map(r => r.provider)
    assert.ok(providers.includes('openai'))
    assert.ok(providers.includes('github-pat'))
  })

  test('includes correct metadata', () => {
    const result = detectApiKeys(TEST_KEYS.openai)
    assert.strictEqual(result[0].name, 'OpenAI API Key')
    assert.strictEqual(result[0].dashboardUrl, 'https://platform.openai.com/api-keys')
    assert.deepStrictEqual(result[0].tags, ['env-var', 'openai', 'ai'])
  })
})

describe('Placeholder Detection', () => {
  test('rejects "sk-xxx" placeholder', () => {
    assert.strictEqual(isLikelyRealKey('sk-xxx'), false)
    assert.strictEqual(isLikelyRealKey('sk-xxxx'), false)
    assert.strictEqual(isLikelyRealKey('sk-xxxxxxxx'), false)
  })

  test('rejects "your_api_key" placeholder', () => {
    assert.strictEqual(isLikelyRealKey('your_api_key'), false)
    assert.strictEqual(isLikelyRealKey('your-api-key'), false)
    assert.strictEqual(isLikelyRealKey('YOUR_API_KEY'), false)
  })

  test('rejects common placeholder words', () => {
    assert.strictEqual(isLikelyRealKey('test'), false)
    assert.strictEqual(isLikelyRealKey('demo'), false)
    assert.strictEqual(isLikelyRealKey('example'), false)
    assert.strictEqual(isLikelyRealKey('TODO'), false)
    assert.strictEqual(isLikelyRealKey('insert_here'), false)
    assert.strictEqual(isLikelyRealKey('replace_me'), false)
  })

  test('accepts realistic-looking keys', () => {
    assert.strictEqual(isLikelyRealKey(TEST_KEYS.openai), true)
    assert.strictEqual(isLikelyRealKey(TEST_KEYS.githubPat), true)
    assert.strictEqual(isLikelyRealKey(TEST_KEYS.stripeLive), true)
  })
})

describe('Pattern Specificity', () => {
  test('does not match too-short OpenAI keys', () => {
    const result = detectApiKeys('sk-' + 'a'.repeat(20)) // Too short
    assert.strictEqual(result.length, 0)
  })

  test('does not match invalid GitHub PAT prefix', () => {
    const result = detectApiKeys('ghx_' + 'a'.repeat(36)) // Wrong prefix
    assert.strictEqual(result.length, 0)
  })

  test('does not match invalid AWS key prefix', () => {
    const result = detectApiKeys('AKIB' + 'A'.repeat(16)) // Wrong prefix
    assert.strictEqual(result.length, 0)
  })

  test('matches keys embedded in JSON', () => {
    const json = `{"apiKey": "${TEST_KEYS.openai}"}`
    const result = detectApiKeys(json)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].provider, 'openai')
  })

  test('matches keys in .env format', () => {
    const envContent = `
      # API Keys
      OPENAI_API_KEY=${TEST_KEYS.openai}
      STRIPE_SECRET_KEY=${TEST_KEYS.stripeLive}
    `
    const result = detectApiKeys(envContent)
    assert.strictEqual(result.length, 2)
  })
})

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
 * Check if a value looks like a secret
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

describe('Multi-Key Parsing - parseEnvVarPairs', () => {
  test('parses single KEY=value pair', () => {
    const result = parseEnvVarPairs('OPENAI_API_KEY=sk-test123456')
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].envVarName, 'OPENAI_API_KEY')
    assert.strictEqual(result[0].value, 'sk-test123456')
  })

  test('parses multiple KEY=value pairs', () => {
    const text = `SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service`

    const result = parseEnvVarPairs(text)
    assert.strictEqual(result.length, 3)
    assert.strictEqual(result[0].envVarName, 'SUPABASE_URL')
    assert.strictEqual(result[1].envVarName, 'SUPABASE_ANON_KEY')
    assert.strictEqual(result[2].envVarName, 'SUPABASE_SERVICE_ROLE_KEY')
  })

  test('parses quoted values', () => {
    const text = `DATABASE_URL="postgres://user:pass@localhost/db"
API_KEY='sk-secret123'`

    const result = parseEnvVarPairs(text)
    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[0].value, 'postgres://user:pass@localhost/db')
    assert.strictEqual(result[1].value, 'sk-secret123')
  })

  test('handles spaces around equals sign', () => {
    const result = parseEnvVarPairs('API_KEY = test-value-123')
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].envVarName, 'API_KEY')
    assert.strictEqual(result[0].value, 'test-value-123')
  })

  test('parses tab-separated format (HTML table copy)', () => {
    const text = `STRIPE_KEY\tsk_live_abcdef123456
STRIPE_WEBHOOK\twhsec_xyz789`

    const result = parseEnvVarPairs(text)
    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[0].envVarName, 'STRIPE_KEY')
    assert.strictEqual(result[0].value, 'sk_live_abcdef123456')
    assert.strictEqual(result[1].envVarName, 'STRIPE_WEBHOOK')
    assert.strictEqual(result[1].value, 'whsec_xyz789')
  })

  test('ignores comments and empty lines', () => {
    const text = `# This is a comment
VALID_KEY=value123

# Another comment
ANOTHER_KEY=value456`

    const result = parseEnvVarPairs(text)
    assert.strictEqual(result.length, 2)
  })

  test('deduplicates identical entries', () => {
    const text = `API_KEY=same-value
API_KEY=same-value`

    const result = parseEnvVarPairs(text)
    assert.strictEqual(result.length, 1)
  })

  test('returns empty array for text without key-value pairs', () => {
    const result = parseEnvVarPairs('Hello world, no env vars here')
    assert.strictEqual(result.length, 0)
  })
})

describe('Secret Detection - looksLikeSecret', () => {
  test('detects values starting with common prefixes', () => {
    assert.strictEqual(looksLikeSecret('sk_test_abcdef123456789012345'), true)
    assert.strictEqual(looksLikeSecret('pk_live_abcdef123456789012345'), true)
    assert.strictEqual(looksLikeSecret('api_key_abcdef123456789012345'), true)
    assert.strictEqual(looksLikeSecret('token_abcdef123456789012345'), true)
    assert.strictEqual(looksLikeSecret('secret_abcdef123456789012345'), true)
  })

  test('detects provider-specific prefixes', () => {
    assert.strictEqual(looksLikeSecret('sb_publishable_A37HZZxM5RkwKz76m1h0pw_Yji7L'), true) // Supabase
    assert.strictEqual(looksLikeSecret('re_abcdefghij1234567890abcdefghij12'), true) // Resend
    assert.strictEqual(looksLikeSecret('phc_abcdefghij1234567890abcdefghij12'), true) // PostHog
    assert.strictEqual(looksLikeSecret('lin_api_abcdefghij1234567890abcdefghij12345678'), true) // Linear
    assert.strictEqual(looksLikeSecret('whsec_abcdefghij1234567890abcdefghij12'), true) // Stripe webhook
  })

  test('detects long alphanumeric strings (24+ chars)', () => {
    assert.strictEqual(looksLikeSecret('abc123def456ghi789jkl012mno345pq'), true) // 32 chars
    assert.strictEqual(looksLikeSecret('abc123def456ghi789jkl012'), true) // 24 chars - now passes
    assert.strictEqual(looksLikeSecret('abc123def456ghi789jkl0'), false) // 22 chars - too short
  })

  test('detects JWT tokens', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
    assert.strictEqual(looksLikeSecret(jwt), true)
  })

  test('detects hex strings of typical key lengths', () => {
    assert.strictEqual(looksLikeSecret('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'), true) // 32 hex chars
    assert.strictEqual(looksLikeSecret('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'), true) // 64 hex chars
  })

  test('rejects short values', () => {
    assert.strictEqual(looksLikeSecret('short'), false)
    assert.strictEqual(looksLikeSecret('a'.repeat(15)), false)
  })

  test('rejects values with spaces', () => {
    assert.strictEqual(looksLikeSecret('this has spaces in it'), false)
  })

  test('rejects null/undefined/non-string values', () => {
    assert.strictEqual(looksLikeSecret(null), false)
    assert.strictEqual(looksLikeSecret(undefined), false)
    assert.strictEqual(looksLikeSecret(12345), false)
  })

  test('rejects common non-secret strings', () => {
    assert.strictEqual(looksLikeSecret('localhost'), false)
    assert.strictEqual(looksLikeSecret('development'), false)
  })
})

describe('Deduplication - dedupeByValue', () => {
  test('removes duplicate values', () => {
    const keys = [
      { provider: 'openai', value: 'sk-abc123' },
      { provider: 'openai', value: 'sk-abc123' },
      { provider: 'anthropic', value: 'sk-ant-xyz' }
    ]
    const result = dedupeByValue(keys)
    assert.strictEqual(result.length, 2)
  })

  test('preserves first occurrence', () => {
    const keys = [
      { provider: 'openai', name: 'First', value: 'same-value' },
      { provider: 'openai', name: 'Second', value: 'same-value' }
    ]
    const result = dedupeByValue(keys)
    assert.strictEqual(result[0].name, 'First')
  })

  test('handles empty array', () => {
    const result = dedupeByValue([])
    assert.strictEqual(result.length, 0)
  })
})
