/**
 * Service Worker - Background script for Env Var Assistant
 */

import { detectApiKeys, isLikelyRealKey } from './lib/patterns.js'
import { suggestEnvVarName } from './lib/dashboards.js'
import { selectorRegistry } from './lib/selector-registry.js'
import * as native from './lib/native-messaging.js'

// State
let clipboardCheckInterval = null
let lastClipboardContent = ''

/**
 * Initialize extension
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Env Var Assistant installed')

  // Set default settings
  const settings = await chrome.storage.local.get('settings')
  if (!settings.settings) {
    await chrome.storage.local.set({
      settings: {
        clipboardMonitoring: true,
        defaultVault: null,
        autoFill: true
      }
    })
  }

  // Load selector registry
  try {
    await selectorRegistry.load()
    console.log('Selector registry loaded, version:', selectorRegistry.getVersion())
  } catch (error) {
    console.warn('Failed to load selector registry:', error)
  }
})

// Also load on service worker startup (for when it restarts)
selectorRegistry.load().catch(error => {
  console.warn('Failed to load selector registry on startup:', error)
})

/**
 * Handle messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch(error => sendResponse({ success: false, error: error.message }))

  return true // Keep channel open for async response
})

async function handleMessage(message, sender) {
  switch (message.action) {
    case 'checkConnection':
      return checkConnection()

    case 'listEnvVars':
      return listEnvVars(message.vault)

    case 'readSecret':
      return readSecret(message.reference)

    case 'saveDetected':
      return saveDetectedKey(message.detected, message.vault)

    case 'checkClipboard':
      return checkClipboard()

    case 'getSettings':
      return getSettings()

    case 'updateSettings':
      return updateSettings(message.settings)

    case 'fillEnvVar':
      return fillEnvVar(message.tabId, message.envVarName, message.value)

    case 'getItem':
      return getItemDetails(message.itemId, message.vault)

    case 'searchItems':
      return searchExistingItems(message.query, message.tags, message.vault)

    case 'addToExistingItem':
      return addToExistingItem(
        message.itemId,
        message.fieldName,
        message.fieldValue,
        message.vault,
        message.section
      )

    case 'getSelectors':
      return getSelectors()

    case 'refreshSelectors':
      return refreshSelectors()

    default:
      throw new Error(`Unknown action: ${message.action}`)
  }
}

/**
 * Check connection to native host and 1Password CLI
 */
async function checkConnection() {
  try {
    const result = await native.checkOpCli()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * List env vars from 1Password
 */
async function listEnvVars(vault) {
  try {
    const items = await native.listEnvVars(vault)
    return { success: true, data: items }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Read a secret from 1Password
 */
async function readSecret(reference) {
  try {
    const value = await native.readSecret(reference)
    return { success: true, data: value }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Save a detected API key to 1Password
 */
async function saveDetectedKey(detected, vault) {
  try {
    // Use provided envVarName or fall back to suggested name
    const envVarName = detected.envVarName || suggestEnvVarName(detected.provider)
    // Use envVarName as title if it looks better than the generic name
    const title = detected.envVarName || detected.name

    const result = await native.createApiCredential({
      title,
      credential: detected.value,
      dashboardUrl: detected.dashboardUrl,
      sourceUrl: detected.sourceUrl,
      tags: detected.tags,
      vault,
      envVarName
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Check clipboard for API keys
 */
async function checkClipboard() {
  try {
    // We need to ask content script to read clipboard
    // since service workers don't have direct clipboard access
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab?.id) {
      return { success: false, error: 'No active tab' }
    }

    const response = await chrome.tabs.sendMessage(tab.id, { action: 'readClipboard' })

    if (!response?.text) {
      return { success: true, data: null }
    }

    if (response.text === lastClipboardContent) {
      return { success: true, data: null }
    }

    lastClipboardContent = response.text
    const detected = detectApiKeys(response.text, tab.url)

    // Filter out placeholder keys
    const realKeys = detected.filter(k => isLikelyRealKey(k.value))

    if (realKeys.length > 0) {
      // Show notification for detected keys
      await showDetectionNotification(realKeys)
      return { success: true, data: realKeys }
    }

    return { success: true, data: null }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Show notification for detected API keys
 */
async function showDetectionNotification(detected) {
  const key = detected[0]

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: 'API Key Detected',
    message: `${key.name} detected in clipboard. Click to save to 1Password.`,
    buttons: [{ title: 'Save to 1Password' }],
    requireInteraction: true
  })

  // Store detected key for when notification is clicked
  await chrome.storage.session.set({ pendingDetection: detected })
}

/**
 * Handle notification button clicks
 */
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Save to 1Password clicked
    const { pendingDetection } = await chrome.storage.session.get('pendingDetection')

    if (pendingDetection?.length > 0) {
      const settings = await getSettings()
      await saveDetectedKey(pendingDetection[0], settings.data?.defaultVault)
      await chrome.storage.session.remove('pendingDetection')

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Saved to 1Password',
        message: `${pendingDetection[0].name} has been saved.`
      })
    }
  }

  chrome.notifications.clear(notificationId)
})

/**
 * Get settings from storage
 */
async function getSettings() {
  const { settings } = await chrome.storage.local.get('settings')
  return { success: true, data: settings }
}

/**
 * Update settings
 */
async function updateSettings(newSettings) {
  const { settings } = await chrome.storage.local.get('settings')
  const merged = { ...settings, ...newSettings }
  await chrome.storage.local.set({ settings: merged })
  return { success: true, data: merged }
}

/**
 * Fill env var in a tab
 */
async function fillEnvVar(tabId, envVarName, value) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'fillEnvVar',
      envVarName,
      value
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get item details from 1Password
 */
async function getItemDetails(itemId, vault) {
  try {
    const item = await native.getItem(itemId, vault)
    return { success: true, data: item }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Search for existing items by query and/or tags
 */
async function searchExistingItems(query, tags, vault) {
  try {
    const items = await native.searchItems({ query, tags, vault })
    return { success: true, data: items }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Add a field to an existing 1Password item
 */
async function addToExistingItem(itemId, fieldName, fieldValue, vault, section) {
  try {
    const result = await native.updateItemField({
      itemId,
      fieldName,
      fieldValue,
      vault,
      section
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get dashboard selectors from registry
 */
async function getSelectors() {
  try {
    // Ensure registry is loaded
    if (!selectorRegistry.loaded) {
      await selectorRegistry.load()
    }

    // Convert registry to format suitable for content script
    const selectors = {}
    for (const provider of selectorRegistry.getAllProviders()) {
      selectors[provider.id] = {
        name: provider.name,
        urlPatterns: provider.urlPatterns.map(p => p.source), // Convert RegExp to string
        selectors: provider.selectors,
        readOnly: provider.readOnly
      }
    }

    return {
      success: true,
      data: selectors,
      version: selectorRegistry.getVersion()
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Force refresh selectors from remote
 */
async function refreshSelectors() {
  try {
    await selectorRegistry.clearCache()
    await selectorRegistry.load()
    return {
      success: true,
      version: selectorRegistry.getVersion()
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
