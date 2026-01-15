/**
 * API Client for connecting amaghor-admin to the Go backend server
 * Uses BFF (Backend for Frontend) proxy layer through Next.js API routes
 * Requests go to /api/proxy/* which then forwards to the Go server
 */

// Helper to determine the API base URL
function getBaseUrl(): string {
    // On server-side (SSR), call the Go backend directly
    if (typeof window === 'undefined') {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';
        console.log(`[API Client] Server-side request configured for: ${apiUrl}`);
        return apiUrl;
    }

    // On client-side, use the Next.js proxy
    return '/api/proxy';
}

// Base URL for API requests
const API_BASE_URL = getBaseUrl();

// Default timeout
const API_TIMEOUT = 30000;

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    message?: string;
}

export interface RequestOptions extends RequestInit {
    timeout?: number;
    token?: string; // Optional manual token override
}

/**
 * Make API request with timeout
 */
async function fetchWithTimeout(
    url: string,
    options: RequestOptions = {}
): Promise<Response> {
    const { timeout = API_TIMEOUT, token, ...fetchOptions } = options;

    const headers: Record<string, string> = {};

    // Only set Content-Type for non-FormData requests
    if (!(fetchOptions.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Merge existing headers
    if (fetchOptions.headers) {
        const existingHeaders = fetchOptions.headers as Record<string, string>;
        Object.assign(headers, existingHeaders);
    }

    // If token is explicitly provided (e.g. server-side calls without cookies)
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: headers as HeadersInit,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

/**
 * Base API client class
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || API_BASE_URL;
    }

    /**
     * GET request
     */
    async get<T = any>(
        endpoint: string,
        paramsOrOptions?: Record<string, any> | RequestOptions
    ): Promise<ApiResponse<T>> {
        try {
            let queryParams: Record<string, any> = {};
            let requestOptions: RequestOptions = {};

            if (paramsOrOptions) {
                // Check if it's params or options
                const hasParams = Object.keys(paramsOrOptions).some(
                    key => !['timeout', 'token', 'method', 'headers', 'body', 'signal', 'cache', 'next'].includes(key)
                );

                if (hasParams) {
                    queryParams = paramsOrOptions;
                } else {
                    requestOptions = paramsOrOptions as RequestOptions;
                }
            }

            // Build URL with query params
            let url = `${this.baseUrl}${endpoint}`;
            if (Object.keys(queryParams).length > 0) {
                const searchParams = new URLSearchParams();
                Object.entries(queryParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        searchParams.append(key, String(value));
                    }
                });
                url += `?${searchParams.toString()}`;
            }

            const response = await fetchWithTimeout(url, {
                method: 'GET',
                ...requestOptions,
            });

            // Handle empty responses or non-JSON responses gracefully
            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                // Fallback for non-JSON responses
                data = { message: response.statusText };
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || `Request failed with status ${response.status}`,
                        code: data.code || String(response.status),
                        details: data,
                    },
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            console.error('API GET Error:', error);
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }

    /**
     * POST request
     */
    async post<T = any>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        try {
            const isFormData = body instanceof FormData;
            const requestBody = isFormData ? body : JSON.stringify(body);

            const response = await fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                body: requestBody,
                ...options,
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: response.statusText };
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || 'Request failed',
                        code: data.code,
                        details: data,
                    },
                };
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error) {
            console.error('API POST Error:', error);
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }

    /**
     * PUT request
     */
    async put<T = any>(
        endpoint: string,
        body?: any,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                ...options,
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = {};
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || 'Request failed',
                        code: data.code,
                        details: data,
                    },
                };
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }

    /**
     * DELETE request
     */
    async delete<T = any>(
        endpoint: string,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                ...options,
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = {};
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        message: data.message || 'Request failed',
                        code: data.code,
                        details: data,
                    },
                };
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            };
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class
export default ApiClient;
