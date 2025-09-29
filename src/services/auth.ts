import { apiClient } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, MarathonId } from '@/types/user';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  // Register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/register', userData);
  },

  // Check marathon ID availability
  async checkMarathonId(marathonId: string): Promise<{ available: boolean; message?: string }> {
    return await apiClient.get<{ available: boolean; message?: string }>(`/auth/check-marathon-id/${marathonId}`);
  },

  // Get available marathon IDs
  async getAvailableMarathonIds(): Promise<MarathonId[]> {
    return await apiClient.get<MarathonId[]>('/auth/available-marathon-ids');
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    return await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh');
  },

  // Verify token
  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    return await apiClient.get<{ valid: boolean; user?: any }>('/auth/verify');
  }
};
