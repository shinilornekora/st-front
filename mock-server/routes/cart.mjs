import { json } from '../lib/http.mjs';

export const handleCartRoute = ({ res, method, pathname, body, state }) => {
	if (method === 'GET' && pathname === '/api/cart') {
		const user = state.getCurrentUser();
		json(res, 200, state.ensureCart(user.id));
		return true;
	}

	if (method === 'POST' && pathname === '/api/cart/items') {
		const user = state.getCurrentUser();
		const cart = state.ensureCart(user.id);
		const product = state.products.get(Number(body?.productId));
		if (!product) {
			json(res, 404, { error: 'Product not found' });
			return true;
		}

		const quantity = Number(body?.quantity ?? 1);
		const selectedColor =
			typeof body?.selectedColor === 'string' ? body.selectedColor : undefined;

		const existing = cart.items.find(
			(item) =>
				item.product.id === product.id && item.selectedColor === selectedColor,
		);

		if (existing) {
			existing.quantity += quantity;
		} else {
			const itemId =
				cart.items.length > 0
					? Math.max(...cart.items.map((item) => item.id)) + 1
					: 1;
			cart.items.push({
				id: itemId,
				product,
				quantity,
				price: product.price,
				currency: product.currency,
				discount: product.discount,
				selectedColor,
			});
		}

		json(res, 200, state.recalcCart(cart));
		return true;
	}

	const cartItemMatch = pathname.match(/^\/api\/cart\/items\/(\d+)$/);
	if (cartItemMatch) {
		const user = state.getCurrentUser();
		const cart = state.ensureCart(user.id);
		const itemId = Number(cartItemMatch[1]);

		if (method === 'PATCH') {
			const item = cart.items.find((entry) => entry.id === itemId);
			if (!item) {
				json(res, 404, { error: 'Cart item not found' });
				return true;
			}
			item.quantity = Number(body?.quantity ?? item.quantity);
			json(res, 200, state.recalcCart(cart));
			return true;
		}

		if (method === 'DELETE') {
			cart.items = cart.items.filter((entry) => entry.id !== itemId);
			json(res, 200, state.recalcCart(cart));
			return true;
		}
	}

	if (method === 'DELETE' && pathname === '/api/cart') {
		const user = state.getCurrentUser();
		state.carts.set(user.id, { items: [], total: 0, currency: state.RUB });
		json(res, 200, { message: 'Cart cleared' });
		return true;
	}

	return false;
};
