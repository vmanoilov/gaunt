import type { Provider, Secret } from './types';
import { decryptSecret } from './secrets';

export interface ConnectorResult {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Get decrypted API key for a provider
 */
export function getDecryptedApiKey(provider: Provider, secrets: Secret[]): string | null {
  const secret = secrets.find(s => s.alias === provider.apiKeyAlias);
  if (!secret) return null;

  try {
    // Assume passphrase is stored or provided - for now use empty string as fallback
    // In production, this should be securely managed
    return decryptSecret(secret.valueEncrypted, '');
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    return null;
  }
}

/**
 * Call OpenAI-compatible API
 */
export async function callOpenAICompatible(
  provider: Provider,
  model: string,
  messages: any[],
  apiKey: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<ConnectorResult> {
  try {
    const url = `${provider.baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0]?.message?.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Call Anthropic API
 */
export async function callAnthropic(
  provider: Provider,
  model: string,
  messages: any[],
  apiKey: string,
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<ConnectorResult> {
  try {
    const url = `${provider.baseUrl}/messages`;

    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        system: systemMessage?.content,
        messages: userMessages
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.content[0]?.text,
      usage: {
        promptTokens: data.usage?.input_tokens,
        completionTokens: data.usage?.output_tokens,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Generic connector function that routes to appropriate provider implementation
 */
export async function callModel(
  provider: Provider,
  model: string,
  messages: any[],
  secrets: Secret[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<ConnectorResult> {
  const apiKey = getDecryptedApiKey(provider, secrets);
  if (!apiKey) {
    return {
      success: false,
      error: 'API key not found or could not be decrypted'
    };
  }

  switch (provider.type) {
    case 'direct':
      if (provider.slug === 'anthropic') {
        return callAnthropic(provider, model, messages, apiKey, options);
      } else {
        return callOpenAICompatible(provider, model, messages, apiKey, options);
      }
    case 'openrouter':
    case 'azure':
    case 'bedrock':
      // For now, treat these as OpenAI-compatible
      return callOpenAICompatible(provider, model, messages, apiKey, options);
    default:
      return {
        success: false,
        error: `Unsupported provider type: ${provider.type}`
      };
  }
}

export const JAVASCRIPT_TEMPLATE = `// JavaScript Connector Template
// This connector will be used to call AI provider APIs

async function callModel(provider, model, messages, apiKey, options = {}) {
  /**
   * Call AI model with given parameters
   * 
   * @param {Object} provider - Provider configuration
   * @param {string} model - Model name
   * @param {Array} messages - List of message objects
   * @param {string} apiKey - API key for authentication
   * @param {Object} options - Additional parameters (temperature, maxTokens, etc.)
   * @returns {Promise<string>} Response text from the model
   */
  
  // Example implementation for OpenAI-compatible APIs
  const url = \`\${provider.baseUrl}/chat/completions\`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000
    })
  });
  
  if (!response.ok) {
    throw new Error(\`API call failed: \${response.statusText}\`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Export for use
export { callModel };
`;
