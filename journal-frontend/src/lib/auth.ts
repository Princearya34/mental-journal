import api from './api';
import { User, AuthResponse } from '@/types';

export const authService = {
  async register(data: { name: string; email: string; password: string; password_confirmation: string }): Promise<AuthResponse> {
    const response = await api.post('/register', data);
    return response.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await api.post('/login', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  async getMe(): Promise<User> {
    const response = await api.get('/me');
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }
};
