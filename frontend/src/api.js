/**
 * API client for the Nursing Council Agent backend.
 */

// Dynamically determine the API base URL
// In Codespaces, the frontend runs on port 5173 and backend on port 8001
// We need to swap the port in the hostname
const getApiBase = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  console.log('[Nursing Council API] Detecting environment...');
  console.log('[Nursing Council API] Hostname:', hostname);
  console.log('[Nursing Council API] Protocol:', protocol);

  // Check if running in GitHub Codespaces
  if (hostname.includes('.app.github.dev')) {
    // Codespaces URL formats:
    // 1. <codespace-name>-<port>.app.github.dev (common)
    // 2. <codespace-name>-<port>-<random>.app.github.dev (newer format)

    // Extract the codespace name (everything before the last -<port> segment)
    // and replace the port with 8001
    // Pattern: matches -<digits> at the end before .app.github.dev
    const backendHost = hostname.replace(/-\d+\.app\.github\.dev$/, '-8001.app.github.dev');
    const apiBase = `https://${backendHost}`;
    console.log('[Nursing Council API] Codespaces detected, API base:', apiBase);
    return apiBase;
  }

  // Check if running on any other dev environment with port in hostname
  if (hostname.includes(':5173') || hostname.includes('-5173')) {
    const backendHost = hostname.replace(/5173/g, '8001');
    const apiBase = `${protocol}//${backendHost}`;
    console.log('[Nursing Council API] Dev environment detected, API base:', apiBase);
    return apiBase;
  }

  // Local development fallback
  const apiBase = 'http://localhost:8001';
  console.log('[Nursing Council API] Local development, API base:', apiBase);
  return apiBase;
};

const API_BASE = getApiBase();
console.log('[Nursing Council API] Final API_BASE:', API_BASE);

export const api = {
  /**
   * List all conversations.
   */
  async listConversations() {
    const response = await fetch(`${API_BASE}/api/conversations`);
    if (!response.ok) {
      throw new Error('Failed to list conversations');
    }
    return response.json();
  },

  /**
   * Create a new conversation.
   */
  async createConversation() {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    return response.json();
  },

  /**
   * Get a specific conversation.
   */
  async getConversation(conversationId) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}`
    );
    if (!response.ok) {
      throw new Error('Failed to get conversation');
    }
    return response.json();
  },

  /**
   * Send a message in a conversation.
   */
  async sendMessage(conversationId, content) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    return response.json();
  },

  /**
   * Send a message and receive streaming updates.
   * @param {string} conversationId - The conversation ID
   * @param {string} content - The message content
   * @param {function} onEvent - Callback function for each event: (eventType, data) => void
   * @returns {Promise<void>}
   */
  async sendMessageStream(conversationId, content, onEvent) {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/message/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const event = JSON.parse(data);
            onEvent(event.type, event);
          } catch (e) {
            console.error('Failed to parse SSE event:', e);
          }
        }
      }
    }
  },
};
