/**
 * Auth Service for Admin Portal
 * Handles authentication requests to the backend via BFF proxy
 */

import { apiClient, ApiResponse } from '@/lib/api-client';

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    /**
     * Login with email and password
     */
    async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
        console.log('AuthService: Attempting login for', payload.email);
        return apiClient.post<AuthResponse>('/auth/login', payload);
    }

    /**
     * Refresh access token
     * @param refreshToken The refresh token
     */
    async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
        return apiClient.post('/auth/refresh', { refreshToken });
    }

    /**
     * Logout the user
     */
    async logout(): Promise<ApiResponse<void>> {
        return apiClient.post('/auth/logout');
    }

    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        return apiClient.get<User>('/auth/me');
    }
}

export const authService = new AuthService();
