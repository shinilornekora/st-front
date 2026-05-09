import { json } from '../lib/http.mjs';

export const handleOrdersRoute = ({ res, method, pathname, body, state }) => {
	if (method === 'GET' && pathname === '/api/orders') {
		json(res, 200, state.orders);
		return true;
	}

	if (method === 'POST' && pathname === '/api/orders') {
		const user = state.getCurrentUser();
		const seller = state.sellers[0];
		const orderId = state.orders.length + 1;
		const rawItems = Array.isArray(body?.items) ? body.items : [];

		const cartItems = rawItems.map((item, index) => {
			const product =
				state.products.get(Number(item.productId)) ??
				state.makeProduct(100 + index);

			return {
				id: index + 1,
				product,
				quantity: Number(item.quantity ?? 1),
				price: Number(item.price ?? product.price),
				currency: body?.currency ?? state.RUB,
			};
		});

		const total = cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);

		const order = {
			id: orderId,
			createdAt: state.nowIso(),
			items: cartItems,
			total,
			currency: body?.currency ?? state.RUB,
			status: 'PAID',
			customer: {
				id: user.id,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
			},
			seller,
		};

		state.orders.push(order);
		json(res, 200, order);
		return true;
	}

	return false;
};
