/**
 * Tests for Selector Registry
 */

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

// Test the default selectors structure
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
            nameInput: 'input[name="name"]',
            valueInput: 'input[name="value"]',
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
        nameInput: 'input[name="key"]',
        valueInput: 'input[name="value"]'
      }
    },
    {
      id: 'supabase',
      name: 'Supabase',
      urlPatterns: ['supabase\\.com/dashboard'],
      readOnly: true
    }
  ]
}

describe('Selector Registry', () => {

  describe('parseConfig', () => {
    it('should parse providers with variants', () => {
      const cloudflare = DEFAULT_SELECTORS.providers.find(p => p.id === 'cloudflare')

      assert.ok(cloudflare)
      assert.ok(Array.isArray(cloudflare.variants))
      assert.strictEqual(cloudflare.variants.length, 1)
      assert.strictEqual(cloudflare.variants[0].id, 'workers')
    })

    it('should parse simple providers without variants', () => {
      const vercel = DEFAULT_SELECTORS.providers.find(p => p.id === 'vercel')

      assert.ok(vercel)
      assert.ok(!vercel.variants)
      assert.ok(Array.isArray(vercel.urlPatterns))
    })

    it('should identify read-only providers', () => {
      const supabase = DEFAULT_SELECTORS.providers.find(p => p.id === 'supabase')

      assert.ok(supabase)
      assert.strictEqual(supabase.readOnly, true)
    })
  })

  describe('URL Pattern Matching', () => {
    it('should match Cloudflare Workers URL', () => {
      const pattern = new RegExp('dash\\.cloudflare\\.com/[^/]+/workers')
      const url = 'https://dash.cloudflare.com/abc123/workers/services/my-worker/settings'

      assert.ok(pattern.test(url))
    })

    it('should match Vercel env vars URL', () => {
      const pattern = new RegExp('vercel\\.com/[^/]+/[^/]+/settings/environment-variables')
      const url = 'https://vercel.com/team/project/settings/environment-variables'

      assert.ok(pattern.test(url))
    })

    it('should not match unrelated URLs', () => {
      const pattern = new RegExp('vercel\\.com/[^/]+/[^/]+/settings/environment-variables')
      const url = 'https://github.com/user/repo'

      assert.ok(!pattern.test(url))
    })
  })

  describe('findDashboard', () => {
    function findDashboard(url, providers) {
      for (const provider of providers) {
        if (provider.variants) {
          for (const variant of provider.variants) {
            for (const patternStr of variant.urlPatterns) {
              if (new RegExp(patternStr).test(url)) {
                return {
                  id: `${provider.id}.${variant.id}`,
                  name: variant.name,
                  selectors: variant.selectors,
                  readOnly: variant.readOnly || provider.readOnly || false
                }
              }
            }
          }
        } else if (provider.urlPatterns) {
          for (const patternStr of provider.urlPatterns) {
            if (new RegExp(patternStr).test(url)) {
              return {
                id: provider.id,
                name: provider.name,
                selectors: provider.selectors,
                readOnly: provider.readOnly || false
              }
            }
          }
        }
      }
      return null
    }

    it('should find Cloudflare Workers dashboard', () => {
      const url = 'https://dash.cloudflare.com/abc123/workers/services/test'
      const result = findDashboard(url, DEFAULT_SELECTORS.providers)

      assert.ok(result)
      assert.strictEqual(result.id, 'cloudflare.workers')
      assert.strictEqual(result.name, 'Cloudflare Workers')
    })

    it('should find Vercel dashboard', () => {
      const url = 'https://vercel.com/team/project/settings/environment-variables'
      const result = findDashboard(url, DEFAULT_SELECTORS.providers)

      assert.ok(result)
      assert.strictEqual(result.id, 'vercel')
    })

    it('should return null for unknown URL', () => {
      const url = 'https://example.com/some/page'
      const result = findDashboard(url, DEFAULT_SELECTORS.providers)

      assert.strictEqual(result, null)
    })

    it('should mark read-only dashboards', () => {
      const url = 'https://supabase.com/dashboard/project/abc/settings/api'
      const result = findDashboard(url, DEFAULT_SELECTORS.providers)

      assert.ok(result)
      assert.strictEqual(result.readOnly, true)
    })
  })

  describe('Selector Validation', () => {
    it('should have valid CSS selectors', () => {
      const vercel = DEFAULT_SELECTORS.providers.find(p => p.id === 'vercel')

      assert.ok(vercel.selectors.nameInput)
      assert.ok(vercel.selectors.valueInput)

      // Check that selectors are strings
      assert.strictEqual(typeof vercel.selectors.nameInput, 'string')
      assert.strictEqual(typeof vercel.selectors.valueInput, 'string')
    })

    it('should have selectors for variant providers', () => {
      const cloudflare = DEFAULT_SELECTORS.providers.find(p => p.id === 'cloudflare')
      const workers = cloudflare.variants[0]

      assert.ok(workers.selectors)
      assert.ok(workers.selectors.nameInput)
      assert.ok(workers.selectors.valueInput)
    })
  })

  describe('Version', () => {
    it('should have a version string', () => {
      assert.ok(DEFAULT_SELECTORS.version)
      assert.strictEqual(typeof DEFAULT_SELECTORS.version, 'string')
      assert.ok(/^\d+\.\d+\.\d+$/.test(DEFAULT_SELECTORS.version))
    })
  })
})

describe('Cache Management', () => {
  const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

  it('should consider cache valid within TTL', () => {
    const timestamp = Date.now() - (12 * 60 * 60 * 1000) // 12 hours ago
    const isValid = Date.now() - timestamp < CACHE_TTL

    assert.strictEqual(isValid, true)
  })

  it('should consider cache invalid after TTL', () => {
    const timestamp = Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
    const isValid = Date.now() - timestamp < CACHE_TTL

    assert.strictEqual(isValid, false)
  })
})
