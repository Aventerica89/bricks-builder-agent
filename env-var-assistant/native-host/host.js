#!/usr/local/bin/node

/**
 * Native Messaging Host for Env Var Assistant
 * Communicates with Chrome extension and executes 1Password CLI commands
 */

const { execFileSync } = require('child_process')

// Buffer for accumulating stdin data
let inputBuffer = Buffer.alloc(0)
let expectedLength = null

/**
 * Process incoming data from stdin
 */
function processInput(data) {
  // Append new data to buffer
  inputBuffer = Buffer.concat([inputBuffer, data])

  // Process all complete messages in buffer
  while (true) {
    // If we don't know the message length yet, try to read it
    if (expectedLength === null) {
      if (inputBuffer.length < 4) {
        return // Need more data for length prefix
      }
      expectedLength = inputBuffer.readUInt32LE(0)
      inputBuffer = inputBuffer.slice(4)
    }

    // Check if we have the complete message
    if (inputBuffer.length < expectedLength) {
      return // Need more data for message body
    }

    // Extract and parse the message
    const messageData = inputBuffer.slice(0, expectedLength)
    inputBuffer = inputBuffer.slice(expectedLength)
    expectedLength = null

    try {
      const message = JSON.parse(messageData.toString('utf8'))
      handleMessage(message)
    } catch (error) {
      sendError(0, `Failed to parse message: ${error.message}`)
    }
  }
}

/**
 * Write a message to stdout (Chrome native messaging protocol)
 */
function writeMessage(message) {
  const messageString = JSON.stringify(message)
  const messageBuffer = Buffer.from(messageString, 'utf8')
  const lengthBuffer = Buffer.alloc(4)
  lengthBuffer.writeUInt32LE(messageBuffer.length, 0)

  process.stdout.write(lengthBuffer)
  process.stdout.write(messageBuffer)
}

/**
 * Send success response
 */
function sendSuccess(id, data) {
  writeMessage({ id, success: true, data })
}

/**
 * Send error response
 */
function sendError(id, error) {
  writeMessage({ id, success: false, error: String(error) })
}

// Full path to 1Password CLI (Chrome doesn't inherit shell PATH)
const OP_PATH = '/opt/homebrew/bin/op'

/**
 * Execute 1Password CLI command
 * Uses execFileSync to properly handle arguments with spaces
 */
function opCommand(args) {
  try {
    const result = execFileSync(OP_PATH, args, {
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return result.trim()
  } catch (error) {
    if (error.stderr) {
      throw new Error(error.stderr.trim())
    }
    if (error.message) {
      throw new Error(error.message)
    }
    throw error
  }
}

/**
 * Check if 1Password CLI is available and authenticated
 */
function checkOp() {
  const version = opCommand(['--version'])
  // Try listing vaults to verify authentication
  opCommand(['vault', 'list', '--format=json'])
  return { version, authenticated: true }
}

/**
 * List items with specified tags
 */
function listItems(vault, tags) {
  const args = ['item', 'list', '--format=json']

  if (vault) {
    args.push(`--vault=${vault}`)
  }

  if (tags && tags.length > 0) {
    args.push(`--tags=${tags.join(',')}`)
  }

  const result = opCommand(args)

  if (!result) {
    return []
  }

  const items = JSON.parse(result)

  return items.map(item => ({
    id: item.id,
    title: item.title,
    vault: item.vault?.name,
    category: item.category,
    reference: `op://${item.vault?.name || 'Private'}/${item.title}/credential`
  }))
}

/**
 * Read a secret from 1Password
 */
function readSecret(reference) {
  const args = ['read', reference]
  return opCommand(args)
}

/**
 * Create a new API credential item
 */
function createApiCredential(options) {
  const { title, credential, dashboardUrl, tags, vault, envVarName } = options

  const args = [
    'item', 'create',
    '--category=API Credential',
    `--title=${title}`
  ]

  if (vault) {
    args.push(`--vault=${vault}`)
  }

  if (tags && tags.length > 0) {
    args.push(`--tags=${tags.join(',')}`)
  }

  // Add fields
  args.push(`credential=${credential}`)

  if (dashboardUrl) {
    args.push(`dashboard_url=${dashboardUrl}`)
  }

  if (envVarName) {
    args.push(`env_var_name=${envVarName}`)
  }

  args.push('--format=json')

  const result = opCommand(args)
  const item = JSON.parse(result)

  return {
    id: item.id,
    title: item.title,
    vault: item.vault?.name
  }
}

/**
 * Get item details
 */
function getItem(itemId, vault) {
  const args = ['item', 'get', itemId, '--format=json']

  if (vault) {
    args.push(`--vault=${vault}`)
  }

  const result = opCommand(args)
  return JSON.parse(result)
}

/**
 * Handle incoming message
 */
function handleMessage(message) {
  const { id, action, ...params } = message

  try {
    let result

    switch (action) {
      case 'ping':
        result = { pong: true }
        break

      case 'check':
        result = checkOp()
        break

      case 'list':
        result = listItems(params.vault, params.tags)
        break

      case 'read':
        result = readSecret(params.reference)
        break

      case 'create':
        result = createApiCredential(params)
        break

      case 'get':
        result = getItem(params.itemId, params.vault)
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    sendSuccess(id, result)
  } catch (error) {
    sendError(id, error.message)
  }
}

// Set up stdin for binary reading
process.stdin.on('data', processInput)

process.stdin.on('end', () => {
  process.exit(0)
})

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  sendError(0, `Uncaught exception: ${error.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  sendError(0, `Unhandled rejection: ${reason}`)
  process.exit(1)
})
