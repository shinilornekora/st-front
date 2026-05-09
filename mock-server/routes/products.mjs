import { json } from '../lib/http.mjs';

export const handleProductsRoute = ({
	res,
	method,
	pathname,
	url,
	state,
}) => {
	if (method === 'GET' && pathname === '/api/products') {
		const count = state.parseIntOr(url.searchParams.get('count'), 250);
		const search = (url.searchParams.get('search') ?? '').toLowerCase();
		let list = Array.from(state.products.values()).slice(0, count);
		if (search) {
			list = list.filter((product) =>
				product.name.toLowerCase().includes(search),
			);
		}
		json(res, 200, { products: list });
		return true;
	}

	const productByIdMatch = pathname.match(/^\/api\/products\/(\d+)$/);
	if (method === 'GET' && productByIdMatch) {
		const id = Number(productByIdMatch[1]);
		const product = state.products.get(id);
		if (!product) {
			json(res, 404, { error: 'Product not found' });
			return true;
		}
		json(res, 200, { product });
		return true;
	}

	const similarProductsMatch = pathname.match(
		/^\/api\/products\/(\d+)\/similar$/,
	);
	if (method === 'GET' && similarProductsMatch) {
		const id = Number(similarProductsMatch[1]);
		const count = state.parseIntOr(url.searchParams.get('count'), 5);
		const startId = id + 1;
		const similar = Array.from({ length: count }).map((_, index) => {
			const nextId = startId + index;
			return state.products.get(nextId) ?? state.makeProduct(nextId);
		});
		json(res, 200, { products: similar });
		return true;
	}

	return false;
};
