import { createStore, createEvent, createEffect, sample } from 'effector';
import type { Cart, CartItem } from './cart.types';
import { isUserAuthenticated } from '@shared/utils/auth';
import { showToast, hideToast } from '@shared/ui/toast.store';

// Helper functions for localStorage
const saveCartToLocalStorage = (cart: Cart) => {
	if (!isUserAuthenticated()) {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
};

const loadCartFromLocalStorage = (): Cart | null => {
	if (!isUserAuthenticated()) {
		const savedCart = localStorage.getItem('cart');
		return savedCart ? JSON.parse(savedCart) : null;
	}
	return null;
};

const clearCartFromLocalStorage = () => {
	if (!isUserAuthenticated()) {
		localStorage.removeItem('cart');
	}
};

export const setCart = createEvent<Cart>();
export const addItem = createEvent<CartItem>();
export const removeItem = createEvent<number>(); // id товара (item)
export const updateQty = createEvent<{ id: number; quantity: number }>();

export const getCartFx = createEffect<void, Cart>(() => {
	// Try to load cart from localStorage if user is not authenticated
	const savedCart = loadCartFromLocalStorage();
	if (savedCart) {
		return savedCart;
	}
	
	// Return empty cart if no saved cart
	return {
		items: [],
		total: 0,
		currency: 'RUB',
	};
});

// Initial cart state - try to load from localStorage or use empty cart
const initialCart = loadCartFromLocalStorage() || { items: [], total: 0, currency: 'RUB' };

export const $cart = createStore<Cart>(initialCart)
	.on(setCart, (_, c) => {
		saveCartToLocalStorage(c);
		return c;
	})
	.on(addItem, (state, item) => {
		const exists = state.items.find(i => i.id === item.id);
		let items = exists
			? state.items.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
			: [...state.items, item];
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		
		return newCart;
	})
	.on(removeItem, (state, id) => {
		const items = state.items.filter(i => i.id !== id);
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	})
	.on(updateQty, (state, { id, quantity }) => {
		const items = state.items.map(i => (i.id === id ? { ...i, quantity } : i));
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	})
	.on(getCartFx.doneData, (_, cart) => {
		saveCartToLocalStorage(cart);
		return cart;
	});


// Effect to hide toast after delay
const hideToastFx = createEffect(() => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, 2500);
	});
});

// Show toast when item is added to cart
sample({
	clock: addItem,
	fn: () => 'Товар успешно добавлен в корзину',
	target: showToast,
});

// Start timer to hide toast
sample({
	clock: addItem,
	target: hideToastFx,
});

// Hide toast when timer completes
sample({
	clock: hideToastFx.doneData,
	target: hideToast,
});
