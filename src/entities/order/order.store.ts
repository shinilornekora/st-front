import { createStore, createEvent, createEffect } from 'effector';
import type { Order } from './order.types';
import { getOrders, createOrder } from '@shared/api/orders.api';
import type { CreateOrderRequest } from '@shared/api/orders.api';

export const setOrders = createEvent<Order[]>();
export const addOrder = createEvent<Order>();

export const getOrdersFx = createEffect<void, Order[]>(async () => {
	const response = await getOrders();
	if (response.success && response.data) {
		return response.data;
	}
	return [];
});

export const addOrderFx = createEffect<CreateOrderRequest, Order>(
	async (data) => {
		const response = await createOrder(data);
		if (!response.success || !response.data) {
			throw new Error(response.error ?? 'Failed to create order');
		}
		return response.data;
	},
);

export const $orders = createStore<Order[]>([])
	.on(setOrders, (_, o) => o)
	.on(addOrder, (state, o) => [...state, o])
	.on(getOrdersFx.doneData, (_, o) => o)
	.on(addOrderFx.doneData, (state, o) => [...state, o]);
