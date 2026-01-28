/**
 * Content script for auto-filling env vars on provider dashboards
 * Uses SelectorRegistry for community-maintained selectors with fallback
 */

// Cached selector config from registry
let selectorConfig = null

// Fallback selectors (used when registry unavailable)
const FALLBACK_SELECTORS = {
  cloudflare: {
    workers: {
      test: () => /dash\.cloudflare\.com\/[^/]+\/workers/.test(location.href),
      nameInput: 'input[name="name"], input[data-testid="variable-name"]',
      valueInput: 'input[name="value"], textarea[data-testid="variable-value"]',
      form: 'form[data-testid="add-secret-form"]'
    },
    pages: {
      test: () => /dash\.cloudflare\.com\/[^/]+\/pages/.test(location.href),
      nameInput: 'input[name="name"]',
      valueInput: 'input[name="value"], textarea[name="value"]',
      form: 'form'
    }
  },
  vercel: {
    test: () => /vercel\.com/.test(location.href),
    nameInput: 'input[name="key"], input[placeholder*="Name"]',
    valueInput: 'input[name="value"], textarea[name="value"], input[placeholder*="Value"]',
    form: 'form'
  },
  netlify: {
    test: () => /app\.netlify\.com/.test(location.href),
    nameInput: 'input[name="key"], input[id*="key"]',
    valueInput: 'textarea[name="value"], input[name="value"]',
    form: 'form'
  },
  github: {
    test: () => /github\.com\/.*\/settings\/secrets/.test(location.href),
    nameInput: '#secret_name, input[name="secret_name"]',
    valueInput: '#secret_value, textarea[name="secret_value"]',
    form: 'form'
  },
  supabase: {
    test: () => /supabase\.com\/dashboard/.test(location.href),
    readOnly: true
  }
}

/**
 * Load selectors from service worker (which uses SelectorRegistry)
 */
async function loadSelectors() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSelectors' })
    if (response?.success && response.data) {
      selectorConfig = response.data
      return true
    }
  } catch (error) {
    console.warn('Failed to load selectors from registry:', error)
  }
  return false
}

// Listen for fill commands from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillEnvVar') {
    fillEnvVar(message.envVarName, message.value)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true
  }

  if (message.action === 'getDashboardInfo') {
    const info = getDashboardInfo()
    sendResponse(info)
    return false
  }

  if (message.action === 'updateSelectors') {
    // Update cached selectors when registry updates
    selectorConfig = message.selectors
    sendResponse({ success: true })
    return false
  }
})

/**
 * Get info about current dashboard
 * First tries registry selectors, then falls back to bundled
 */
function getDashboardInfo() {
  const url = location.href

  // Try registry selectors first
  if (selectorConfig) {
    for (const [id, config] of Object.entries(selectorConfig)) {
      if (config.urlPatterns) {
        for (const pattern of config.urlPatterns) {
          if (new RegExp(pattern).test(url)) {
            return {
              dashboard: id,
              url,
              readOnly: config.readOnly || false,
              hasForm: !config.readOnly && config.selectors?.form && !!document.querySelector(config.selectors.form),
              source: 'registry'
            }
          }
        }
      }
    }
  }

  // Fall back to bundled selectors
  for (const [name, config] of Object.entries(FALLBACK_SELECTORS)) {
    if (typeof config.test === 'function' && config.test()) {
      return {
        dashboard: name,
        url,
        readOnly: config.readOnly || false,
        hasForm: !config.readOnly && !!document.querySelector(config.form),
        source: 'fallback'
      }
    }

    // Check nested configs (like cloudflare.workers, cloudflare.pages)
    for (const [subName, subConfig] of Object.entries(config)) {
      if (typeof subConfig === 'object' && typeof subConfig.test === 'function' && subConfig.test()) {
        return {
          dashboard: `${name}.${subName}`,
          url,
          readOnly: subConfig.readOnly || false,
          hasForm: !subConfig.readOnly && !!document.querySelector(subConfig.form),
          source: 'fallback'
        }
      }
    }
  }

  return { dashboard: null, url }
}

/**
 * Fill env var fields on current page
 */
async function fillEnvVar(name, value) {
  // Try to load selectors if not already loaded
  if (!selectorConfig) {
    await loadSelectors()
  }

  const dashboardInfo = getDashboardInfo()

  if (!dashboardInfo.dashboard) {
    throw new Error('Not on a supported dashboard page')
  }

  if (dashboardInfo.readOnly) {
    throw new Error('This dashboard does not support filling env vars')
  }

  const config = getConfigForDashboard(dashboardInfo)

  if (!config) {
    throw new Error(`No config for dashboard: ${dashboardInfo.dashboard}`)
  }

  // Find and fill name input
  const nameInput = document.querySelector(config.nameInput)
  if (nameInput) {
    await fillInput(nameInput, name)
  }

  // Find and fill value input
  const valueInput = document.querySelector(config.valueInput)
  if (valueInput) {
    await fillInput(valueInput, value)
  }

  if (!nameInput && !valueInput) {
    throw new Error('Could not find env var input fields on this page')
  }
}

/**
 * Get config for a dashboard identifier
 * Tries registry first, then falls back to bundled
 */
function getConfigForDashboard(dashboardInfo) {
  const dashboard = dashboardInfo.dashboard

  // Try registry selectors first
  if (dashboardInfo.source === 'registry' && selectorConfig && selectorConfig[dashboard]) {
    return selectorConfig[dashboard].selectors
  }

  // Fall back to bundled selectors
  const parts = dashboard.split('.')
  let config = FALLBACK_SELECTORS[parts[0]]

  if (parts.length > 1 && config) {
    config = config[parts[1]]
  }

  return config
}

/**
 * Fill an input with proper event simulation
 */
async function fillInput(input, value) {
  // Focus the input
  input.focus()

  // Clear existing value
  input.value = ''

  // Simulate typing (for React-controlled inputs)
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set || Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value)
  } else {
    input.value = value
  }

  // Dispatch input events
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))

  // Small delay for React to process
  await new Promise(resolve => setTimeout(resolve, 50))
}

/**
 * Create floating action button for easy access
 */
async function createFloatingButton() {
  // Try to load selectors if not already loaded
  if (!selectorConfig) {
    await loadSelectors()
  }

  const dashboardInfo = getDashboardInfo()

  if (!dashboardInfo.dashboard || dashboardInfo.readOnly) {
    return
  }

  // Check if button already exists
  if (document.getElementById('env-var-assistant-fab')) {
    return
  }

  const fab = document.createElement('button')
  fab.id = 'env-var-assistant-fab'
  fab.innerHTML = '🔑'
  fab.title = 'Env Var Assistant - Fill from 1Password'
  fab.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1a73e8;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s;
  `

  fab.addEventListener('mouseenter', () => {
    fab.style.transform = 'scale(1.1)'
    fab.style.boxShadow = '0 4px 14px rgba(0,0,0,0.4)'
  })

  fab.addEventListener('mouseleave', () => {
    fab.style.transform = 'scale(1)'
    fab.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)'
  })

  fab.addEventListener('click', () => {
    // Open popup or show menu
    chrome.runtime.sendMessage({ action: 'openPopup' })
  })

  document.body.appendChild(fab)
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton)
} else {
  createFloatingButton()
}

// Re-check on navigation (for SPAs)
let lastUrl = location.href
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href
    setTimeout(createFloatingButton, 500)
  }
}).observe(document, { subtree: true, childList: true })
