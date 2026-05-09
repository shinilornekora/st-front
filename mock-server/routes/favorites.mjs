import { json, noContent } from '../lib/http.mjs';

export const handleFavoritesRoute = ({ res, method, pathname, state }) => {
	if (method === 'GET' && pathname === '/api/favorites') {
		const user = state.getCurrentUser();
		const favorites = Array.from(state.favoriteByUser.get(user.id) ?? []);
		json(res, 200, { favorites });
		return true;
	}

	if (method === 'GET' && pathname === '/api/favorites/products') {
		const user = state.getCurrentUser();
		const favorites = Array.from(state.favoriteByUser.get(user.id) ?? []);
		const favoriteProducts = favorites
			.map((id) => state.products.get(id))
			.filter(Boolean);
		json(res, 200, { products: favoriteProducts });
		return true;
	}

	const favoriteMatch = pathname.match(/^\/api\/favorites\/(\d+)$/);
	if (favoriteMatch) {
		const user = state.getCurrentUser();
		const productId = Number(favoriteMatch[1]);
		const current = state.favoriteByUser.get(user.id) ?? new Set();
		state.favoriteByUser.set(user.id, current);

		if (method === 'POST') {
			current.add(productId);
			noContent(res);
			return true;
		}

		if (method === 'DELETE') {
			current.delete(productId);
			noContent(res);
			return true;
		}
	}

	return false;
};
