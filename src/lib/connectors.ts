export const PYTHON_TEMPLATE = `# Python Connector Template
# This connector will be used to call AI provider APIs

def call_model(provider, model, messages, api_key, **kwargs):
    """
    Call AI model with given parameters
    
    Args:
        provider: Provider configuration
        model: Model name
        messages: List of message objects
        api_key: API key for authentication
        **kwargs: Additional parameters (temperature, max_tokens, etc.)
    
    Returns:
        Response text from the model
    """
    import requests
    
    # Example implementation for OpenAI-compatible APIs
    url = f"{provider['baseUrl']}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": kwargs.get("temperature", 0.7),
        "max_tokens": kwargs.get("max_tokens", 1000)
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    return response.json()["choices"][0]["message"]["content"]
`;

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
