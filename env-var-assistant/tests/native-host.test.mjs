/**
 * Integration tests for native messaging host
 * Tests the host.js script's message handling
 */

import { test, describe, beforeEach, mock } from 'node:test'
import assert from 'node:assert'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const HOST_PATH = join(__dirname, '..', 'native-host', 'host.js')

/**
 * Helper to send a message to the native host and get response
 */
function sendToHost(message) {
  const messageStr = JSON.stringify(message)
  const messageBuffer = Buffer.from(messageStr, 'utf8')
  const lengthBuffer = Buffer.alloc(4)
  lengthBuffer.writeUInt32LE(messageBuffer.length, 0)
  const input = Buffer.concat([lengthBuffer, messageBuffer])

  try {
    const result = execSync(`node "${HOST_PATH}"`, {
      input,
      encoding: null, // Return buffer
      timeout: 10000,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // Parse response (4-byte length prefix + JSON)
    if (result.length < 4) {
      throw new Error('Response too short')
    }
    const responseLength = result.readUInt32LE(0)
    const responseJson = result.slice(4, 4 + responseLength).toString('utf8')
    return JSON.parse(responseJson)
  } catch (error) {
    if (error.stderr) {
      throw new Error(`Host error: ${error.stderr.toString()}`)
    }
    throw error
  }
}

/**
 * Check if 1Password CLI is available
 */
function isOpAvailable() {
  try {
    execSync('/opt/homebrew/bin/op --version', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

/**
 * Check if signed in to 1Password
 */
function isOpSignedIn() {
  try {
    execSync('/opt/homebrew/bin/op vault list --format=json', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

describe('Native Host Message Protocol', () => {
  test('responds to ping', () => {
    const response = sendToHost({ id: 1, action: 'ping' })
    assert.strictEqual(response.id, 1)
    assert.strictEqual(response.success, true)
    assert.deepStrictEqual(response.data, { pong: true })
  })

  test('returns error for unknown action', () => {
    const response = sendToHost({ id: 2, action: 'unknown_action' })
    assert.strictEqual(response.id, 2)
    assert.strictEqual(response.success, false)
    assert.ok(response.error.includes('Unknown action'))
  })

  test('handles missing action gracefully', () => {
    const response = sendToHost({ id: 3 })
    assert.strictEqual(response.success, false)
  })
})

describe('1Password CLI Integration', { skip: !isOpAvailable() }, () => {
  test('check action verifies CLI availability', { skip: !isOpSignedIn() }, () => {
    const response = sendToHost({ id: 10, action: 'check' })
    assert.strictEqual(response.success, true)
    assert.ok(response.data.version)
    assert.strictEqual(response.data.authenticated, true)
  })

  test('list action returns array', { skip: !isOpSignedIn() }, () => {
    const response = sendToHost({
      id: 11,
      action: 'list',
      tags: ['env-var']
    })
    // Should succeed even if empty
    assert.strictEqual(response.success, true)
    assert.ok(Array.isArray(response.data))
  })

  test('list action with vault filter', { skip: !isOpSignedIn() }, () => {
    const response = sendToHost({
      id: 12,
      action: 'list',
      vault: 'Personal',
      tags: ['env-var']
    })
    assert.strictEqual(response.success, true)
    assert.ok(Array.isArray(response.data))
  })

  test('read action with invalid reference fails gracefully', { skip: !isOpSignedIn() }, () => {
    const response = sendToHost({
      id: 13,
      action: 'read',
      reference: 'op://NonExistentVault/NonExistentItem/field'
    })
    assert.strictEqual(response.success, false)
    assert.ok(response.error)
  })
})

describe('Message Format Validation', () => {
  test('preserves message ID in response', () => {
    const response = sendToHost({ id: 999, action: 'ping' })
    assert.strictEqual(response.id, 999)
  })

  test('handles string ID', () => {
    const response = sendToHost({ id: 'test-id-123', action: 'ping' })
    assert.strictEqual(response.id, 'test-id-123')
  })

  test('handles large message IDs', () => {
    const response = sendToHost({ id: Number.MAX_SAFE_INTEGER, action: 'ping' })
    assert.strictEqual(response.id, Number.MAX_SAFE_INTEGER)
  })
})
