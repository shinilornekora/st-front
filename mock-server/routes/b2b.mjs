import { json } from '../lib/http.mjs';

export const handleB2bRoute = ({ res, method, pathname, body, state }) => {
	if (method === 'GET' && pathname === '/api/b2b/analytics/dashboard') {
		json(res, 200, {
			revenue: {
				total: '840 000 RUB',
				change: '+12.4%',
				chartData: {
					labels: ['W1', 'W2', 'W3', 'W4'],
					data: [160000, 170000, 220000, 290000],
				},
			},
			productsSold: {
				total: 541,
				change: '+8.2%',
				chartData: {
					labels: ['W1', 'W2', 'W3', 'W4'],
					data: [110, 123, 141, 167],
				},
			},
			products: state.b2bProducts.map((item, index) => ({
				id: item.id,
				name: item.name,
				article: item.article,
				price: item.price,
				sold: 15 + index * 3,
				revenue: (15 + index * 3) * item.price,
				dynamics: `+${4 + index}%`,
				stock: 100 - index * 7,
			})),
		});
		return true;
	}

	if (method === 'GET' && pathname === '/api/b2b/products') {
		json(res, 200, state.b2bProducts);
		return true;
	}

	if (method === 'POST' && pathname === '/api/b2b/products') {
		const newId =
			state.b2bProducts.length > 0
				? Math.max(...state.b2bProducts.map((item) => item.id)) + 1
				: 1;
		const created = {
			id: newId,
			article: body?.article ?? `B2B-${String(newId).padStart(4, '0')}`,
			name: body?.name ?? `B2B Product #${newId}`,
			price: Number(body?.price ?? 0),
		};
		state.b2bProducts.push(created);
		json(res, 200, created);
		return true;
	}

	const b2bProductMatch = pathname.match(/^\/api\/b2b\/products\/(\d+)$/);
	if (b2bProductMatch) {
		const id = Number(b2bProductMatch[1]);
		const index = state.b2bProducts.findIndex((item) => item.id === id);
		if (index < 0) {
			json(res, 404, { error: 'Product not found' });
			return true;
		}

		if (method === 'PUT') {
			state.b2bProducts[index] = { ...state.b2bProducts[index], ...body, id };
			json(res, 200, state.b2bProducts[index]);
			return true;
		}

		if (method === 'DELETE') {
			state.b2bProducts.splice(index, 1);
			json(res, 200, { message: 'Product deleted' });
			return true;
		}
	}

	return false;
};
