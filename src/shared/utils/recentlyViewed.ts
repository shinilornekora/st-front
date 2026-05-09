// Utility functions for tracking recently viewed products in localStorage

import type { Product } from '@entities/product/product.types';

const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
const MAX_RECENTLY_VIEWED = 10;

/**
 * Returns the list of recently viewed products from localStorage.
 */
export const getRecentlyViewedProducts = (): Product[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
		return raw ? (JSON.parse(raw) as Product[]) : [];
	} catch {
		return [];
	}
};

/**
 * Records a product as recently viewed.
 * Moves it to the front if already present; trims to MAX_RECENTLY_VIEWED.
 */
export const recordRecentlyViewed = (product: Product): void => {
	if (typeof window === 'undefined') return;
	try {
		const existing = getRecentlyViewedProducts().filter(
			(p) => p.id !== product.id,
		);
		const updated = [product, ...existing].slice(0, MAX_RECENTLY_VIEWED);
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
	} catch {
		// localStorage may be unavailable (private mode quota exceeded)
	}
};

/**
 * Clears the recently viewed list.
 */
export const clearRecentlyViewed = (): void => {
	if (typeof window === 'undefined') return;
	try {
		localStorage.removeItem(RECENTLY_VIEWED_KEY);
	} catch {
		// ignore
	}
};
