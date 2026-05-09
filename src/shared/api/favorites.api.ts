import type { Product } from '@entities/product/product.types';
import { apiClient, type ApiResponse } from './client';

/**
 * GET /api/favorites
 * Returns the authenticated user's favorite product IDs
 */
export const getFavorites = async (): Promise<ApiResponse<number[]>> => {
	const response = await apiClient.get<{ favorites: number[] }>('/favorites');

	if (response.success && response.data) {
		return { success: true, data: response.data.favorites };
	}

	return { success: false, error: response.error };
};

/**
 * GET /api/favorites/products
 * Returns the authenticated user's favorite products (full objects)
 */
export const getFavoriteProductsApi = async (): Promise<
	ApiResponse<Product[]>
> => {
	const response = await apiClient.get<{ products: Product[] }>(
		'/favorites/products',
	);

	if (response.success && response.data) {
		return { success: true, data: response.data.products };
	}

	return { success: false, error: response.error };
};

/**
 * POST /api/favorites/{productId}
 * Adds a product to the authenticated user's favorites
 */
export const addFavorite = async (
	productId: number,
): Promise<ApiResponse<void>> => {
	return apiClient.post<void>(`/favorites/${productId}`);
};

/**
 * DELETE /api/favorites/{productId}
 * Removes a product from the authenticated user's favorites
 */
export const removeFavorite = async (
	productId: number,
): Promise<ApiResponse<void>> => {
	return apiClient.delete<void>(`/favorites/${productId}`);
};

/**
 * Toggle favorite for authenticated user — adds if not present, removes if present.
 * Returns true if now a favorite, false if removed.
 */
export const toggleFavoriteApi = async (
	productId: number,
	currentlyFavorite: boolean,
): Promise<boolean> => {
	if (currentlyFavorite) {
		await removeFavorite(productId);
		return false;
	} else {
		await addFavorite(productId);
		return true;
	}
};
