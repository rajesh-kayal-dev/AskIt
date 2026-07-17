import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  time: string;
}

export interface ChatSession {
  id: string;
  title: string;
  time: string;
  group: string;
  active: boolean;
}

export interface SharedFile {
  name: string;
  size: string;
}

interface ChatState {
  messages: Message[];
  currentChatId: string | null;
  chats: ChatSession[];
  topics: string[];
  files: SharedFile[];
  isGenerating: boolean;
  model: string;
}

const initialState: ChatState = {
  messages: [],
  currentChatId: 'chat-1',
  chats: [
    { id: 'chat-1', title: 'Redis Setup in Project', time: '2h ago', group: 'Today', active: true },
    { id: 'chat-2', title: 'Update AskIT Landing Page C...', time: '5h ago', group: 'Today', active: false },
    { id: 'chat-3', title: 'Replace AskIT Landing Page ...', time: 'Yesterday', group: 'Today', active: false },
    { id: 'chat-4', title: 'AI Platform Naming Suggesti...', time: '2 days ago', group: 'Previous 7 days', active: false },
    { id: 'chat-5', title: 'AI Interview Questions Curator', time: '12 days ago', group: 'Previous 30 days', active: false },
    { id: 'chat-6', title: 'Optimize Resume & Organize...', time: '15 days ago', group: 'Previous 30 days', active: false }
  ],
  topics: ['Redis', 'Session Management', 'Node.js', 'Authentication', 'Docker'],
  files: [
    { name: 'redis.config.js', size: '1.2 KB' },
    { name: 'schema.sql', size: '2.4 KB' }
  ],
  isGenerating: false,
  model: 'GPT-4o',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setCurrentChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
      state.chats = state.chats.map((chat) => ({
        ...chat,
        active: chat.id === action.payload,
      }));
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.model = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
    }
  },
});

export const {
  addMessage,
  setMessages,
  setCurrentChatId,
  setIsGenerating,
  setModel,
  clearChat
} = chatSlice.actions;

export default chatSlice.reducer;
