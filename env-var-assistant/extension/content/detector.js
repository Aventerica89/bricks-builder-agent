/**
 * Content script for clipboard reading and API key detection
 */

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'readClipboard') {
    readClipboard()
      .then(text => sendResponse({ text }))
      .catch(error => sendResponse({ error: error.message }))
    return true
  }
})

/**
 * Read clipboard text
 * Must be called from a user gesture context
 */
async function readClipboard() {
  try {
    // Check if we have focus
    if (!document.hasFocus()) {
      return null
    }

    // Try using Clipboard API
    if (navigator.clipboard?.readText) {
      const text = await navigator.clipboard.readText()
      return text
    }

    // Fallback: create temporary input
    const input = document.createElement('textarea')
    input.style.position = 'fixed'
    input.style.top = '-9999px'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.focus()

    const success = document.execCommand('paste')
    const text = success ? input.value : null

    document.body.removeChild(input)
    return text
  } catch (error) {
    console.error('Failed to read clipboard:', error)
    return null
  }
}

/**
 * Watch for paste events to detect API keys
 */
document.addEventListener('paste', (event) => {
  const text = event.clipboardData?.getData('text')
  if (text) {
    // Notify service worker about paste
    chrome.runtime.sendMessage({
      action: 'checkClipboard'
    }).catch(() => {
      // Ignore errors (extension context might be invalid)
    })
  }
})
