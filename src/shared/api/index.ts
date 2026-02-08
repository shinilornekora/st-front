/**
 * Centralized API exports
 * Все API методы экспортируются отсюда
 */

// Auth API
export {
  loginUser,
  registerUser
} from './auth.api';
export type { LoginRequest, RegisterRequest, ApiResponse } from './auth.api';

// Products API
export {
  getProducts,
  getProductById,
  getSimilarProducts
} from './products.api';
export type {
  GetProductsRequest,
  GetProductByIdRequest,
  GetSimilarProductsRequest
} from './products.api';

// В будущем здесь будут другие API модули:
// export * from './orders.api';
// export * from './analytics.api';
// и т.д.
