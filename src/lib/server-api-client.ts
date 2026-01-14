/**
 * Server API Client for Amaghor Admin Dashboard
 * Handles all HTTP requests to the Go backend server
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, ApiResponse, getAuthHeaders, getBaseURL } from './api-config';
import { getSession } from 'next-auth/react';

class ServerApiClient {
    private client: AxiosInstance;
    private refreshPromise: Promise<string> | null = null;

    constructor() {
        const baseURL = getBaseURL();
        console.log('[ServerApiClient] Initializing with baseURL:', baseURL);

        this.client = axios.create({
            baseURL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
            validateStatus: (status) => status >= 200 && status < 300,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Authenticated by BFF proxy or NextAuth session injection
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                        window.location.href = '/auth/login?error=SessionExpired';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Token Management (Helper)
    private async getAccessToken(): Promise<string | null> {
        if (typeof window === 'undefined') return null;
        const session = await getSession();
        if (session?.accessToken) return session.accessToken;
        return null;
    }

    // Helper for error handling
    private handleError(error: any): ApiResponse {
        const message = axios.isAxiosError(error)
            ? error.response?.data?.error || error.message
            : 'An unexpected error occurred';
        return {
            success: false,
            error: { message, code: 'API_ERROR' }
        };
    }

    // Generic Methods
    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get(url, { params });
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post(url, data);
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.put(url, data);
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.delete(url);
            return { success: true, data: response.data.data || response.data };
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Admin Specific Methods
    async getDashboardStats(): Promise<ApiResponse> {
        // If endpoint not ready, return mock data for now to prevent crash
        // return { success: true, data: MOCK_STATS };
        // But we want to use the API:
        return this.get(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS);
    }
}

export const serverApi = new ServerApiClient();
export default serverApi;
