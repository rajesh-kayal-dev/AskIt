import axios from 'axios';
import type { Message, Conversation } from '../redux/chatSlice';
import { computeGroup } from '../redux/chatSlice';

// ─── Axios Instance ────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ─── Types ────────────────────────────────────────────────────────────────

export interface SendMessageResult {
  response: string;
  conversationId: string;
  title?: string;
  isNew: boolean;
}

export interface BackendMessage {
  _id: string;
  conversationId: string;
  role: 'user' | 'model' | 'assistant';
  content: string;
  createdAt: string;
  feedback?: 'like' | 'dislike' | null;
}

export interface BackendConversation {
  id?: string;
  _id?: string;
  uuid?: string;
  title: string;
  userId?: string;
  updatedAt: string;
  createdAt: string;
}

// ─── Conversion Helpers ───────────────────────────────────────────────────

/** Convert backend message to frontend Message format */
export const toFrontendMessage = (msg: BackendMessage): Message => ({
  id: msg._id,
  type: msg.role === 'user' ? 'user' : 'ai',
  content: msg.content,
  time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  feedback: msg.feedback || null,
});

/** Convert backend conversation to frontend Conversation format.
 * Uses uuid as the public id — never exposes MongoDB _id.
 */
export const toFrontendConversation = (conv: BackendConversation): Conversation => {
  const convId = conv.id || conv.uuid || conv._id;
  if (!convId) {
    console.error('toFrontendConversation: Missing id for conversation', conv);
  }
  return {
    id: convId as string,
    title: conv.title,
    updatedAt: conv.updatedAt,
    group: computeGroup(conv.updatedAt),
  };
};

// ─── Chat History API ──────────────────────────────────────────────────────

export const chatHistoryService = {

  /**
   * Send a message to the agent and get an AI response.
   * On first message, conversationId should be null/undefined.
   * Returns the AI response + conversationId (new or existing) + optional title.
   */
  sendMessage: async (
    prompt: string,
    conversationId: string | null
  ): Promise<SendMessageResult> => {
    const body: Record<string, unknown> = { prompt };
    if (conversationId) body.conversationId = conversationId;

    const res = await api.post('/api/agent/chat', body);
    return res.data;
  },

  /** Update an existing message content or feedback in the database. */
  updateMessageContent: async (messageId: string, content?: string, feedback?: 'like' | 'dislike' | null): Promise<any> => {
    const body: Record<string, any> = {};
    if (content !== undefined) body.content = content;
    if (feedback !== undefined) body.feedback = feedback;
    const res = await api.put(`/api/chat/message/${messageId}`, body);
    return res.data;
  },

  /**
   * Stream a message to the agent using Server-Sent Events.
   */
  streamMessage: async function* (
    prompt: string,
    conversationId: string | null,
    signal: AbortSignal,
    messageId: string | null = null
  ): AsyncGenerator<{ event: string; data: any }> {
    const body: Record<string, unknown> = { prompt };
    if (conversationId) body.conversationId = conversationId;
    if (messageId) body.messageId = messageId;

    const response = await fetch(`${API_BASE_URL}/api/agent/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
      signal
    });

    if (!response.body) throw new Error("ReadableStream not supported in this browser.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      buffer += decodedChunk;
      const lines = buffer.split('\n\n');

      buffer = lines.pop() || ""; // Keep the incomplete chunk in buffer

      for (const block of lines) {
        if (!block.trim()) continue;
        
        const eventMatch = block.match(/event:\s*(.+)/);
        const dataMatch = block.match(/data:\s*(.+)/);
        
        if (eventMatch && dataMatch) {
            try {
                const eventName = eventMatch[1].trim();
                yield { 
                    event: eventName, 
                    data: JSON.parse(dataMatch[1].trim()) 
                };
            } catch (e) {
                console.error("[API Stream] SSE parse error", e, block);
            }
        } else {
            console.warn("[API Stream] Failed to match event/data in block:", block);
        }
      }
    }
  },

  /**
   * Load all conversations for the current user (for sidebar on login).
   */
  getConversations: async (): Promise<Conversation[]> => {
    const res = await api.get('/api/chat/');
    const list: BackendConversation[] = res.data.conversations || [];
    return list.map(toFrontendConversation);
  },

  /**
   * Load all messages for a specific conversation (when opening from sidebar).
   * Now uses UUID. Kept for backward compatibility.
   */
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const res = await api.get(`/api/chat/message/${conversationId}`);
    const list: BackendMessage[] = res.data.messages || [];
    console.log(`\n\n[API] getMessages raw response length: ${list.length}`);
    list.forEach((m, i) => {
        console.log(`[API] Message ${i + 1}: Role=${m.role}, Content length=${m.content?.length}`);
    });
    const frontendMessages = list.map(toFrontendMessage);
    console.log(`[API] getMessages frontend mapped length: ${frontendMessages.length}`);
    return frontendMessages;
  },

  /**
   * Unified hydration endpoint: load conversation metadata + all messages in one request.
   * Used by ChatPage on mount when a UUID is present in the URL.
   */
  getConversationWithMessages: async (uuid: string): Promise<{ conversation: Conversation; messages: Message[] }> => {
    const res = await api.get(`/api/chat/${uuid}`);
    const { conversation: rawConv, messages: rawMessages } = res.data;
    return {
      conversation: toFrontendConversation(rawConv),
      messages: (rawMessages as BackendMessage[]).map(toFrontendMessage),
    };
  },

  /**
   * Rename a conversation.
   */
  renameConversation: async (id: string, title: string): Promise<void> => {
    await api.put(`/api/chat/${id}`, { title });
  },

  /**
   * Delete a conversation and all its messages.
   */
  deleteConversation: async (id: string): Promise<void> => {
    await api.delete(`/api/chat/${id}`);
  },
};
