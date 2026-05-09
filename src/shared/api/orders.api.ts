import { apiClient } from './client';
import type { ApiResponse } from './client';
import type { Order } from '@entities/order/order.types';

export interface CreateOrderRequest {
	items: Array<{
		productId: number;
		quantity: number;
		price: number;
	}>;
	currency: string;
}

export const getOrders = async (): Promise<ApiResponse<Order[]>> => {
	return apiClient.get<Order[]>('/api/orders');
};

export const createOrder = async (
	data: CreateOrderRequest,
): Promise<ApiResponse<Order>> => {
	return apiClient.post<Order>('/api/orders', data);
};
