import type { Product } from '@entities/product/product.types';
import { apiClient, type ApiResponse } from './client';
import { i18n } from '@shared/i18n';

export interface GetProductsRequest {
	count?: number;
}

export interface GetProductByIdRequest {
	id: number;
}

export interface GetSimilarProductsRequest {
	productId: number;
	count?: number;
}

/**
 * GET /api/products
 */
export const getProducts = async (
	params: GetProductsRequest = {},
): Promise<ApiResponse<Product[]>> => {
	const response = await apiClient.get<{ products: Product[] }>(
		`/products?count=${params.count || 250}`,
	);

	if (response.success && response.data) {
		return {
			success: true,
			data: response.data.products,
		};
	}

	return {
		success: false,
		error: response.error || i18n.global.t('errors.loadProductsFailed'),
	};
};

/**
 * GET /api/products/{id}
 */
export const getProductById = async (
	params: GetProductByIdRequest,
): Promise<ApiResponse<Product>> => {
	const response = await apiClient.get<{ product: Product }>(
		`/products/${params.id}`,
	);

	if (response.success && response.data) {
		return {
			success: true,
			data: response.data.product,
		};
	}

	return {
		success: false,
		error: response.error || i18n.global.t('errors.productNotFound'),
	};
};

/**
 * GET /api/products/{productId}/similar
 */
export const getSimilarProducts = async (
	params: GetSimilarProductsRequest,
): Promise<ApiResponse<Product[]>> => {
	const response = await apiClient.get<{ products: Product[] }>(
		`/products/${params.productId}/similar?count=${params.count || 5}`,
	);

	if (response.success && response.data) {
		return {
			success: true,
			data: response.data.products,
		};
	}

	return {
		success: false,
		error: response.error || i18n.global.t('errors.loadSimilarFailed'),
	};
};
