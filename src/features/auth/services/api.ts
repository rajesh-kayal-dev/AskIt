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
    if (error.response?.status === 401) {
      localStorage.removeItem('askit_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getProfile: (): Promise<AuthResponse> =>
    api.get<AuthResponse>('/user/me').then((response) => response.data ?? { success: false }),
  logout: (): Promise<void> => api.post('/auth/logout').then(() => undefined),
};