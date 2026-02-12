// Utility functions for authentication handling

/**
 * Checks if the user is authenticated by looking for the gtrh=1 cookie
 * @returns boolean - true if user is authenticated, false otherwise
 */
export const isUserAuthenticated = (): boolean => {
	if (typeof document === 'undefined') return false; // SSR check
	return document.cookie
		.split(';')
		.some((cookie) => cookie.trim().startsWith('gtrh=1'));
};

/**
 * Sets the authentication cookie
 * @param isAuthenticated - boolean value indicating authentication status
 */
export const setAuthenticationStatus = (isAuthenticated: boolean): void => {
	if (typeof document === 'undefined') return; // SSR check

	if (isAuthenticated) {
		// Set cookie to expire in 30 days
		const expiryDate = new Date();
		expiryDate.setDate(expiryDate.getDate() + 30);
		document.cookie = `gtrh=1; expires=${expiryDate.toUTCString()}; path=/`;

		// Clear localStorage cart when user logs in (cart will be managed on server)
		localStorage.removeItem('cart');
	} else {
		// Remove the authentication cookie
		document.cookie =
			'gtrh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
	}
};
