/**
 * Native messaging wrapper for Safari - communicates with 1Password CLI
 * via the app extension's SafariWebExtensionHandler
 */

// Safari uses browser.runtime.sendNativeMessage for native messaging
// The application ID is the bundle identifier of the containing app
const APP_ID = 'com.envvar.assistant'

/**
 * Send message to native handler and wait for response
 */
function sendNativeMessage(message) {
  return new Promise((resolve, reject) => {
    // Use browser API (Safari standard) with chrome fallback
    const api = typeof browser !== 'undefined' ? browser : chrome

    try {
      api.runtime.sendNativeMessage(APP_ID, message, (response) => {
        // Check for runtime errors
        const lastError = api.runtime.lastError
        if (lastError) {
          reject(new Error(lastError.message || 'Native messaging error'))
          return
        }

        if (!response) {
          reject(new Error('No response from native handler'))
          return
        }

        if (response.success) {
          resolve(response.data)
        } else {
          reject(new Error(response.error || 'Unknown error'))
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Connect - no-op for Safari (connection is per-message)
 */
export function connect() {
  return Promise.resolve(true)
}

/**
 * Disconnect - no-op for Safari
 */
export function disconnect() {
  // No persistent connection in Safari
}

/**
 * Check if 1Password CLI is available
 */
export async function checkOpCli() {
  return sendNativeMessage({ action: 'check' })
}

/**
 * List items with env-var tag from 1Password
 * @param {string} [vault] - Optional vault name
 */
export async function listEnvVars(vault) {
  return sendNativeMessage({
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
  return sendNativeMessage({
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
 * @param {string} [options.sourceUrl] - Source URL where key was copied
 * @param {string} [options.project] - Project name
 */
export async function createApiCredential(options) {
  return sendNativeMessage({
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
  return sendNativeMessage({
    action: 'get',
    itemId,
    vault
  })
}

/**
 * Search items by title or tags
 * @param {Object} options
 * @param {string} [options.query] - Search query for title
 * @param {string[]} [options.tags] - Tags to filter by
 * @param {string} [options.vault] - Optional vault name
 */
export async function searchItems({ query, tags, vault }) {
  return sendNativeMessage({
    action: 'search',
    query,
    tags,
    vault
  })
}

/**
 * Update an existing item by adding or modifying a field
 * @param {Object} options
 * @param {string} options.itemId - Item ID
 * @param {string} options.fieldName - Field name to add/update
 * @param {string} options.fieldValue - Field value
 * @param {string} [options.vault] - Optional vault name
 * @param {string} [options.section] - Optional section name
 */
export async function updateItemField({ itemId, fieldName, fieldValue, vault, section }) {
  return sendNativeMessage({
    action: 'updateField',
    itemId,
    fieldName,
    fieldValue,
    vault,
    section
  })
}
