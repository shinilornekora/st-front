import { handleAuthRoute } from './auth.mjs';
import { handleProductsRoute } from './products.mjs';
import { handleFavoritesRoute } from './favorites.mjs';
import { handleCartRoute } from './cart.mjs';
import { handleOrdersRoute } from './orders.mjs';
import { handleBusinessRoute } from './business.mjs';
import { handleUserRoute } from './user.mjs';
import { handleAdminRoute } from './admin.mjs';
import { handleB2bRoute } from './b2b.mjs';

const handlers = [
	handleAuthRoute,
	handleProductsRoute,
	handleFavoritesRoute,
	handleCartRoute,
	handleOrdersRoute,
	handleBusinessRoute,
	handleUserRoute,
	handleAdminRoute,
	handleB2bRoute,
];

export const handleRoute = (context) =>
	handlers.some((handler) => handler(context));
