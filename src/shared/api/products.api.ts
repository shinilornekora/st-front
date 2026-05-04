import {
	mockGetProducts,
	mockGetProductById,
	mockGetSimilarProducts,
} from './mockClient/products.mock';
import type { Product } from '@entities/product/product.types';
import { apiClient, type ApiResponse } from './client';
import { i18n } from '@shared/i18n';

export interface GetProductsRequest {
	count?: number;
	__mock?: boolean;
}

export interface GetProductByIdRequest {
	id: number;
	__mock?: boolean;
}

export interface GetSimilarProductsRequest {
	productId: number;
	count?: number;
	__mock?: boolean;
}

export const getProducts = async (
	params: GetProductsRequest = {},
): Promise<ApiResponse<Product[]>> => {
	if (params.__mock) {
		return mockGetProducts(params.count);
	}

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

export const getProductById = async (
	params: GetProductByIdRequest,
): Promise<ApiResponse<Product>> => {
	if (params.__mock) {
		return mockGetProductById(params.id);
	}

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

export const getSimilarProducts = async (
	params: GetSimilarProductsRequest,
): Promise<ApiResponse<Product[]>> => {
	if (params.__mock) {
		return mockGetSimilarProducts(params.productId, params.count);
	}

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
