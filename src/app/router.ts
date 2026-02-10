import { createRouter, createWebHistory } from 'vue-router';
import ProductListing from '@pages/ProductListing/ProductListing.vue';
import ProductDetail from '@pages/ProductDetail/ProductDetail.vue';
import Profile from '@pages/Profile/Profile.vue';
import B2B from '@pages/B2B/B2B.vue';
import Admin from '@pages/Admin/Admin.vue';
import Menu from '@pages/Menu/Menu.vue';
import Cart from '@pages/Cart/Cart.vue';
import Favorites from '@pages/Favorites/Favorites.vue';
import Notifications from '@pages/Notifications/Notifications.vue';
import Delivery from '@pages/Delivery/Delivery.vue';
import Returns from '@pages/Returns/Returns.vue';
import FAQ from '@pages/FAQ/FAQ.vue';
import About from '@pages/About/About.vue';
import Contacts from '@pages/Contacts/Contacts.vue';
import Partners from '@pages/Partners/Partners.vue';
import Offer from '@pages/Offer/Offer.vue';
import Privacy from '@pages/Privacy/Privacy.vue';
import { $user } from '@entities/user/user.store';

const routes = [
	{
		path: '/',
		name: 'ProductListing',
		component: ProductListing,
	},
	{
		path: '/catalog',
		name: 'Catalog',
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
		path: '/b2b',
		name: 'B2B',
		component: B2B,
	},
	{
		path: '/admin',
		name: 'Admin',
		component: Admin,
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
		path: '/favorites',
		name: 'Favorites',
		component: Favorites,
	},
	{
		path: '/notifications',
		name: 'Notifications',
		component: Notifications,
	},
	{
		path: '/delivery',
		name: 'Delivery',
		component: Delivery,
	},
	{
		path: '/returns',
		name: 'Returns',
		component: Returns,
	},
	{
		path: '/faq',
		name: 'FAQ',
		component: FAQ,
	},
	{
		path: '/about',
		name: 'About',
		component: About,
	},
	{
		path: '/contacts',
		name: 'Contacts',
		component: Contacts,
	},
	{
		path: '/partners',
		name: 'Partners',
		component: Partners,
	},
	{
		path: '/offer',
		name: 'Offer',
		component: Offer,
	},
	{
		path: '/privacy',
		name: 'Privacy',
		component: Privacy,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Navigation guard для редиректа пользователей на их страницы
router.beforeEach((to, from, next) => {
	const user = $user.getState();
	
	// Если пользователь пытается попасть на главную страницу или каталог
	if (to.path === '/' || to.path === '/catalog') {
		if (user) {
			// Редирект для SELLER (партнеров B2B)
			if (user.role === 'SELLER') {
				next('/b2b');
				return;
			}
			// Редирект для ADMIN
			if (user.role === 'ADMIN') {
				next('/admin');
				return;
			}
		}
	}
	
	next();
});
