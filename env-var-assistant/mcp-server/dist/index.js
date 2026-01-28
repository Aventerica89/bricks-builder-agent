#!/usr/bin/env node
/**
 * MCP Server for Env Var Assistant
 * Exposes 1Password operations as tools for Claude
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { execFileSync } from 'child_process';
// 1Password CLI path (Chrome extension uses the same path)
const OP_PATH = '/opt/homebrew/bin/op';
// Default vault and tags
const DEFAULT_VAULT = 'Private';
const ENV_VAR_TAG = 'env-var';
const PLATFORMS = {
    vercel: {
        name: 'Vercel',
        cli: 'vercel',
        checkCommand: ['vercel', '--version'],
        environments: ['production', 'preview', 'development'],
        deployCommand: (envName, value, options) => {
            const args = ['env', 'add', envName];
            if (options.environment) {
                args.push(options.environment);
            }
            if (options.project) {
                args.push('--project', options.project);
            }
            return args;
        }
    },
    netlify: {
        name: 'Netlify',
        cli: 'netlify',
        checkCommand: ['netlify', '--version'],
        deployCommand: (envName, value, options) => {
            const args = ['env:set', envName, value];
            if (options.project) {
                args.push('--site', options.project);
            }
            return args;
        }
    },
    cloudflare: {
        name: 'Cloudflare Workers',
        cli: 'wrangler',
        checkCommand: ['wrangler', '--version'],
        deployCommand: (envName, value, options) => {
            const args = ['secret', 'put', envName];
            if (options.project) {
                args.push('--name', options.project);
            }
            return args;
        }
    },
    github: {
        name: 'GitHub Actions',
        cli: 'gh',
        checkCommand: ['gh', '--version'],
        deployCommand: (envName, value, options) => {
            const args = ['secret', 'set', envName];
            if (options.repo) {
                args.push('--repo', options.repo);
            }
            return args;
        }
    },
    railway: {
        name: 'Railway',
        cli: 'railway',
        checkCommand: ['railway', '--version'],
        deployCommand: (envName, value, options) => {
            return ['variables', 'set', `${envName}=${value}`];
        }
    },
    fly: {
        name: 'Fly.io',
        cli: 'fly',
        checkCommand: ['fly', 'version'],
        deployCommand: (envName, value, options) => {
            const args = ['secrets', 'set', `${envName}=${value}`];
            if (options.project) {
                args.push('--app', options.project);
            }
            return args;
        }
    }
};
/**
 * Execute 1Password CLI command
 */
function opCommand(args) {
    try {
        const result = execFileSync(OP_PATH, args, {
            encoding: 'utf8',
            timeout: 30000,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return result.trim();
    }
    catch (error) {
        const execError = error;
        if (execError.stderr) {
            throw new Error(execError.stderr.trim());
        }
        if (execError.message) {
            throw new Error(execError.message);
        }
        throw error;
    }
}
/**
 * Store an API key to 1Password
 */
function storeApiKey(params) {
    const { service, key, envVarName, dashboardUrl, vault = DEFAULT_VAULT, tags = [] } = params;
    const title = envVarName || `${service} API Key`;
    const allTags = [ENV_VAR_TAG, service.toLowerCase(), ...tags];
    const args = [
        'item', 'create',
        '--category=API Credential',
        `--title=${title}`,
        `--vault=${vault}`,
        `--tags=${allTags.join(',')}`,
        `credential=${key}`
    ];
    if (envVarName) {
        args.push(`env_var_name=${envVarName}`);
    }
    if (dashboardUrl) {
        args.push(`dashboard_url=${dashboardUrl}`);
    }
    args.push('--format=json');
    const result = opCommand(args);
    const item = JSON.parse(result);
    return {
        id: item.id,
        title: item.title,
        vault: item.vault?.name || vault
    };
}
/**
 * List API keys from 1Password
 */
function listApiKeys(params) {
    const { provider, vault } = params;
    const args = ['item', 'list', `--tags=${ENV_VAR_TAG}`, '--format=json'];
    if (vault) {
        args.push(`--vault=${vault}`);
    }
    if (provider) {
        args.push(`--tags=${provider.toLowerCase()}`);
    }
    const result = opCommand(args);
    if (!result) {
        return [];
    }
    const items = JSON.parse(result);
    return items.map((item) => ({
        id: item.id,
        title: item.title,
        vault: item.vault?.name || DEFAULT_VAULT,
        tags: item.tags || []
    }));
}
/**
 * Get an API key value from 1Password
 */
function getApiKey(params) {
    const { itemId, vault = DEFAULT_VAULT } = params;
    // First get item details
    const getArgs = ['item', 'get', itemId, '--format=json'];
    if (vault) {
        getArgs.push(`--vault=${vault}`);
    }
    const itemResult = opCommand(getArgs);
    const item = JSON.parse(itemResult);
    // Read the credential field
    const readArgs = ['read', `op://${vault}/${itemId}/credential`];
    const value = opCommand(readArgs);
    return {
        value,
        title: item.title
    };
}
/**
 * Add a token to an existing 1Password item
 */
function addTokenToExisting(params) {
    const { itemId, fieldName, fieldValue, vault, section } = params;
    // Validate item ID
    if (!itemId || !/^[a-zA-Z0-9-]+$/.test(itemId)) {
        throw new Error('Invalid item ID format');
    }
    // Validate field name
    if (!fieldName || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(fieldName)) {
        throw new Error('Invalid field name format');
    }
    const args = ['item', 'edit', itemId];
    if (vault) {
        args.push(`--vault=${vault}`);
    }
    // Build field assignment
    const fieldPath = section ? `${section}.${fieldName}` : fieldName;
    args.push(`${fieldPath}=${fieldValue}`);
    args.push('--format=json');
    const result = opCommand(args);
    const item = JSON.parse(result);
    return {
        id: item.id,
        title: item.title
    };
}
/**
 * Check if a CLI tool is available
 */
function checkCliAvailable(cli, checkCommand) {
    try {
        execFileSync(checkCommand[0], checkCommand.slice(1), {
            encoding: 'utf8',
            timeout: 5000,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Deploy environment variables to a platform
 */
function deployEnvVars(params) {
    const { platform, envVars, environment, project, repo, vault = DEFAULT_VAULT } = params;
    const platformConfig = PLATFORMS[platform];
    if (!platformConfig) {
        throw new Error(`Unsupported platform: ${platform}. Supported: ${Object.keys(PLATFORMS).join(', ')}`);
    }
    // Check CLI is available
    if (!checkCliAvailable(platformConfig.cli, platformConfig.checkCommand)) {
        throw new Error(`${platformConfig.cli} CLI not found. Install it first: https://vercel.com/docs/cli (or equivalent for ${platformConfig.name})`);
    }
    const deployed = [];
    const options = { environment, project, repo };
    for (const envVar of envVars) {
        try {
            // Get value from 1Password if itemId provided
            let value = envVar.value;
            if (!value && envVar.itemId) {
                const keyResult = getApiKey({ itemId: envVar.itemId, vault });
                value = keyResult.value;
            }
            if (!value) {
                deployed.push({ name: envVar.name, success: false, error: 'No value provided or found' });
                continue;
            }
            const cmdArgs = platformConfig.deployCommand(envVar.name, value, options);
            // Handle platforms that need value via stdin (Vercel, Cloudflare)
            if (platform === 'vercel' || platform === 'cloudflare') {
                execFileSync(cmdArgs[0], cmdArgs.slice(1), {
                    encoding: 'utf8',
                    timeout: 30000,
                    input: value,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
            }
            else if (platform === 'github') {
                // GitHub needs value via stdin with --body flag or env var
                execFileSync(cmdArgs[0], [...cmdArgs.slice(1), '--body', value], {
                    encoding: 'utf8',
                    timeout: 30000,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
            }
            else {
                execFileSync(cmdArgs[0], cmdArgs.slice(1), {
                    encoding: 'utf8',
                    timeout: 30000,
                    stdio: ['pipe', 'pipe', 'pipe']
                });
            }
            deployed.push({ name: envVar.name, success: true });
        }
        catch (error) {
            const execError = error;
            const errorMsg = execError.stderr?.trim() || execError.message || 'Unknown error';
            deployed.push({ name: envVar.name, success: false, error: errorMsg });
        }
    }
    const successCount = deployed.filter(d => d.success).length;
    const summary = `Deployed ${successCount}/${deployed.length} env vars to ${platformConfig.name}`;
    return { platform: platformConfig.name, deployed, summary };
}
/**
 * List available platforms and their CLI status
 */
function listPlatforms() {
    return Object.entries(PLATFORMS).map(([id, config]) => ({
        id,
        name: config.name,
        cli: config.cli,
        available: checkCliAvailable(config.cli, config.checkCommand),
        environments: config.environments
    }));
}
/**
 * Search for existing items
 */
function searchItems(params) {
    const { query, tags = [ENV_VAR_TAG], vault } = params;
    const args = ['item', 'list', '--format=json'];
    if (vault) {
        args.push(`--vault=${vault}`);
    }
    if (tags.length > 0) {
        args.push(`--tags=${tags.join(',')}`);
    }
    const result = opCommand(args);
    if (!result) {
        return [];
    }
    let items = JSON.parse(result);
    // Filter by query if provided
    if (query) {
        const queryLower = query.toLowerCase();
        items = items.filter((item) => item.title.toLowerCase().includes(queryLower));
    }
    return items.map((item) => ({
        id: item.id,
        title: item.title,
        vault: item.vault?.name || DEFAULT_VAULT
    }));
}
// Define available tools
const tools = [
    {
        name: 'store_api_key',
        description: 'Store an API key securely in 1Password. Creates a new API Credential item with the key, optional environment variable name, and dashboard URL.',
        inputSchema: {
            type: 'object',
            properties: {
                service: {
                    type: 'string',
                    description: 'Service name (e.g., "Cloudflare", "OpenAI", "Stripe")'
                },
                key: {
                    type: 'string',
                    description: 'The API key value to store'
                },
                envVarName: {
                    type: 'string',
                    description: 'Environment variable name (e.g., OPENAI_API_KEY). Used as the item title if provided.'
                },
                dashboardUrl: {
                    type: 'string',
                    description: 'URL to the dashboard where this key can be managed'
                },
                vault: {
                    type: 'string',
                    description: 'Vault name (defaults to "Private")'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Additional tags to apply (env-var and service name are added automatically)'
                }
            },
            required: ['service', 'key']
        }
    },
    {
        name: 'list_api_keys',
        description: 'List stored API keys from 1Password. Can filter by provider/service name.',
        inputSchema: {
            type: 'object',
            properties: {
                provider: {
                    type: 'string',
                    description: 'Filter by provider tag (e.g., "openai", "cloudflare")'
                },
                vault: {
                    type: 'string',
                    description: 'Vault name to search in'
                }
            }
        }
    },
    {
        name: 'get_api_key',
        description: 'Retrieve a specific API key value from 1Password by item ID or title.',
        inputSchema: {
            type: 'object',
            properties: {
                itemId: {
                    type: 'string',
                    description: 'Item ID or title to retrieve'
                },
                vault: {
                    type: 'string',
                    description: 'Vault name (defaults to "Private")'
                }
            },
            required: ['itemId']
        }
    },
    {
        name: 'add_token_to_existing',
        description: 'Add a new token/field to an existing 1Password item. Useful for adding additional API tokens to an existing service entry.',
        inputSchema: {
            type: 'object',
            properties: {
                itemId: {
                    type: 'string',
                    description: 'Existing item ID to update'
                },
                fieldName: {
                    type: 'string',
                    description: 'Name for the new field (e.g., "api_token", "refresh_token")'
                },
                fieldValue: {
                    type: 'string',
                    description: 'The token/value to store'
                },
                vault: {
                    type: 'string',
                    description: 'Vault name'
                },
                section: {
                    type: 'string',
                    description: 'Optional section name to place the field in'
                }
            },
            required: ['itemId', 'fieldName', 'fieldValue']
        }
    },
    {
        name: 'search_items',
        description: 'Search for existing 1Password items by title. Useful for finding items to add tokens to.',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'Search query for item title'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags to filter by (defaults to env-var)'
                },
                vault: {
                    type: 'string',
                    description: 'Vault name'
                }
            }
        }
    },
    {
        name: 'deploy_env_vars',
        description: 'Deploy environment variables from 1Password to a platform (Vercel, Netlify, Cloudflare Workers, GitHub Actions, Railway, Fly.io). Retrieves keys from 1Password and sets them via the platform CLI.',
        inputSchema: {
            type: 'object',
            properties: {
                platform: {
                    type: 'string',
                    enum: ['vercel', 'netlify', 'cloudflare', 'github', 'railway', 'fly'],
                    description: 'Target platform to deploy to'
                },
                envVars: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Environment variable name (e.g., OPENAI_API_KEY)'
                            },
                            itemId: {
                                type: 'string',
                                description: '1Password item ID or title to get value from'
                            },
                            value: {
                                type: 'string',
                                description: 'Direct value (if not using 1Password)'
                            }
                        },
                        required: ['name']
                    },
                    description: 'List of environment variables to deploy. Each needs either itemId (to fetch from 1Password) or value (direct).'
                },
                environment: {
                    type: 'string',
                    description: 'Target environment (e.g., "production", "preview" for Vercel)'
                },
                project: {
                    type: 'string',
                    description: 'Project name/ID (for Vercel, Netlify, Cloudflare, Fly)'
                },
                repo: {
                    type: 'string',
                    description: 'Repository (for GitHub, e.g., "owner/repo")'
                },
                vault: {
                    type: 'string',
                    description: '1Password vault to read from'
                }
            },
            required: ['platform', 'envVars']
        }
    },
    {
        name: 'list_platforms',
        description: 'List supported deployment platforms and check which CLIs are installed.',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];
// Create and configure server
const server = new Server({
    name: 'env-var-assistant',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            case 'store_api_key':
                result = storeApiKey(args);
                break;
            case 'list_api_keys':
                result = listApiKeys(args);
                break;
            case 'get_api_key':
                result = getApiKey(args);
                break;
            case 'add_token_to_existing':
                result = addTokenToExisting(args);
                break;
            case 'search_items':
                result = searchItems(args);
                break;
            case 'deploy_env_vars':
                result = deployEnvVars(args);
                break;
            case 'list_platforms':
                result = listPlatforms();
                break;
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${message}`
                }
            ],
            isError: true
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Env Var Assistant MCP server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map