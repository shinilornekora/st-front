import { createStore, createEvent, createEffect } from 'effector';
import type { Cart, CartItem } from './cart.types';

export const setCart = createEvent<Cart>();
export const addItem = createEvent<CartItem>();
export const removeItem = createEvent<number>(); // id товара (item)
export const updateQty = createEvent<{ id: number; quantity: number }>();

export const getCartFx = createEffect<void, Cart>(() => {
	return {
		items: [],
		total: 0,
		currency: 'RUB',
	};
});

export const $cart = createStore<Cart>({ items: [], total: 0, currency: 'RUB' })
	.on(setCart, (_, c) => c)
	.on(addItem, (state, item) => {
		const exists = state.items.find(i => i.id === item.id);
		let items = exists
			? state.items.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
			: [...state.items, item];
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		return { ...state, items, total };
	})
	.on(removeItem, (state, id) => {
		const items = state.items.filter(i => i.id !== id);
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		return { ...state, items, total };
	})
	.on(updateQty, (state, { id, quantity }) => {
		const items = state.items.map(i => (i.id === id ? { ...i, quantity } : i));
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		return { ...state, items, total };
	})
	.on(getCartFx.doneData, (_, cart) => cart);
