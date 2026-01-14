import { apiClient, ApiResponse } from '@/lib/api-client';

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalBookings: number;
    totalRevenue: number;
    websiteViews: number;
    systemHealth: number;
    totalPackages: number;
    pendingApprovals: number;
    unreadMessages: number;
    totalTransportBookings: number;
    activeTransportBookings: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinedDate: string;
    lastLogin: string;
    avatar?: string;
    phone?: string;
}

const mapAdminStatsToCamel = (data: any): AdminStats => {
    return {
        totalUsers: data.total_users || data.totalUsers || 0,
        activeUsers: data.active_users || data.activeUsers || 0,
        totalBookings: data.total_bookings || data.totalBookings || 0,
        totalRevenue: data.total_revenue || data.totalRevenue || 0,
        websiteViews: data.website_views || data.websiteViews || 0,
        systemHealth: data.system_health || data.systemHealth || 100,
        totalPackages: data.total_packages || data.totalPackages || 0,
        pendingApprovals: data.pending_approvals || data.pendingApprovals || 0,
        unreadMessages: data.unread_messages || data.unreadMessages || 0,
        totalTransportBookings: data.total_transport_bookings || data.totalTransportBookings || 0,
        activeTransportBookings: data.active_transport_bookings || data.activeTransportBookings || 0,
    };
};

const mapUserToCamel = (data: any): User => {
    return {
        id: data.id?.toString() || data.ID?.toString(),
        name: data.name || data.Name,
        email: data.email || data.Email,
        role: data.role || data.Role,
        status: data.status || data.Status,
        joinedDate: data.created_at || data.joinedDate || data.createdAt,
        lastLogin: data.last_login || data.lastLogin || data.updated_at,
        avatar: data.avatar,
        phone: data.phone,
    };
};

class AdminService {
    /**
     * Get Dashboard Stats
     */
    async getDashboardStats(): Promise<AdminStats> {
        const response = await apiClient.get<any>('/admin/analytics/overview');

        if (response.success && response.data) {
            return mapAdminStatsToCamel(response.data);
        }

        // Fallback/Mock only if request fails, to prevent UI crash during dev
        console.warn('Failed to fetch admin stats, using fallback');
        return {
            totalUsers: 0,
            activeUsers: 0,
            totalBookings: 0,
            totalRevenue: 0,
            websiteViews: 0,
            systemHealth: 100,
            totalPackages: 0,
            pendingApprovals: 0,
            unreadMessages: 0,
            totalTransportBookings: 0,
            activeTransportBookings: 0
        };
    }

    /**
     * List Users
     */
    async listUsers(page = 1, limit = 10, search = '', role = '', status = ''): Promise<User[]> {
        const params: any = { page, limit };
        if (search) params.search = search;
        if (role && role !== 'all') params.role = role;
        if (status && status !== 'all') params.status = status;

        const response = await apiClient.get<any[]>('/admin/users', params);

        if (response.success && response.data) {
            return response.data.map(mapUserToCamel);
        }

        return [];
    }

    /**
     * Get User Details
     */
    async getUser(id: string): Promise<User | null> {
        const response = await apiClient.get<User>(`/admin/users/${id}`);
        if (response.success && response.data) {
            return response.data;
        }
        return null;
    }

    /**
     * Create User
     */
    async createUser(data: Partial<User>): Promise<boolean> {
        const response = await apiClient.post('/admin/users', data);
        return response.success;
    }

    /**
     * Update User
     */
    async updateUser(id: string, data: Partial<User>): Promise<boolean> {
        const response = await apiClient.put(`/admin/users/${id}`, data);
        return response.success;
    }

    /**
     * Delete User
     */
    async deleteUser(id: string): Promise<boolean> {
        const response = await apiClient.delete(`/admin/users/${id}`);
        return response.success;
    }
}

export const adminService = new AdminService();
// Export as AdminService class/namespace for compatibility with existing imports if any
export { AdminService as AdminServiceClass };
