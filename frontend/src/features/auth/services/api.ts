import axios from 'axios';
import type { AuthResponse } from '../types/auth.types.js';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('askit_token') || document.cookie
    .split('; ')
    .find((row) => row.startsWith('jwt_token='))
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('askit_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getProfile: (): Promise<AuthResponse> =>
    api.get('/me').then((res: unknown) => {
      const user = res as Record<string, unknown>;
      if (user && (user.userId || user._id || user.email)) {
        return { success: true, data: { user } as any };
      }
      return { success: false };
    }).catch(() => ({ success: false })),
  logout: (): Promise<void> => api.post('/auth/logout').then(() => undefined),
};