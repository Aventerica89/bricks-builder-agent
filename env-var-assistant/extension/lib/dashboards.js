/**
 * Dashboard configurations for auto-fill
 * Maps provider dashboards to their env var input selectors
 */
export const DASHBOARDS = {
  cloudflare: {
    name: 'Cloudflare',
    patterns: [
      /dash\.cloudflare\.com\/[^/]+\/workers\/services\/[^/]+\/settings/,
      /dash\.cloudflare\.com\/[^/]+\/pages\/view\/[^/]+\/settings\/environment-variables/
    ],
    selectors: {
      // Workers secrets
      workersSecrets: {
        addButton: '[data-testid="add-variable-button"], button:has-text("Add variable")',
        nameInput: 'input[name="name"], input[placeholder*="Variable name"]',
        valueInput: 'input[name="value"], textarea[placeholder*="Value"]',
        saveButton: 'button[type="submit"], button:has-text("Save")'
      },
      // Pages env vars
      pagesEnvVars: {
        addButton: 'button:has-text("Add variable")',
        nameInput: 'input[name="name"]',
        valueInput: 'input[name="value"]',
        environmentSelect: 'select[name="environment"]',
        saveButton: 'button[type="submit"]'
      }
    }
  },

  vercel: {
    name: 'Vercel',
    patterns: [
      /vercel\.com\/[^/]+\/[^/]+\/settings\/environment-variables/
    ],
    selectors: {
      addButton: 'button:has-text("Add New")',
      nameInput: 'input[name="key"]',
      valueInput: 'input[name="value"], textarea[name="value"]',
      environmentCheckboxes: {
        production: 'input[type="checkbox"][value="production"]',
        preview: 'input[type="checkbox"][value="preview"]',
        development: 'input[type="checkbox"][value="development"]'
      },
      saveButton: 'button[type="submit"]:has-text("Save")'
    }
  },

  netlify: {
    name: 'Netlify',
    patterns: [
      /app\.netlify\.com\/sites\/[^/]+\/configuration\/env/
    ],
    selectors: {
      addButton: 'button:has-text("Add a variable")',
      nameInput: 'input[name="key"]',
      valueInput: 'textarea[name="value"]',
      saveButton: 'button[type="submit"]:has-text("Create variable")'
    }
  },

  openai: {
    name: 'OpenAI',
    patterns: [
      /platform\.openai\.com\/api-keys/,
      /platform\.openai\.com\/settings/
    ],
    // OpenAI doesn't have env var inputs - it's read-only
    // We just detect keys here when user copies them
    readOnly: true,
    selectors: {
      keyDisplay: '[data-testid="api-key"]',
      copyButton: 'button:has-text("Copy")'
    }
  },

  supabase: {
    name: 'Supabase',
    patterns: [
      /supabase\.com\/dashboard\/project\/[^/]+\/settings\/api/,
      /[^.]+\.supabase\.co/
    ],
    // Supabase API page is mostly read-only
    readOnly: true,
    selectors: {
      anonKey: '[data-testid="anon-key"]',
      serviceKey: '[data-testid="service-key"]'
    }
  },

  github: {
    name: 'GitHub',
    patterns: [
      /github\.com\/[^/]+\/[^/]+\/settings\/secrets\/actions/
    ],
    selectors: {
      addButton: 'a:has-text("New repository secret")',
      nameInput: 'input#secret_name',
      valueInput: 'textarea#secret_value',
      saveButton: 'button:has-text("Add secret")'
    }
  }
}

/**
 * Find matching dashboard config for a URL
 * @param {string} url - Current page URL
 * @returns {Object|null} Dashboard config or null
 */
export function findDashboard(url) {
  for (const [key, config] of Object.entries(DASHBOARDS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(url)) {
        return { id: key, ...config }
      }
    }
  }
  return null
}

/**
 * Get the appropriate env var name for a provider
 * @param {string} provider - Provider ID (e.g., 'openai')
 * @returns {string} Suggested env var name
 */
export function suggestEnvVarName(provider) {
  const suggestions = {
    openai: 'OPENAI_API_KEY',
    'openai-project': 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    'github-pat': 'GITHUB_TOKEN',
    'github-pat-fine': 'GITHUB_TOKEN',
    'aws-access-key': 'AWS_ACCESS_KEY_ID',
    'stripe-live': 'STRIPE_SECRET_KEY',
    'stripe-test': 'STRIPE_SECRET_KEY',
    vercel: 'VERCEL_TOKEN',
    'cloudflare-api': 'CLOUDFLARE_API_TOKEN',
    'supabase-anon': 'SUPABASE_ANON_KEY',
    sendgrid: 'SENDGRID_API_KEY',
    'twilio-account-sid': 'TWILIO_ACCOUNT_SID',
    'twilio-auth-token': 'TWILIO_AUTH_TOKEN',
    'slack-bot': 'SLACK_BOT_TOKEN',
    'slack-user': 'SLACK_USER_TOKEN'
  }

  return suggestions[provider] || 'API_KEY'
}
