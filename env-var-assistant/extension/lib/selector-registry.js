/**
 * Selector Registry - Manages dashboard selectors with remote updates
 * Fetches community-maintained selectors from a remote source with local caching
 */

// Remote source for community-maintained selectors
const SELECTORS_URL = 'https://raw.githubusercontent.com/jbmd/env-var-selectors/main/selectors.json'
const CACHE_KEY = 'dashboard-selectors-cache'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

// Bundled default selectors (fallback when remote unavailable)
const DEFAULT_SELECTORS = {
  version: '1.0.0',
  providers: [
    {
      id: 'cloudflare',
      name: 'Cloudflare',
      variants: [
        {
          id: 'workers',
          name: 'Cloudflare Workers',
          urlPatterns: ['dash\\.cloudflare\\.com/[^/]+/workers'],
          selectors: {
            nameInput: 'input[name="name"], input[data-testid="variable-name"]',
            valueInput: 'input[name="value"], textarea[data-testid="variable-value"]',
            form: 'form[data-testid="add-secret-form"]'
          }
        },
        {
          id: 'pages',
          name: 'Cloudflare Pages',
          urlPatterns: ['dash\\.cloudflare\\.com/[^/]+/pages'],
          selectors: {
            nameInput: 'input[name="name"]',
            valueInput: 'input[name="value"], textarea[name="value"]',
            form: 'form'
          }
        }
      ]
    },
    {
      id: 'vercel',
      name: 'Vercel',
      urlPatterns: ['vercel\\.com/[^/]+/[^/]+/settings/environment-variables'],
      selectors: {
        addButton: 'button:has-text("Add New")',
        nameInput: 'input[name="key"]',
        valueInput: 'input[name="value"], textarea[name="value"]',
        saveButton: 'button[type="submit"]:has-text("Save")'
      }
    },
    {
      id: 'netlify',
      name: 'Netlify',
      urlPatterns: ['app\\.netlify\\.com/sites/[^/]+/configuration/env'],
      selectors: {
        addButton: 'button:has-text("Add a variable")',
        nameInput: 'input[name="key"]',
        valueInput: 'textarea[name="value"]',
        saveButton: 'button[type="submit"]:has-text("Create variable")'
      }
    },
    {
      id: 'github',
      name: 'GitHub',
      urlPatterns: ['github\\.com/[^/]+/[^/]+/settings/secrets/actions'],
      selectors: {
        addButton: 'a:has-text("New repository secret")',
        nameInput: '#secret_name, input[name="secret_name"]',
        valueInput: '#secret_value, textarea[name="secret_value"]',
        saveButton: 'button:has-text("Add secret")'
      }
    },
    {
      id: 'railway',
      name: 'Railway',
      urlPatterns: ['railway\\.app/project/[^/]+/settings/variables'],
      selectors: {
        nameInput: 'input[placeholder*="Variable name"]',
        valueInput: 'input[placeholder*="Variable value"], textarea',
        form: 'form'
      }
    },
    {
      id: 'render',
      name: 'Render',
      urlPatterns: ['dashboard\\.render\\.com/[^/]+/env'],
      selectors: {
        addButton: 'button:has-text("Add Environment Variable")',
        nameInput: 'input[name="key"]',
        valueInput: 'input[name="value"]',
        saveButton: 'button[type="submit"]'
      }
    },
    {
      id: 'fly',
      name: 'Fly.io',
      urlPatterns: ['fly\\.io/apps/[^/]+/secrets'],
      selectors: {
        nameInput: 'input[name="name"]',
        valueInput: 'textarea[name="value"]',
        form: 'form'
      }
    },
    {
      id: 'supabase',
      name: 'Supabase',
      urlPatterns: ['supabase\\.com/dashboard/project/[^/]+/settings/api'],
      readOnly: true,
      selectors: {
        anonKey: '[data-testid="anon-key"]',
        serviceKey: '[data-testid="service-key"]'
      }
    },
    {
      id: 'openai',
      name: 'OpenAI',
      urlPatterns: ['platform\\.openai\\.com/api-keys', 'platform\\.openai\\.com/settings'],
      readOnly: true,
      selectors: {
        keyDisplay: '[data-testid="api-key"]',
        copyButton: 'button:has-text("Copy")'
      }
    }
  ]
}

class SelectorRegistry {
  constructor() {
    this.providers = new Map()
    this.loaded = false
    this.config = null
  }

  /**
   * Load selectors from cache or remote
   */
  async load() {
    // Check cache first
    const cached = await this.getCached()
    if (cached) {
      this.parseConfig(cached)
      this.loaded = true
      // Refresh in background (don't await)
      this.fetchRemote().catch(() => {})
      return
    }

    // Fetch fresh
    const config = await this.fetchRemote()
    if (config) {
      this.parseConfig(config)
    } else {
      // Fall back to bundled defaults
      this.parseConfig(DEFAULT_SELECTORS)
    }
    this.loaded = true
  }

  /**
   * Fetch selectors from remote source
   */
  async fetchRemote() {
    try {
      const response = await fetch(SELECTORS_URL, {
        cache: 'no-cache'
      })
      if (response.ok) {
        const config = await response.json()
        await this.setCache(config)
        return config
      }
    } catch (error) {
      console.warn('Failed to fetch remote selectors:', error)
    }
    return null
  }

  /**
   * Get cached selectors
   */
  async getCached() {
    try {
      const data = await chrome.storage.local.get(CACHE_KEY)
      if (data[CACHE_KEY]) {
        const { config, timestamp } = data[CACHE_KEY]
        if (Date.now() - timestamp < CACHE_TTL) {
          return config
        }
      }
    } catch (error) {
      console.warn('Failed to read selector cache:', error)
    }
    return null
  }

  /**
   * Set cached selectors
   */
  async setCache(config) {
    try {
      await chrome.storage.local.set({
        [CACHE_KEY]: { config, timestamp: Date.now() }
      })
    } catch (error) {
      console.warn('Failed to cache selectors:', error)
    }
  }

  /**
   * Clear the cache (useful for forcing refresh)
   */
  async clearCache() {
    try {
      await chrome.storage.local.remove(CACHE_KEY)
    } catch (error) {
      console.warn('Failed to clear selector cache:', error)
    }
  }

  /**
   * Parse configuration into internal format
   */
  parseConfig(config) {
    this.config = config
    this.providers.clear()

    for (const provider of config.providers) {
      // Handle providers with variants
      if (provider.variants) {
        for (const variant of provider.variants) {
          const key = `${provider.id}.${variant.id}`
          this.providers.set(key, {
            provider: provider.id,
            variant: variant.id,
            name: variant.name || provider.name,
            urlPatterns: this.compilePatterns(variant.urlPatterns),
            selectors: variant.selectors,
            readOnly: variant.readOnly || provider.readOnly || false
          })
        }
      } else {
        // Simple provider without variants
        this.providers.set(provider.id, {
          provider: provider.id,
          name: provider.name,
          urlPatterns: this.compilePatterns(provider.urlPatterns),
          selectors: provider.selectors,
          readOnly: provider.readOnly || false
        })
      }
    }
  }

  /**
   * Compile URL pattern strings to RegExp objects
   */
  compilePatterns(patterns) {
    if (!patterns) return []
    return patterns.map(p => new RegExp(p))
  }

  /**
   * Find matching dashboard for a URL
   */
  findDashboard(url) {
    for (const [key, config] of this.providers.entries()) {
      for (const pattern of config.urlPatterns) {
        if (pattern.test(url)) {
          return { id: key, ...config }
        }
      }
    }
    return null
  }

  /**
   * Get all registered providers
   */
  getAllProviders() {
    return Array.from(this.providers.entries()).map(([id, config]) => ({
      id,
      ...config
    }))
  }

  /**
   * Get the current config version
   */
  getVersion() {
    return this.config?.version || 'unknown'
  }
}

// Singleton instance
export const selectorRegistry = new SelectorRegistry()

// Export for testing
export { DEFAULT_SELECTORS, CACHE_KEY, CACHE_TTL }
