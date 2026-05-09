/**
 * Centralized API exports
 * Все API методы экспортируются отсюда
 */

// Auth API
export { loginUser, registerUser, logoutUser } from './auth.api';
export type { LoginRequest, RegisterRequest } from './auth.api';
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

// В будущем здесь будут другие API модули:
// export * from './orders.api';
// и т.д.
