import { createRouter, createWebHistory } from 'vue-router';
import ProductListing from '../pages/ProductListing/ProductListing.vue';
import ProductDetail from '../pages/ProductDetail/ProductDetail.vue';

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
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
