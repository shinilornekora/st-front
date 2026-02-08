import { mockGetProducts, mockGetProductById, mockGetSimilarProducts } from './mockClient/products.mock';
import type { Product } from '@entities/product/product.types';
import type { ApiResponse } from './auth.api';

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

export const getProducts = async (params: GetProductsRequest = {}): Promise<ApiResponse<Product[]>> => {
  if (params.__mock) {
    return mockGetProducts(params.count);
  }

  try {
    const response = await fetch(`/api/products?count=${params.count || 250}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Ошибка загрузки товаров'
      };
    }

    return {
      success: true,
      data: result.products
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети'
    };
  }
};

export const getProductById = async (params: GetProductByIdRequest): Promise<ApiResponse<Product>> => {
  if (params.__mock) {
    return mockGetProductById(params.id);
  }

  try {
    const response = await fetch(`/api/products/${params.id}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Товар не найден'
      };
    }

    return {
      success: true,
      data: result.product
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети'
    };
  }
};

export const getSimilarProducts = async (params: GetSimilarProductsRequest): Promise<ApiResponse<Product[]>> => {
  if (params.__mock) {
    return mockGetSimilarProducts(params.productId, params.count);
  }

  try {
    const response = await fetch(`/api/products/${params.productId}/similar?count=${params.count || 5}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Ошибка загрузки похожих товаров'
      };
    }

    return {
      success: true,
      data: result.products
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети'
    };
  }
};
