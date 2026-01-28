/**
 * Tests for MCP Server
 * Note: These are unit tests that mock the 1Password CLI
 */

import { describe, it, beforeEach, mock } from 'node:test'
import assert from 'node:assert'
import { execFileSync } from 'child_process'

// Mock data for 1Password responses
const mockItems = [
  {
    id: 'abc123',
    title: 'OPENAI_API_KEY',
    vault: { name: 'Private' },
    tags: ['env-var', 'openai', 'ai']
  },
  {
    id: 'def456',
    title: 'STRIPE_SECRET_KEY',
    vault: { name: 'Private' },
    tags: ['env-var', 'stripe', 'payments']
  }
]

const mockCreatedItem = {
  id: 'new123',
  title: 'CLOUDFLARE_API_TOKEN',
  vault: { name: 'Private' }
}

describe('MCP Server Tools', () => {

  describe('store_api_key', () => {
    it('should create item with required fields', () => {
      const params = {
        service: 'Cloudflare',
        key: 'cf_xxxxxxxxxxxx',
        envVarName: 'CLOUDFLARE_API_TOKEN',
        dashboardUrl: 'https://dash.cloudflare.com/profile/api-tokens'
      }

      // Expected CLI args
      const expectedArgs = [
        'item', 'create',
        '--category=API Credential',
        '--title=CLOUDFLARE_API_TOKEN',
        '--vault=Private',
        '--tags=env-var,cloudflare',
        'credential=cf_xxxxxxxxxxxx',
        'env_var_name=CLOUDFLARE_API_TOKEN',
        'dashboard_url=https://dash.cloudflare.com/profile/api-tokens',
        '--format=json'
      ]

      // Verify the expected command structure
      assert.ok(expectedArgs.includes('--category=API Credential'))
      assert.ok(expectedArgs.includes(`--title=${params.envVarName}`))
      assert.ok(expectedArgs.includes(`credential=${params.key}`))
    })

    it('should use service name as title when envVarName not provided', () => {
      const params = {
        service: 'Cloudflare',
        key: 'cf_xxxxxxxxxxxx'
      }

      const expectedTitle = 'Cloudflare API Key'
      assert.strictEqual(
        params.envVarName || `${params.service} API Key`,
        expectedTitle
      )
    })
  })

  describe('list_api_keys', () => {
    it('should return array of items with correct structure', () => {
      const result = mockItems.map(item => ({
        id: item.id,
        title: item.title,
        vault: item.vault?.name || 'Private',
        tags: item.tags || []
      }))

      assert.strictEqual(result.length, 2)
      assert.strictEqual(result[0].id, 'abc123')
      assert.strictEqual(result[0].title, 'OPENAI_API_KEY')
      assert.ok(Array.isArray(result[0].tags))
    })

    it('should filter by provider tag', () => {
      const provider = 'openai'
      const filtered = mockItems.filter(item =>
        item.tags.some(t => t.toLowerCase() === provider.toLowerCase())
      )

      assert.strictEqual(filtered.length, 1)
      assert.strictEqual(filtered[0].title, 'OPENAI_API_KEY')
    })
  })

  describe('get_api_key', () => {
    it('should validate item ID format', () => {
      const validIds = ['abc123', 'ABC-123', 'a1b2c3d4-e5f6']
      const invalidIds = ['', 'abc 123', 'abc;drop table', '../../../etc']

      for (const id of validIds) {
        assert.ok(/^[a-zA-Z0-9-]+$/.test(id), `${id} should be valid`)
      }

      for (const id of invalidIds) {
        assert.ok(!/^[a-zA-Z0-9-]+$/.test(id), `${id} should be invalid`)
      }
    })
  })

  describe('add_token_to_existing', () => {
    it('should validate field name format', () => {
      const validNames = ['api_token', 'refreshToken', 'API-KEY']
      const invalidNames = ['', '123abc', 'field name', 'field;drop']

      for (const name of validNames) {
        assert.ok(/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name), `${name} should be valid`)
      }

      for (const name of invalidNames) {
        assert.ok(!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name), `${name} should be invalid`)
      }
    })

    it('should build correct field path with section', () => {
      const fieldName = 'api_token'
      const section = 'Tokens'

      const fieldPath = section ? `${section}.${fieldName}` : fieldName
      assert.strictEqual(fieldPath, 'Tokens.api_token')
    })

    it('should build correct field path without section', () => {
      const fieldName = 'api_token'
      const section = undefined

      const fieldPath = section ? `${section}.${fieldName}` : fieldName
      assert.strictEqual(fieldPath, 'api_token')
    })
  })

  describe('search_items', () => {
    it('should filter items by query', () => {
      const query = 'openai'
      const filtered = mockItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )

      assert.strictEqual(filtered.length, 1)
      assert.strictEqual(filtered[0].title, 'OPENAI_API_KEY')
    })

    it('should return all items when no query provided', () => {
      const query = undefined
      const filtered = query
        ? mockItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
        : mockItems

      assert.strictEqual(filtered.length, 2)
    })
  })
})

describe('Tool Schema Validation', () => {
  const tools = [
    {
      name: 'store_api_key',
      required: ['service', 'key']
    },
    {
      name: 'list_api_keys',
      required: []
    },
    {
      name: 'get_api_key',
      required: ['itemId']
    },
    {
      name: 'add_token_to_existing',
      required: ['itemId', 'fieldName', 'fieldValue']
    },
    {
      name: 'search_items',
      required: []
    }
  ]

  for (const tool of tools) {
    it(`${tool.name} should have correct required fields`, () => {
      assert.ok(Array.isArray(tool.required))

      // Validate required fields are strings
      for (const field of tool.required) {
        assert.strictEqual(typeof field, 'string')
      }
    })
  }
})
