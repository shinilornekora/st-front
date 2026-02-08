import { createStore, createEvent, createEffect } from 'effector';
import type { Product } from './product.types';
import { getProducts } from '@shared/api';

export const setProducts = createEvent<Product[]>();
export const addProduct = createEvent<Product>();
export const updateProduct = createEvent<Product>();

export const getProductsFx = createEffect<void, Product[]>(async () => {
	const response = await getProducts({ __mock: true });
	
	if (!response.success) {
		throw new Error(response.error || 'Не удалось загрузить товары');
	}
	
	return response.data || [];
});

export const $products = createStore<Product[]>([])
	.on(setProducts, (_, list) => list)
	.on(addProduct, (state, item) => [...state, item])
	.on(updateProduct, (state, item) => state.map(p => (p.id === item.id ? item : p)))
	.on(getProductsFx.doneData, (_, list) => list);
