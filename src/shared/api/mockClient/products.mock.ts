import { mockClient } from './client';
import type { Product } from '@entities/product/product.types';
import { generateProducts, generateProduct, getSimilarProducts } from '@shared/lib/mockData';

export const mockGetProducts = async (count: number = 250) => {
  return mockClient.get<Product[]>(
    () => generateProducts(count),
    { delay: 400 }
  );
};

export const mockGetProductById = async (id: number) => {
  return mockClient.get<Product>(
    () => {
      const product = generateProduct(id);
      if (!product) {
        throw new Error('Товар не найден');
      }
      return product;
    },
    { delay: 300 }
  );
};

export const mockGetSimilarProducts = async (productId: number, count: number = 5) => {
  return mockClient.get<Product[]>(
    () => getSimilarProducts(productId, count),
    { delay: 350 }
  );
};
