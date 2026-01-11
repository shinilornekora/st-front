import { createRouter, createWebHistory } from 'vue-router';
import ProductListing from '../pages/ProductListing/ProductListing.vue';

const routes = [
	{
		path: '/',
		name: 'ProductListing',
		component: ProductListing,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
