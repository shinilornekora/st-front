/**
 * Cart API
 * API для работы с корзиной пользователя
 * Используется только для авторизованных пользователей.
 * Для неавторизованных — localStorage через cart.store.ts
 */

import { apiClient, type ApiResponse } from './client';
import type { Cart, CartItem } from '@entities/cart/cart.types';

export interface AddToCartRequest {
	productId: number;
	quantity: number;
	selectedColor?: string;
}

export interface UpdateCartItemRequest {
	itemId: number;
	quantity: number;
}

export interface RemoveFromCartRequest {
	itemId: number;
}

/**
 * Получить корзину текущего пользователя
 * GET /api/cart
 */
export const getCart = async (): Promise<ApiResponse<Cart>> => {
	return apiClient.get<Cart>('/cart');
};

/**
 * Добавить товар в корзину
 * POST /api/cart/items
 */
export const addToCart = async (
	params: AddToCartRequest,
): Promise<ApiResponse<Cart>> => {
	return apiClient.post<Cart>('/cart/items', params);
};

/**
 * Обновить количество товара в корзине
 * PATCH /api/cart/items/{itemId}
 */
export const updateCartItem = async (
	params: UpdateCartItemRequest,
): Promise<ApiResponse<Cart>> => {
	return apiClient.patch<Cart>(`/cart/items/${params.itemId}`, {
		quantity: params.quantity,
	});
};

/**
 * Удалить товар из корзины
 * DELETE /api/cart/items/{itemId}
 */
export const removeFromCart = async (
	params: RemoveFromCartRequest,
): Promise<ApiResponse<Cart>> => {
	return apiClient.delete<Cart>(`/cart/items/${params.itemId}`);
};

/**
 * Очистить корзину
 * DELETE /api/cart
 */
export const clearCart = async (): Promise<
	ApiResponse<{ message: string }>
> => {
	return apiClient.delete<{ message: string }>('/cart');
};

// Re-export CartItem type for convenience
export type { Cart, CartItem };
