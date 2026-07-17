import axios from 'axios';
import type { Message } from '../redux/chatSlice';

const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your real backend URL when ready

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const chatService = {
  // Mock send message
  sendMessage: async (content: string, model: string): Promise<Message> => {
    // In a real app, this would be:
    // const response = await api.post('/chat/message', { content, model });
    // return response.data;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          type: 'ai',
          content: `This is a mock response from ${model} for: "${content}"\n\nIn a real app, this would connect to the backend API.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 1000);
    });
  },
};
