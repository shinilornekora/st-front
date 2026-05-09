/**
 * Analytics API
 * API для работы с аналитикой продаж B2B
 */

import { apiClient, type ApiResponse } from './client';

// Types
export interface ChartData {
	labels: string[];
	data: number[];
}

export interface ProductAnalytics {
	id: number;
	name: string;
	article: string;
	price: number;
	sold: number;
	revenue: number;
	dynamics: string;
	stock: number;
	imageUrl?: string;
}

export interface ProductListItem {
	id: number;
	article: string;
	name: string;
	price: number;
}

export interface AnalyticsDashboard {
	revenue: {
		total: string;
		change: string;
		chartData: ChartData;
	};
	productsSold: {
		total: number;
		change: string;
		chartData: ChartData;
	};
	products: ProductAnalytics[];
}

export interface GetAnalyticsDashboardRequest {
	period?: 'month' | 'quarter' | 'year';
}

export interface CreateProductRequest {
	name: string;
	article: string;
	price: number;
	discountPrice?: number;
	sizes?: string[];
	colors?: string[];
	composition?: string;
	gender?: 'male' | 'female' | 'unisex';
	images?: string[];
}

export interface UpdateProductRequest {
	id: number;
	name?: string;
	article?: string;
	price?: number;
	discountPrice?: number;
	sizes?: string[];
	colors?: string[];
	composition?: string;
	gender?: 'male' | 'female' | 'unisex';
	images?: string[];
}

export interface DeleteProductRequest {
	id: number;
}

/**
 * Получить данные аналитики продаж
 * GET /api/b2b/analytics/dashboard
 */
export const getAnalyticsDashboard = async (
	params: GetAnalyticsDashboardRequest = {},
): Promise<ApiResponse<AnalyticsDashboard>> => {
	return apiClient.get<AnalyticsDashboard>(
		`/b2b/analytics/dashboard?period=${params.period || 'month'}`,
	);
};

/**
 * Получить список товаров продавца
 * GET /api/b2b/products
 */
export const getSellerProducts = async (): Promise<ApiResponse<ProductListItem[]>> => {
	return apiClient.get<ProductListItem[]>('/b2b/products');
};

/**
 * Создать новый товар продавца
 * POST /api/b2b/products
 */
export const createSellerProduct = async (
	params: CreateProductRequest,
): Promise<ApiResponse<ProductListItem>> => {
	return apiClient.post<ProductListItem>('/b2b/products', params);
};

/**
 * Обновить товар продавца
 * PUT /api/b2b/products/{id}
 */
export const updateSellerProduct = async (
	params: UpdateProductRequest,
): Promise<ApiResponse<ProductListItem>> => {
	const { id, ...body } = params;
	return apiClient.put<ProductListItem>(`/b2b/products/${id}`, body);
};

/**
 * Удалить товар продавца
 * DELETE /api/b2b/products/{id}
 */
export const deleteSellerProduct = async (
	params: DeleteProductRequest,
): Promise<ApiResponse<{ message: string }>> => {
	return apiClient.delete<{ message: string }>(`/b2b/products/${params.id}`);
};
