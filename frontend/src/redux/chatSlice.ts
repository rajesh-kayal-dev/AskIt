import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  time: string;
  feedback?: 'like' | 'dislike' | null;
}

export interface Conversation {
  id: string;           // MongoDB _id
  title: string;
  updatedAt: string;    // ISO date string
  group: string;        // "Today" | "Previous 7 days" | "Previous 30 days" | "Older"
}

export interface SharedFile {
  name: string;
  size: string;
}

// ─── State ────────────────────────────────────────────────────────────────

interface ChatState {
  messages: Message[];
  currentConversationId: string | null;   // MongoDB _id of active conversation
  conversations: Conversation[];           // sidebar list (from backend)
  isGenerating: boolean;
  currentStreamingMessage: string;
  streamError: string | null;
  lastPrompt: string | null;
  isLoadingHistory: boolean;               // loading conversation list on login
  isLoadingMessages: boolean;              // loading messages when opening chat
  model: string;
  // Legacy fields kept for compatibility with RightPanel
  topics: string[];
  files: SharedFile[];
}

const initialState: ChatState = {
  messages: [],
  currentConversationId: null,
  conversations: [],
  isGenerating: false,
  currentStreamingMessage: '',
  streamError: null,
  lastPrompt: null,
  isLoadingHistory: false,
  isLoadingMessages: false,
  model: 'groq/gpt-oss-120b',
  topics: [],
  files: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Compute the display group for a conversation based on its updatedAt date.
 */
export const computeGroup = (updatedAt: string): string => {
  const now = new Date();
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays <= 7) return 'Previous 7 days';
  if (diffDays <= 30) return 'Previous 30 days';
  return 'Older';
};

// ─── Slice ────────────────────────────────────────────────────────────────

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ── Messages ──────────────────────────────────────────────────────────
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    updateMessageContentInState: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const msg = state.messages.find(m => m.id === action.payload.id);
      if (msg) {
        msg.content = action.payload.content;
      }
    },
    updateMessageFeedbackInState: (state, action: PayloadAction<{ id: string; feedback: 'like' | 'dislike' | null }>) => {
      const msg = state.messages.find(m => m.id === action.payload.id);
      if (msg) {
        msg.feedback = action.payload.feedback;
      }
    },

    // ── New Chat (UI reset — no DB operation) ─────────────────────────────
    startNewChat: (state) => {
      state.messages = [];
      state.currentConversationId = null;
      state.isGenerating = false;
      state.currentStreamingMessage = '';
      state.streamError = null;
      state.lastPrompt = null;
    },

    // ── Current conversation ──────────────────────────────────────────────
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },

    // ── Conversation list ─────────────────────────────────────────────────
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },

    /** Add a newly created conversation to the top of the sidebar. */
    prependConversation: (state, action: PayloadAction<Conversation>) => {
      // Remove if already exists (dedup safety)
      state.conversations = state.conversations.filter(c => c.id !== action.payload.id);
      state.conversations.unshift(action.payload);
    },

    /** Move an existing conversation to the top (after subsequent messages). */
    moveConversationToTop: (state, action: PayloadAction<string>) => {
      const idx = state.conversations.findIndex(c => c.id === action.payload);
      if (idx > 0) {
        const [conv] = state.conversations.splice(idx, 1);
        conv.updatedAt = new Date().toISOString();
        conv.group = 'Today';
        state.conversations.unshift(conv);
      }
    },

    /** Update a conversation's title after rename. */
    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const conv = state.conversations.find(c => c.id === action.payload.id);
      if (conv) conv.title = action.payload.title;
    },

    /** Remove a conversation from the sidebar after delete. */
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      // If deleted conversation was active, reset
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null;
        state.messages = [];
      }
    },

    // ── Loading states ────────────────────────────────────────────────────
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setCurrentStreamingMessage: (state, action: PayloadAction<string>) => {
      state.currentStreamingMessage = action.payload;
    },
    appendStreamingMessage: (state, action: PayloadAction<string>) => {
      state.currentStreamingMessage += action.payload;
    },
    setStreamError: (state, action: PayloadAction<string | null>) => {
      state.streamError = action.payload;
    },
    setLastPrompt: (state, action: PayloadAction<string | null>) => {
      state.lastPrompt = action.payload;
    },
    setIsLoadingHistory: (state, action: PayloadAction<boolean>) => {
      state.isLoadingHistory = action.payload;
    },
    setIsLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },

    // ── Model ─────────────────────────────────────────────────────────────
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },

    // ── Legacy (kept for compatibility) ───────────────────────────────────
    clearChat: (state) => {
      state.messages = [];
    },
    setCurrentChatId: (state, action: PayloadAction<string>) => {
      // Kept for backward compat — maps to currentConversationId
      state.currentConversationId = action.payload;
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  startNewChat,
  setCurrentConversationId,
  setConversations,
  prependConversation,
  moveConversationToTop,
  updateConversationTitle,
  removeConversation,
  setIsGenerating,
  setCurrentStreamingMessage,
  appendStreamingMessage,
  setStreamError,
  setLastPrompt,
  setIsLoadingHistory,
  setIsLoadingMessages,
  setModel,
  clearChat,
  setCurrentChatId,
  updateMessageContentInState,
  updateMessageFeedbackInState,
} = chatSlice.actions;

export default chatSlice.reducer;
