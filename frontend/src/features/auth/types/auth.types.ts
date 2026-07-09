export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  credits: number;
  plan: 'free' | 'starter' | 'pro';
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token?: string;
  };
  message?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}