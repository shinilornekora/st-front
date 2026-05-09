import { createStore, createEvent, createEffect, sample } from 'effector';
import type { Cart, CartItem } from './cart.types';
import { isUserAuthenticated } from '@shared/utils/auth';
import { showToast, hideToast } from '@shared/model';
import { i18n } from '@shared/i18n';
import { trackEvent } from '@shared/lib';
import {
	getCart as getCartApi,
	addToCart as addToCartApi,
	updateCartItem as updateCartItemApi,
	removeFromCart as removeFromCartApi,
} from '@shared/api/cart.api';

// ─── localStorage helpers (неавторизованные пользователи) ────────────────────

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

// ─── Events ──────────────────────────────────────────────────────────────────

export const setCart = createEvent<Cart>();
export const addItem = createEvent<CartItem>();
export const removeItem = createEvent<number>(); // id позиции (CartItem.id)
export const updateQty = createEvent<{ id: number; quantity: number }>();

// ─── Effects ─────────────────────────────────────────────────────────────────

/**
 * Загрузить корзину:
 * - авторизованный → GET /api/cart
 * - гость → localStorage
 */
export const getCartFx = createEffect<void, Cart>(async () => {
	if (isUserAuthenticated()) {
		const response = await getCartApi();
		if (response.success && response.data) {
			return response.data;
		}
	}

	const savedCart = loadCartFromLocalStorage();
	if (savedCart) return savedCart;

	return { items: [], total: 0, currency: 'RUB' };
});

/**
 * Добавить товар:
 * - авторизованный → POST /api/cart/items → возвращает обновлённую корзину
 * - гость → локальное обновление
 */
export const addItemFx = createEffect<CartItem, Cart>(async (item) => {
	if (isUserAuthenticated()) {
		const response = await addToCartApi({
			productId: item.product.id,
			quantity: item.quantity,
			selectedColor: item.selectedColor,
		});
		if (response.success && response.data) {
			return response.data;
		}
	}

	// Fallback: локальное обновление для гостя
	const savedCart = loadCartFromLocalStorage() ?? {
		items: [],
		total: 0,
		currency: 'RUB',
	};
	const exists = savedCart.items.find(
		(i) => i.id === item.id && i.selectedColor === item.selectedColor,
	);
	const items = exists
		? savedCart.items.map((i) =>
				i.id === item.id && i.selectedColor === item.selectedColor
					? { ...i, quantity: i.quantity + item.quantity }
					: i,
			)
		: [...savedCart.items, item];
	const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
	const newCart: Cart = { ...savedCart, items, total };
	saveCartToLocalStorage(newCart);
	return newCart;
});

/**
 * Обновить количество:
 * - авторизованный → PATCH /api/cart/items/{itemId}
 * - гость → локальное обновление
 */
export const updateQtyFx = createEffect<{ id: number; quantity: number }, Cart>(
	async ({ id, quantity }) => {
		if (isUserAuthenticated()) {
			const response = await updateCartItemApi({ itemId: id, quantity });
			if (response.success && response.data) {
				return response.data;
			}
		}

		const savedCart = loadCartFromLocalStorage() ?? {
			items: [],
			total: 0,
			currency: 'RUB',
		};
		const items = savedCart.items.map((i) =>
			i.id === id ? { ...i, quantity } : i,
		);
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart: Cart = { ...savedCart, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	},
);

/**
 * Удалить товар:
 * - авторизованный → DELETE /api/cart/items/{itemId}
 * - гость → локальное обновление
 */
export const removeItemFx = createEffect<number, Cart>(async (id) => {
	if (isUserAuthenticated()) {
		const response = await removeFromCartApi({ itemId: id });
		if (response.success && response.data) {
			return response.data;
		}
	}

	const savedCart = loadCartFromLocalStorage() ?? {
		items: [],
		total: 0,
		currency: 'RUB',
	};
	const items = savedCart.items.filter((i) => i.id !== id);
	const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
	const newCart: Cart = { ...savedCart, items, total };
	saveCartToLocalStorage(newCart);
	return newCart;
});

// ─── Store ────────────────────────────────────────────────────────────────────

const initialCart = loadCartFromLocalStorage() ?? {
	items: [],
	total: 0,
	currency: 'RUB',
};

export const $cart = createStore<Cart>(initialCart)
	.on(setCart, (_, c) => {
		saveCartToLocalStorage(c);
		return c;
	})
	// Синхронные события (для гостей / оптимистичных обновлений)
	.on(addItem, (state, item) => {
		const exists = state.items.find(
			(i) => i.id === item.id && i.selectedColor === item.selectedColor,
		);
		const items = exists
			? state.items.map((i) =>
					i.id === item.id && i.selectedColor === item.selectedColor
						? { ...i, quantity: i.quantity + item.quantity }
						: i,
				)
			: [...state.items, item];
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	})
	.on(removeItem, (state, id) => {
		const items = state.items.filter((i) => i.id !== id);
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	})
	.on(updateQty, (state, { id, quantity }) => {
		const items = state.items.map((i) =>
			i.id === id ? { ...i, quantity } : i,
		);
		const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
		const newCart = { ...state, items, total };
		saveCartToLocalStorage(newCart);
		return newCart;
	})
	// API-эффекты — обновляют стор ответом сервера
	.on(getCartFx.doneData, (_, cart) => {
		saveCartToLocalStorage(cart);
		return cart;
	})
	.on(addItemFx.doneData, (_, cart) => {
		saveCartToLocalStorage(cart);
		return cart;
	})
	.on(updateQtyFx.doneData, (_, cart) => {
		saveCartToLocalStorage(cart);
		return cart;
	})
	.on(removeItemFx.doneData, (_, cart) => {
		saveCartToLocalStorage(cart);
		return cart;
	});

// ─── Toast ────────────────────────────────────────────────────────────────────

const hideToastFx = createEffect(() => {
	return new Promise<void>((resolve) => {
		setTimeout(() => resolve(), 2500);
	});
});

const trackEventFx = createEffect(
	({
		eventName,
		payload,
	}: {
		eventName: string;
		payload: Record<string, unknown>;
	}) => trackEvent(eventName, payload),
);

sample({
	clock: addItem,
	fn: () => i18n.global.t('messages.itemAddedToCart'),
	target: showToast,
});

sample({
	clock: addItem,
	fn: (item) => ({
		eventName: 'cart_add_item',
		payload: {
			productId: item.product.id,
			quantity: item.quantity,
			source: 'local',
		},
	}),
	target: trackEventFx,
});

sample({
	clock: addItemFx.doneData,
	fn: () => i18n.global.t('messages.itemAddedToCart'),
	target: showToast,
});

sample({
	clock: addItemFx.doneData,
	fn: (cart) => ({
		eventName: 'cart_add_item',
		payload: {
			cartTotal: cart.total,
			itemsCount: cart.items.length,
			source: 'api',
		},
	}),
	target: trackEventFx,
});

sample({
	clock: [addItem, addItemFx.doneData],
	target: hideToastFx,
});

sample({
	clock: hideToastFx.doneData,
	target: hideToast,
});
