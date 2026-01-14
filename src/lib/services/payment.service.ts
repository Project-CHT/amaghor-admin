import { apiClient, ApiResponse } from '../api-client';

export interface PaymentRequests {
    page: number;
    limit: number;
}

export interface Payment {
    id: number;
    paymentId: string;
    bookingId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
}

const mapPaymentToCamel = (data: any): Payment => {
    return {
        id: data.id,
        paymentId: data.payment_id || data.paymentId,
        bookingId: data.booking_id || data.bookingId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_method || data.paymentMethod,
        status: data.status,
        createdAt: data.created_at || data.createdAt,
    };
};

export interface PaymentListResponse {
    data: Payment[];
    total: number;
    page: number;
    limit: number;
}

class PaymentService {
    async listPayments(page = 1, limit = 10): Promise<ApiResponse<PaymentListResponse>> {
        const response = await apiClient.get<any>('/payments', { page, limit });

        if (response.success && response.data) {
            const payments = (response.data.data || []).map(mapPaymentToCamel);
            return {
                ...response,
                data: {
                    ...response.data,
                    data: payments
                }
            };
        }

        return response;
    }
}

export const paymentService = new PaymentService();
