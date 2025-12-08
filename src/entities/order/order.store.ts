import { createStore, createEvent, createEffect } from 'effector';
import type { Order } from './order.types';

export const setOrders = createEvent<Order[]>();
export const addOrder = createEvent<Order>();

export const getOrdersFx = createEffect<void, Order[]>(async () => []);
export const addOrderFx = createEffect<Order, Order>(async (order) => order);

export const $orders = createStore<Order[]>([])
	.on(setOrders, (_, o) => o)
	.on(addOrder, (state, o) => [...state, o])
	.on(getOrdersFx.doneData, (_, o) => o)
	.on(addOrderFx.doneData, (state, o) => [...state, o]);
