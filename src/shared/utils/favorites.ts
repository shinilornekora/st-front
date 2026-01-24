// Utility functions for managing favorite products in localStorage

const FAVORITES_KEY = 'favoriteProducts';

/**
 * Gets favorite products from localStorage
 * @returns number[] - Array of product IDs
 */
export const getFavoriteProducts = (): number[] => {
  if (typeof window === 'undefined') return []; // SSR check
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error parsing favorites from localStorage:', error);
    return [];
  }
};

/**
 * Adds a product to favorites in localStorage
 * @param productId - The ID of the product to add
 */
export const addToFavorites = (productId: number): void => {
  if (typeof window === 'undefined') return; // SSR check
  try {
    const favorites = getFavoriteProducts();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

/**
 * Removes a product from favorites in localStorage
 * @param productId - The ID of the product to remove
 */
export const removeFromFavorites = (productId: number): void => {
  if (typeof window === 'undefined') return; // SSR check
  try {
    const favorites = getFavoriteProducts();
    const updatedFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

/**
 * Toggles a product in favorites
 * @param productId - The ID of the product to toggle
 * @returns boolean - true if added to favorites, false if removed
 */
export const toggleFavorite = (productId: number): boolean => {
  const favorites = getFavoriteProducts();
  if (favorites.includes(productId)) {
    removeFromFavorites(productId);
    return false;
  } else {
    addToFavorites(productId);
    return true;
  }
};

/**
 * Checks if a product is in favorites
 * @param productId - The ID of the product to check
 * @returns boolean - true if product is in favorites
 */
export const isProductFavorite = (productId: number): boolean => {
  return getFavoriteProducts().includes(productId);
};

/**
 * Clears all favorites from localStorage
 */
export const clearFavorites = (): void => {
  if (typeof window === 'undefined') return; // SSR check
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};
