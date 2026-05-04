// Utility functions for authentication handling

import { accessTokenStore } from '@shared/api/client';

/**
 * Authenticated state is based on in-memory access token presence.
 * Session restoration is handled by refresh cookie + /auth/refresh.
 */
export const isUserAuthenticated = (): boolean => {
	return accessTokenStore.has();
};

/**
 * Keeps auth side-effects in one place.
 */
export const setAuthenticationStatus = (isAuthenticated: boolean): void => {
	if (typeof window === 'undefined') return;

	if (isAuthenticated) {
		localStorage.removeItem('cart');
		return;
	}

	accessTokenStore.clear();
	localStorage.removeItem('user');
};
