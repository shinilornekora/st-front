import { createStore, createEvent, createEffect } from 'effector';
import type { Product } from './product.types';

export const setProducts = createEvent<Product[]>();
export const addProduct = createEvent<Product>();
export const updateProduct = createEvent<Product>();

export const getProductsFx = createEffect<void, Product[]>(async () => {
	// Import mock data generator
	const { generateProducts } = await import('@shared/lib/mockData');
	// Generate 50 products for better performance
	return generateProducts(50);
});

export const $products = createStore<Product[]>([])
	.on(setProducts, (_, list) => list)
	.on(addProduct, (state, item) => [...state, item])
	.on(updateProduct, (state, item) => state.map(p => (p.id === item.id ? item : p)))
	.on(getProductsFx.doneData, (_, list) => list);
