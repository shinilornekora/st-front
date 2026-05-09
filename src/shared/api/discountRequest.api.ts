import { apiClient } from './client';
import type { ApiResponse } from './client';

export interface CreateDiscountRequestRequest {
	productId: number;
	discountAmount: number;
}

export interface DiscountRequest {
	id: number;
	productId: number;
	discountAmount: number;
	status: 'PENDING' | 'APPROVED' | 'REJECTED';
	createdAt: string;
}

export const createDiscountRequest = async (
	data: CreateDiscountRequestRequest,
): Promise<ApiResponse<DiscountRequest>> => {
	return apiClient.post<DiscountRequest>('/discount-requests', data);
};
