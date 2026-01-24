import type { CartItem } from '@entities/cart/cart.types';
export type OrderStatus = 'PAID' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
export interface Order {
	id: number;
	createdAt: string;
	items: CartItem[];
	total: number;
	currency: string;
	status: OrderStatus;
	customer: { id: number; fullName: string; email: string; phone: string };
	seller: { id: number; name: string };
	paymentInfo?: any;
}
