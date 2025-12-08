import { createStore, createEvent, createEffect } from 'effector';
import type { Product } from './product.types';

export const setProducts = createEvent<Product[]>();
export const addProduct = createEvent<Product>();
export const updateProduct = createEvent<Product>();

export const getProductsFx = createEffect<void, Product[]>(async () => [
	{
		id: 100,
		name: 'Demo Product',
		slug: 'demo-product',
		description: 'Демо товар',
		price: 1990,
		currency: 'RUB',
		inStock: true,
		category: [],
		tags: [],
		images: [],
		seller: { id: 77, name: 'Demo Seller' },
	},
]);

export const $products = createStore<Product[]>([])
	.on(setProducts, (_, list) => list)
	.on(addProduct, (state, item) => [...state, item])
	.on(updateProduct, (state, item) => state.map(p => (p.id === item.id ? item : p)))
	.on(getProductsFx.doneData, (_, list) => list);
