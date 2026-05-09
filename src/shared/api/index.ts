/**
 * Centralized API exports
 * Все API методы экспортируются отсюда
 */

// Auth API
export {
	loginUser,
	registerUser,
	logoutUser,
	updateProfile,
	forgotPassword,
} from './auth.api';
export type {
	LoginRequest,
	RegisterRequest,
	UpdateProfileRequest,
} from './auth.api';
export type { ApiResponse, LoginResponse, MeResponse } from './client';

// Products API
export {
	getProducts,
	getProductById,
	getSimilarProducts,
} from './products.api';
export type {
	GetProductsRequest,
	GetProductByIdRequest,
	GetSimilarProductsRequest,
} from './products.api';

// Sellers API
export { getSellersDashboard } from './sellers.api';
export type {
	SellerStats,
	ChartData,
	SellersDashboard,
	GetSellersDashboardRequest,
} from './sellers.api';

// Applications API
export { getApplications, updateApplicationStatus } from './applications.api';
export type {
	Application,
	UpdateApplicationStatusRequest,
} from './applications.api';

// Analytics API
export {
	getAnalyticsDashboard,
	getSellerProducts,
	createSellerProduct,
	updateSellerProduct,
	deleteSellerProduct,
} from './analytics.api';
export type {
	AnalyticsDashboard,
	ProductAnalytics,
	ProductListItem,
	GetAnalyticsDashboardRequest,
	CreateProductRequest,
	UpdateProductRequest,
	DeleteProductRequest,
} from './analytics.api';

// Cart API
export {
	getCart,
	addToCart,
	updateCartItem,
	removeFromCart,
	clearCart,
} from './cart.api';
export type {
	AddToCartRequest,
	UpdateCartItemRequest,
	RemoveFromCartRequest,
} from './cart.api';

// Orders API
export { getOrders, createOrder } from './orders.api';
export type { CreateOrderRequest } from './orders.api';

// Seller Application API
export { submitSellerApplication } from './sellerApplication.api';
export type { SubmitSellerApplicationRequest } from './sellerApplication.api';

// User API
export { deleteAccount, saveRequisites, saveSettings } from './user.api';
export type { Requisites, UserSettings } from './user.api';

// Discount Request API
export { createDiscountRequest } from './discountRequest.api';
export type {
	CreateDiscountRequestRequest,
	DiscountRequest,
} from './discountRequest.api';

// Favorites API
export {
	getFavorites,
	getFavoriteProductsApi,
	addFavorite,
	removeFavorite,
	toggleFavoriteApi,
} from './favorites.api';
