/**
 * API key detection patterns
 * Each pattern includes regex, provider name, and dashboard URL
 */
export const API_KEY_PATTERNS = [
  // ===================
  // AI / ML Providers
  // ===================
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
    pattern: /sk-ant-[a-zA-Z0-9_-]{90,}/,
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
    tags: ['env-var', 'anthropic', 'ai']
  },
  {
    provider: 'google-ai',
    name: 'Google AI API Key',
    pattern: /AIza[a-zA-Z0-9_-]{35}/,
    dashboardUrl: 'https://aistudio.google.com/app/apikey',
    tags: ['env-var', 'google', 'ai']
  },
  {
    provider: 'cohere',
    name: 'Cohere API Key',
    pattern: /[a-zA-Z0-9]{40}/,
    contextRequired: true,
    dashboardUrl: 'https://dashboard.cohere.com/api-keys',
    tags: ['env-var', 'cohere', 'ai']
  },
  {
    provider: 'replicate',
    name: 'Replicate API Token',
    pattern: /r8_[a-zA-Z0-9]{37}/,
    dashboardUrl: 'https://replicate.com/account/api-tokens',
    tags: ['env-var', 'replicate', 'ai']
  },
  {
    provider: 'huggingface',
    name: 'Hugging Face Token',
    pattern: /hf_[a-zA-Z0-9]{34}/,
    dashboardUrl: 'https://huggingface.co/settings/tokens',
    tags: ['env-var', 'huggingface', 'ai']
  },

  // ===================
  // Version Control
  // ===================
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
    provider: 'github-oauth',
    name: 'GitHub OAuth Token',
    pattern: /gho_[a-zA-Z0-9]{36}/,
    dashboardUrl: 'https://github.com/settings/developers',
    tags: ['env-var', 'github', 'vcs']
  },
  {
    provider: 'github-app',
    name: 'GitHub App Token',
    pattern: /ghu_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}/,
    dashboardUrl: 'https://github.com/settings/apps',
    tags: ['env-var', 'github', 'vcs']
  },
  {
    provider: 'gitlab-pat',
    name: 'GitLab Personal Access Token',
    pattern: /glpat-[a-zA-Z0-9_-]{20}/,
    dashboardUrl: 'https://gitlab.com/-/profile/personal_access_tokens',
    tags: ['env-var', 'gitlab', 'vcs']
  },
  {
    provider: 'bitbucket',
    name: 'Bitbucket App Password',
    pattern: /ATBB[a-zA-Z0-9]{32}/,
    dashboardUrl: 'https://bitbucket.org/account/settings/app-passwords/',
    tags: ['env-var', 'bitbucket', 'vcs']
  },

  // ===================
  // Cloud Providers
  // ===================
  {
    provider: 'aws-access-key',
    name: 'AWS Access Key ID',
    pattern: /AKIA[0-9A-Z]{16}/,
    dashboardUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials',
    tags: ['env-var', 'aws', 'cloud']
  },
  {
    provider: 'aws-secret-key',
    name: 'AWS Secret Access Key',
    pattern: /[a-zA-Z0-9+/]{40}/,
    contextRequired: true,
    dashboardUrl: 'https://console.aws.amazon.com/iam/home#/security_credentials',
    tags: ['env-var', 'aws', 'cloud']
  },
  {
    provider: 'vercel',
    name: 'Vercel Token',
    pattern: /[a-zA-Z0-9]{24}/,
    contextRequired: true,
    dashboardUrl: 'https://vercel.com/account/tokens',
    tags: ['env-var', 'vercel', 'hosting']
  },
  {
    provider: 'netlify',
    name: 'Netlify Personal Access Token',
    pattern: /nfp_[a-zA-Z0-9]{40}/,
    dashboardUrl: 'https://app.netlify.com/user/applications#personal-access-tokens',
    tags: ['env-var', 'netlify', 'hosting']
  },
  {
    provider: 'railway',
    name: 'Railway API Token',
    pattern: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/,
    contextRequired: true,
    dashboardUrl: 'https://railway.app/account/tokens',
    tags: ['env-var', 'railway', 'hosting']
  },
  {
    provider: 'render',
    name: 'Render API Key',
    pattern: /rnd_[a-zA-Z0-9]{32}/,
    dashboardUrl: 'https://dashboard.render.com/u/settings#api-keys',
    tags: ['env-var', 'render', 'hosting']
  },
  {
    provider: 'fly',
    name: 'Fly.io API Token',
    pattern: /fo1_[a-zA-Z0-9_-]{43}/,
    dashboardUrl: 'https://fly.io/user/personal_access_tokens',
    tags: ['env-var', 'fly', 'hosting']
  },
  {
    provider: 'digitalocean',
    name: 'DigitalOcean Token',
    pattern: /dop_v1_[a-f0-9]{64}/,
    dashboardUrl: 'https://cloud.digitalocean.com/account/api/tokens',
    tags: ['env-var', 'digitalocean', 'cloud']
  },
  {
    provider: 'cloudflare-api',
    name: 'Cloudflare API Token',
    // Cloudflare tokens are 40 chars with letters, numbers, underscores, hyphens
    // They typically have a mix of upper/lower case and special chars like: QcfiZLl_q9L_-sKFcoPZCNbkqBL3axC-zMaicrOo
    pattern: /[A-Za-z][A-Za-z0-9_-]{38}[A-Za-z0-9]/,
    dashboardUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    tags: ['env-var', 'cloudflare', 'cdn']
  },

  // ===================
  // Database / Backend
  // ===================
  {
    provider: 'supabase-publishable',
    name: 'Supabase Publishable Key',
    pattern: /sb_publishable_[a-zA-Z0-9_-]{20,}/,
    dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    tags: ['env-var', 'supabase', 'database']
  },
  {
    provider: 'supabase-secret',
    name: 'Supabase Secret Key',
    pattern: /sb_secret_[a-zA-Z0-9_-]{20,}/,
    dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    tags: ['env-var', 'supabase', 'database']
  },
  {
    provider: 'supabase-anon',
    name: 'Supabase Anon Key (JWT)',
    pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
    contextRequired: true,
    dashboardUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    tags: ['env-var', 'supabase', 'database']
  },
  {
    provider: 'planetscale',
    name: 'PlanetScale Password',
    pattern: /pscale_pw_[a-zA-Z0-9_-]{43}/,
    dashboardUrl: 'https://app.planetscale.com/',
    tags: ['env-var', 'planetscale', 'database']
  },
  {
    provider: 'neon',
    name: 'Neon API Key',
    pattern: /neon_[a-zA-Z0-9_-]{32,}/,
    dashboardUrl: 'https://console.neon.tech/app/settings/api-keys',
    tags: ['env-var', 'neon', 'database']
  },
  {
    provider: 'turso',
    name: 'Turso Auth Token',
    pattern: /[a-zA-Z0-9_-]{100,}/,
    contextRequired: true,
    dashboardUrl: 'https://turso.tech/app',
    tags: ['env-var', 'turso', 'database']
  },
  {
    provider: 'mongodb',
    name: 'MongoDB Connection String',
    pattern: /mongodb\+srv:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_.-]+/,
    dashboardUrl: 'https://cloud.mongodb.com/',
    tags: ['env-var', 'mongodb', 'database']
  },
  {
    provider: 'redis',
    name: 'Redis/Upstash URL',
    pattern: /rediss?:\/\/[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_.-]+/,
    dashboardUrl: 'https://console.upstash.com/',
    tags: ['env-var', 'redis', 'database']
  },
  {
    provider: 'firebase',
    name: 'Firebase API Key',
    pattern: /AIza[a-zA-Z0-9_-]{35}/,
    dashboardUrl: 'https://console.firebase.google.com/',
    tags: ['env-var', 'firebase', 'backend']
  },
  {
    provider: 'convex',
    name: 'Convex Deploy Key',
    pattern: /prod:[a-zA-Z0-9_-]{32,}|dev:[a-zA-Z0-9_-]{32,}/,
    dashboardUrl: 'https://dashboard.convex.dev/',
    tags: ['env-var', 'convex', 'backend']
  },

  // ===================
  // Auth Providers
  // ===================
  {
    provider: 'clerk-publishable',
    name: 'Clerk Publishable Key',
    pattern: /pk_(?:test|live)_[a-zA-Z0-9]{40,}/,
    dashboardUrl: 'https://dashboard.clerk.com/',
    tags: ['env-var', 'clerk', 'auth']
  },
  {
    provider: 'clerk-secret',
    name: 'Clerk Secret Key',
    pattern: /sk_(?:test|live)_[a-zA-Z0-9]{40,}/,
    dashboardUrl: 'https://dashboard.clerk.com/',
    tags: ['env-var', 'clerk', 'auth']
  },
  {
    provider: 'auth0',
    name: 'Auth0 Client Secret',
    pattern: /[a-zA-Z0-9_-]{32,}/,
    contextRequired: true,
    dashboardUrl: 'https://manage.auth0.com/',
    tags: ['env-var', 'auth0', 'auth']
  },

  // ===================
  // Payments
  // ===================
  {
    provider: 'stripe-publishable-live',
    name: 'Stripe Live Publishable Key',
    pattern: /pk_live_[a-zA-Z0-9]{24,}/,
    dashboardUrl: 'https://dashboard.stripe.com/apikeys',
    tags: ['env-var', 'stripe', 'payments']
  },
  {
    provider: 'stripe-publishable-test',
    name: 'Stripe Test Publishable Key',
    pattern: /pk_test_[a-zA-Z0-9]{24,}/,
    dashboardUrl: 'https://dashboard.stripe.com/test/apikeys',
    tags: ['env-var', 'stripe', 'payments']
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
    provider: 'stripe-webhook',
    name: 'Stripe Webhook Secret',
    pattern: /whsec_[a-zA-Z0-9]{32,}/,
    dashboardUrl: 'https://dashboard.stripe.com/webhooks',
    tags: ['env-var', 'stripe', 'payments']
  },
  {
    provider: 'paypal',
    name: 'PayPal Client ID',
    pattern: /A[a-zA-Z0-9_-]{79}/,
    contextRequired: true,
    dashboardUrl: 'https://developer.paypal.com/dashboard/applications',
    tags: ['env-var', 'paypal', 'payments']
  },
  {
    provider: 'square',
    name: 'Square Access Token',
    pattern: /sq0atp-[a-zA-Z0-9_-]{22}|EAAAE[a-zA-Z0-9_-]{56}/,
    dashboardUrl: 'https://developer.squareup.com/apps',
    tags: ['env-var', 'square', 'payments']
  },
  {
    provider: 'lemonsqueezy',
    name: 'Lemon Squeezy API Key',
    pattern: /[a-zA-Z0-9]{40,}/,
    contextRequired: true,
    dashboardUrl: 'https://app.lemonsqueezy.com/settings/api',
    tags: ['env-var', 'lemonsqueezy', 'payments']
  },

  // ===================
  // Email Services
  // ===================
  {
    provider: 'sendgrid',
    name: 'SendGrid API Key',
    pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/,
    dashboardUrl: 'https://app.sendgrid.com/settings/api_keys',
    tags: ['env-var', 'sendgrid', 'email']
  },
  {
    provider: 'resend',
    name: 'Resend API Key',
    pattern: /re_[a-zA-Z0-9]{32,}/,
    dashboardUrl: 'https://resend.com/api-keys',
    tags: ['env-var', 'resend', 'email']
  },
  {
    provider: 'postmark',
    name: 'Postmark Server Token',
    pattern: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/,
    contextRequired: true,
    dashboardUrl: 'https://account.postmarkapp.com/servers',
    tags: ['env-var', 'postmark', 'email']
  },
  {
    provider: 'mailgun',
    name: 'Mailgun API Key',
    pattern: /key-[a-f0-9]{32}|[a-f0-9]{32}-[a-f0-9]{8}-[a-f0-9]{8}/,
    dashboardUrl: 'https://app.mailgun.com/app/account/security/api_keys',
    tags: ['env-var', 'mailgun', 'email']
  },
  {
    provider: 'mailchimp',
    name: 'Mailchimp API Key',
    pattern: /[a-f0-9]{32}-us[0-9]{1,2}/,
    dashboardUrl: 'https://admin.mailchimp.com/account/api/',
    tags: ['env-var', 'mailchimp', 'email']
  },

  // ===================
  // Communication
  // ===================
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
  },
  {
    provider: 'slack-webhook',
    name: 'Slack Webhook URL',
    pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9]+\/B[a-zA-Z0-9]+\/[a-zA-Z0-9]+/,
    dashboardUrl: 'https://api.slack.com/apps',
    tags: ['env-var', 'slack', 'messaging']
  },
  {
    provider: 'discord-bot',
    name: 'Discord Bot Token',
    pattern: /[MN][a-zA-Z0-9_-]{23,}\.[a-zA-Z0-9_-]{6}\.[a-zA-Z0-9_-]{27,}/,
    dashboardUrl: 'https://discord.com/developers/applications',
    tags: ['env-var', 'discord', 'messaging']
  },
  {
    provider: 'discord-webhook',
    name: 'Discord Webhook URL',
    pattern: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]+\/[a-zA-Z0-9_-]+/,
    dashboardUrl: 'https://discord.com/developers/applications',
    tags: ['env-var', 'discord', 'messaging']
  },
  {
    provider: 'telegram',
    name: 'Telegram Bot Token',
    pattern: /[0-9]{9,10}:[a-zA-Z0-9_-]{35}/,
    dashboardUrl: 'https://t.me/BotFather',
    tags: ['env-var', 'telegram', 'messaging']
  },

  // ===================
  // Analytics & Monitoring
  // ===================
  {
    provider: 'sentry',
    name: 'Sentry DSN',
    pattern: /https:\/\/[a-f0-9]{32}@[a-z0-9]+\.ingest\.sentry\.io\/[0-9]+/,
    dashboardUrl: 'https://sentry.io/settings/projects/',
    tags: ['env-var', 'sentry', 'monitoring']
  },
  {
    provider: 'datadog',
    name: 'Datadog API Key',
    pattern: /[a-f0-9]{32}/,
    contextRequired: true,
    dashboardUrl: 'https://app.datadoghq.com/organization-settings/api-keys',
    tags: ['env-var', 'datadog', 'monitoring']
  },
  {
    provider: 'segment',
    name: 'Segment Write Key',
    pattern: /[a-zA-Z0-9]{32}/,
    contextRequired: true,
    dashboardUrl: 'https://app.segment.com/',
    tags: ['env-var', 'segment', 'analytics']
  },
  {
    provider: 'mixpanel',
    name: 'Mixpanel Token',
    pattern: /[a-f0-9]{32}/,
    contextRequired: true,
    dashboardUrl: 'https://mixpanel.com/settings/project',
    tags: ['env-var', 'mixpanel', 'analytics']
  },
  {
    provider: 'posthog',
    name: 'PostHog API Key',
    pattern: /phc_[a-zA-Z0-9]{32,}/,
    dashboardUrl: 'https://app.posthog.com/project/settings',
    tags: ['env-var', 'posthog', 'analytics']
  },
  {
    provider: 'logrocket',
    name: 'LogRocket App ID',
    pattern: /[a-z0-9]+\/[a-z0-9-]+/,
    contextRequired: true,
    dashboardUrl: 'https://app.logrocket.com/',
    tags: ['env-var', 'logrocket', 'monitoring']
  },

  // ===================
  // Search
  // ===================
  {
    provider: 'algolia-app',
    name: 'Algolia App ID',
    pattern: /[A-Z0-9]{10}/,
    contextRequired: true,
    dashboardUrl: 'https://dashboard.algolia.com/account/api-keys',
    tags: ['env-var', 'algolia', 'search']
  },
  {
    provider: 'algolia-admin',
    name: 'Algolia Admin API Key',
    pattern: /[a-f0-9]{32}/,
    contextRequired: true,
    dashboardUrl: 'https://dashboard.algolia.com/account/api-keys',
    tags: ['env-var', 'algolia', 'search']
  },
  {
    provider: 'meilisearch',
    name: 'Meilisearch API Key',
    pattern: /[a-f0-9]{40,}/,
    contextRequired: true,
    dashboardUrl: 'https://cloud.meilisearch.com/',
    tags: ['env-var', 'meilisearch', 'search']
  },

  // ===================
  // Developer Tools
  // ===================
  {
    provider: 'linear',
    name: 'Linear API Key',
    pattern: /lin_api_[a-zA-Z0-9]{40}/,
    dashboardUrl: 'https://linear.app/settings/api',
    tags: ['env-var', 'linear', 'productivity']
  },
  {
    provider: 'notion',
    name: 'Notion Integration Token',
    pattern: /secret_[a-zA-Z0-9]{43}|ntn_[a-zA-Z0-9]{43,}/,
    dashboardUrl: 'https://www.notion.so/my-integrations',
    tags: ['env-var', 'notion', 'productivity']
  },
  {
    provider: 'airtable',
    name: 'Airtable API Key',
    pattern: /key[a-zA-Z0-9]{14}|pat[a-zA-Z0-9]{14}\.[a-f0-9]{64}/,
    dashboardUrl: 'https://airtable.com/account',
    tags: ['env-var', 'airtable', 'productivity']
  },
  {
    provider: 'npm',
    name: 'NPM Access Token',
    pattern: /npm_[a-zA-Z0-9]{36}/,
    dashboardUrl: 'https://www.npmjs.com/settings/~/tokens',
    tags: ['env-var', 'npm', 'registry']
  },
  {
    provider: 'docker',
    name: 'Docker Hub Token',
    pattern: /dckr_pat_[a-zA-Z0-9_-]{52}/,
    dashboardUrl: 'https://hub.docker.com/settings/security',
    tags: ['env-var', 'docker', 'registry']
  },

  // ===================
  // E-commerce
  // ===================
  {
    provider: 'shopify-admin',
    name: 'Shopify Admin API Token',
    pattern: /shpat_[a-f0-9]{32}/,
    dashboardUrl: 'https://admin.shopify.com/store/',
    tags: ['env-var', 'shopify', 'ecommerce']
  },
  {
    provider: 'shopify-storefront',
    name: 'Shopify Storefront Token',
    pattern: /shpss_[a-f0-9]{32}/,
    dashboardUrl: 'https://admin.shopify.com/store/',
    tags: ['env-var', 'shopify', 'ecommerce']
  },

  // ===================
  // Maps & Location
  // ===================
  {
    provider: 'mapbox',
    name: 'Mapbox Access Token',
    pattern: /pk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+|sk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
    dashboardUrl: 'https://account.mapbox.com/access-tokens/',
    tags: ['env-var', 'mapbox', 'maps']
  },
  {
    provider: 'google-maps',
    name: 'Google Maps API Key',
    pattern: /AIza[a-zA-Z0-9_-]{35}/,
    dashboardUrl: 'https://console.cloud.google.com/apis/credentials',
    tags: ['env-var', 'google', 'maps']
  },

  // ===================
  // Media & Storage
  // ===================
  {
    provider: 'cloudinary',
    name: 'Cloudinary URL',
    pattern: /cloudinary:\/\/[0-9]+:[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+/,
    dashboardUrl: 'https://console.cloudinary.com/settings/api-keys',
    tags: ['env-var', 'cloudinary', 'media']
  },
  {
    provider: 'uploadthing',
    name: 'UploadThing Secret',
    pattern: /sk_live_[a-zA-Z0-9]{32,}/,
    dashboardUrl: 'https://uploadthing.com/dashboard',
    tags: ['env-var', 'uploadthing', 'media']
  },

  // ===================
  // CMS
  // ===================
  {
    provider: 'contentful',
    name: 'Contentful Access Token',
    pattern: /[a-zA-Z0-9_-]{43}/,
    contextRequired: true,
    dashboardUrl: 'https://app.contentful.com/',
    tags: ['env-var', 'contentful', 'cms']
  },
  {
    provider: 'sanity',
    name: 'Sanity API Token',
    pattern: /sk[a-zA-Z0-9]{100,}/,
    dashboardUrl: 'https://www.sanity.io/manage',
    tags: ['env-var', 'sanity', 'cms']
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
    'twilio-auth-token': /twilio/i,
    'aws-secret-key': /aws|amazon/i,
    'auth0': /auth0/i,
    'cohere': /cohere/i,
    'turso': /turso/i,
    'railway': /railway/i,
    'postmark': /postmark/i,
    'datadog': /datadog/i,
    'segment': /segment/i,
    'mixpanel': /mixpanel/i,
    'logrocket': /logrocket/i,
    'algolia-app': /algolia/i,
    'algolia-admin': /algolia/i,
    'meilisearch': /meilisearch/i,
    'contentful': /contentful/i,
    'paypal': /paypal/i,
    'lemonsqueezy': /lemon/i
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

/**
 * Parse environment variable lines from text
 * Supports: KEY=value, KEY="value", KEY  value (tab-separated)
 * @param {string} text - Text to parse
 * @returns {Array<{envVarName: string, value: string}>}
 */
export function parseEnvVarPairs(text) {
  const pairs = []
  const seen = new Set()

  // Pattern 1: KEY=value or KEY="value" or KEY='value'
  // Matches: OPENAI_API_KEY=sk-xxx, DB_URL="postgres://...", etc.
  const envPattern = /^([A-Z_][A-Z0-9_]*)\s*=\s*["']?([^"'\n\r]+?)["']?\s*$/gm

  // Pattern 2: Tab-separated (from HTML table copy)
  // Matches: KEY<tab>value or KEY<tab><tab>value
  const tabPattern = /^([A-Z_][A-Z0-9_]*)\t+(\S+)$/gm

  // Process KEY=value patterns
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

  // Process tab-separated patterns
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
 * Useful for detecting unknown API keys or tokens
 * @param {string} value - Value to check
 * @returns {boolean}
 */
export function looksLikeSecret(value) {
  if (!value || typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()

  // Too short to be a secret
  if (trimmed.length < 16) {
    return false
  }

  // Too long to be a typical secret
  if (trimmed.length > 500) {
    return false
  }

  // Contains spaces - probably not a secret
  if (/\s/.test(trimmed)) {
    return false
  }

  // Check for common secret characteristics
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
 * @param {Array} keys - Array of detected key objects
 * @returns {Array} Deduplicated array
 */
export function dedupeByValue(keys) {
  const seen = new Set()
  return keys.filter(key => {
    if (seen.has(key.value)) {
      return false
    }
    seen.add(key.value)
    return true
  })
}
