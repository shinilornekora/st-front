import type { Product } from '@entities/product/product.types';
export interface CartItem {
	id: number;
	product: Product;
	quantity: number;
	price: number;
	discount?: number;
	currency: string;
}
export interface Cart {
	items: CartItem[];
	total: number;
	currency: string;
}
