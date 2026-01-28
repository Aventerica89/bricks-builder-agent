/**
 * Native messaging wrapper for communicating with 1Password CLI
 */

const HOST_NAME = 'com.envvar.assistant'

let port = null
let messageId = 0
const pendingMessages = new Map()

/**
 * Connect to native messaging host
 */
export function connect() {
  if (port) {
    return Promise.resolve(true)
  }

  return new Promise((resolve, reject) => {
    try {
      port = chrome.runtime.connectNative(HOST_NAME)

      port.onMessage.addListener((message) => {
        const { id, success, data, error } = message

        if (id && pendingMessages.has(id)) {
          const { resolve, reject } = pendingMessages.get(id)
          pendingMessages.delete(id)

          if (success) {
            resolve(data)
          } else {
            reject(new Error(error || 'Unknown error'))
          }
        }
      })

      port.onDisconnect.addListener(() => {
        const error = chrome.runtime.lastError
        port = null

        // Reject all pending messages
        for (const [id, { reject }] of pendingMessages) {
          reject(new Error(error?.message || 'Native host disconnected'))
          pendingMessages.delete(id)
        }
      })

      // Test connection with ping
      sendMessage({ action: 'ping' })
        .then(() => resolve(true))
        .catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Send message to native host and wait for response
 */
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!port) {
      reject(new Error('Not connected to native host'))
      return
    }

    const id = ++messageId
    pendingMessages.set(id, { resolve, reject })

    // Set timeout for response
    setTimeout(() => {
      if (pendingMessages.has(id)) {
        pendingMessages.delete(id)
        reject(new Error('Request timeout'))
      }
    }, 30000)

    port.postMessage({ id, ...message })
  })
}

/**
 * Disconnect from native host
 */
export function disconnect() {
  if (port) {
    port.disconnect()
    port = null
  }
}

/**
 * Check if 1Password CLI is available
 */
export async function checkOpCli() {
  await connect()
  return sendMessage({ action: 'check' })
}

/**
 * List items with env-var tag from 1Password
 * @param {string} [vault] - Optional vault name
 */
export async function listEnvVars(vault) {
  await connect()
  return sendMessage({
    action: 'list',
    vault,
    tags: ['env-var']
  })
}

/**
 * Read a secret from 1Password
 * @param {string} reference - 1Password reference (op://vault/item/field)
 */
export async function readSecret(reference) {
  await connect()
  return sendMessage({
    action: 'read',
    reference
  })
}

/**
 * Create a new API credential in 1Password
 * @param {Object} options
 * @param {string} options.title - Item title
 * @param {string} options.credential - The API key/secret
 * @param {string} options.dashboardUrl - Provider dashboard URL
 * @param {string[]} options.tags - Tags for the item
 * @param {string} [options.vault] - Optional vault name
 * @param {string} [options.envVarName] - Suggested env var name
 */
export async function createApiCredential(options) {
  await connect()
  return sendMessage({
    action: 'create',
    ...options
  })
}

/**
 * Get item details from 1Password
 * @param {string} itemId - Item ID or name
 * @param {string} [vault] - Optional vault name
 */
export async function getItem(itemId, vault) {
  await connect()
  return sendMessage({
    action: 'get',
    itemId,
    vault
  })
}
