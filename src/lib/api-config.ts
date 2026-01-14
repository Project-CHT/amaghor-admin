/**
 * API Configuration for Amaghor Admin Dashboard
 * Centralized API endpoint definitions and configuration
 */

// Helper to get the base URL - works in both client and server contexts
export const getBaseURL = () => {
  // For server-side (like NextAuth), use full URL
  if (typeof window === 'undefined') {
    const url = process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/proxy`
      : 'http://localhost:3001/api/proxy';
    return url;
  }
  // For client-side, relative URL works fine
  return '/api/proxy';
};

export const API_CONFIG = {
  // Base URLs - Use BFF proxy layer instead of direct Go server  
  get BASE_URL() {
    return getBaseURL();
  },
  GO_SERVER_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090', // Actual Go server
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh',
      ME: '/auth/me',
    },

    // Admin Specific Endpoints
    ADMIN: {
      // Hotel Management
      PENDING_HOTELS: '/hotels/admin/pending',
      ALL_HOTELS: '/hotels/admin/hotels',
      VERIFY_HOTEL: (hotelId: string | number) => `/hotels/admin/${hotelId}/verify`,
      REJECT_HOTEL: (hotelId: string | number) => `/hotels/admin/${hotelId}/reject`,

      // Review Management
      PENDING_REVIEWS: '/hotels/admin/reviews/pending',
      APPROVE_REVIEW: (reviewId: string | number) => `/hotels/admin/reviews/${reviewId}/approve`,
      REJECT_REVIEW: (reviewId: string | number) => `/hotels/admin/reviews/${reviewId}/reject`,

      // Transport Management (Assuming existing endpoints from transport service)
      TRANSPORT_TYPES: '/transport/admin/types',
      VEHICLES: '/transport/admin/vehicles',
      DRIVERS: '/transport/admin/drivers',
      ROUTES: '/transport/admin/routes',

      // User Management
      USERS: '/admin/users',
      USER_DETAILS: (userId: string | number) => `/admin/users/${userId}`,
      
      // Dashboard Stats
      DASHBOARD_STATS: '/admin/dashboard/stats',
      RECENT_ACTIVITY: '/admin/dashboard/activity',
    }
  }
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
