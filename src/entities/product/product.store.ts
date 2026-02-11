import { createStore, createEvent, createEffect } from 'effector';
import type { Product } from './product.types';
import { getProducts } from '@shared/api';
import { i18n } from '@shared/i18n';

export const setProducts = createEvent<Product[]>();
export const addProduct = createEvent<Product>();
export const updateProduct = createEvent<Product>();
export const setPreviewProduct = createEvent<Product | null>();
export const clearPreviewProduct = createEvent();
export const setPreviewFormData = createEvent<any>();
export const clearPreviewFormData = createEvent();

export const getProductsFx = createEffect<void, Product[]>(async () => {
	const response = await getProducts({ __mock: true });
	
	if (!response.success) {
		throw new Error(response.error || i18n.global.t('errors.loadProductsFailed'));
	}
	
	return response.data || [];
});

export const $products = createStore<Product[]>([])
	.on(setProducts, (_, list) => list)
	.on(addProduct, (state, item) => [...state, item])
	.on(updateProduct, (state, item) => state.map(p => (p.id === item.id ? item : p)))
	.on(getProductsFx.doneData, (_, list) => list);

export const $previewProduct = createStore<Product | null>(null)
	.on(setPreviewProduct, (_, product) => product)
	.on(clearPreviewProduct, () => null);

export const $previewFormData = createStore<any>(null)
	.on(setPreviewFormData, (_, data) => data)
	.on(clearPreviewFormData, () => null);
