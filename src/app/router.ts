import { createRouter, createWebHistory } from 'vue-router';
import ProductListing from '../pages/ProductListing/ProductListing.vue';
import ProductDetail from '../pages/ProductDetail/ProductDetail.vue';
import Profile from '../pages/Profile/Profile.vue';
import Menu from '../pages/Menu/Menu.vue';
import Cart from '../pages/Cart/Cart.vue';
import Notifications from '../pages/Notifications/Notifications.vue';

const routes = [
	{
		path: '/',
		name: 'ProductListing',
		component: ProductListing,
	},
	{
		path: '/product/:id',
		name: 'ProductDetail',
		component: ProductDetail,
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
	},
	{
		path: '/menu',
		name: 'Menu',
		component: Menu,
	},
	{
		path: '/cart',
		name: 'Cart',
		component: Cart,
	},
	{
		path: '/notifications',
		name: 'Notifications',
		component: Notifications,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
