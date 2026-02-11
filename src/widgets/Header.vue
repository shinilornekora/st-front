<template>
	<header :class="[$style.header, { [$style.lightHeader]: lightHeader }]">
		<div :class="$style.headerContent">
			<router-link :class="$style.logoWrapper" :to="logoLink">
				<img :src="logoSrc" alt="Stivalli" :class="$style.logo" />
				<span v-if="userRole === 'partner'" :class="$style.partnersText">{{ t('common.partner') }}</span>
				<span v-if="userRole === 'admin'" :class="$style.adminText">{{ t('common.admin') }}</span>
			</router-link>
			<div v-if="!lightHeader && !hideSearch" :class="$style.searchWrapper">
				<SearchField
					v-model="searchQuery"
					:placeholder="t('common.search')"
					:class="$style.search"
					:initial-filters="initialFilters"
					@submit="handleSearch"
					@filterChange="handleFilterChange"
				/>
			</div>
			<div v-if="!lightHeader" :class="$style.headerIcons">
				<router-link
					to="/profile"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Profile') }]"
					:aria-label="t('common.profile')"
				>
					<img
						:src="isRouteActive('Profile') ? profileFilledIcon : userCircleIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
				<!-- B2B users see edit pencil icon that navigates to products tab -->
				<router-link
					v-if="userRole === 'partner' || userRole === 'SELLER'"
					to="/b2b?tab=products"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('B2B') && route.query.tab === 'products' }]"
					:aria-label="t('b2b.productsList')"
				>
					<img
						:src="editPencilIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
				<!-- Admin users see settings icon that navigates to applications tab -->
				<router-link
					v-else-if="userRole === 'admin' || userRole === 'ADMIN'"
					to="/admin?tab=applications"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Admin') && route.query.tab === 'applications' }]"
					:aria-label="t('admin.applicationsList')"
				>
					<img
						:src="settingsIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
				<!-- Regular users see cart icon -->
				<router-link
					v-else
					to="/cart"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Cart') }]"
					:aria-label="t('common.cart')"
				>
					<div :class="$style.cartIconWrapper">
						<img
							:src="isRouteActive('Cart') ? cartFilledIcon : darkShoppingCartIcon"
							alt=""
							:class="$style.headerIcon"
						/>
						<span v-if="cartItemsCount > 0" :class="$style.cartBadge">{{ cartItemsCount }}</span>
					</div>
				</router-link>
				<router-link
					to="/notifications"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Notifications') }]"
					:aria-label="t('common.notifications')"
				>
					<img
						:src="isRouteActive('Notifications') ? notificationFilledIcon : notificationIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
			</div>
			<router-link v-if="lightHeader" to="/" :class="$style.closeBtn" :aria-label="t('common.close')">
				<img :src="crossIcon" alt="" :class="$style.headerIcon" />
			</router-link>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { useI18n } from 'vue-i18n';
import { $cart } from '@entities/cart/cart.store';
import SearchField from '@shared/ui/SearchField.vue';
import logoFull from '@assets/logo_full.svg';
import logo from '@assets/logo.svg';
import userCircleIcon from '@assets/user_circle.svg';
import profileFilledIcon from '@assets/profile_filled.svg';
import darkShoppingCartIcon from '@assets/dark_shopping_cart.svg';
import cartFilledIcon from '@assets/cart_filled.svg';
import notificationIcon from '@assets/notification_icon.svg';
import notificationFilledIcon from '@assets/notification_filled.svg';
import crossIcon from '@assets/cross.svg';
import editPencilIcon from '@assets/edit_pencil.svg';
import settingsIcon from '@assets/settings.svg';

const { t } = useI18n();

// Define props
interface Props {
	lightHeader?: boolean;
	hideSearch?: boolean;
	userRole?: 'customer' | 'partner' | 'admin' | 'CUSTOMER' | 'SELLER' | 'ADMIN' | null;
	initialFilters?: any[];
}

const props = withDefaults(defineProps<Props>(), {
	lightHeader: false,
	hideSearch: false,
	userRole: null,
	initialFilters: () => [],
});

const route = useRoute();
const searchQuery = ref('');
const screenWidth = ref(window.innerWidth);
const cart = useStore($cart);

// Define emits
const emit = defineEmits(['search', 'filter']);

// Force reactivity with watchEffect
watchEffect(() => {
  // Just accessing the cart value to ensure reactivity
  cart.value;
});

// Create reactive computed property for cart items count
const cartItemsCount = computed(() => cart.value.items.length);

const logoSrc = computed(() => {
	return screenWidth.value < 1200 ? logo : logoFull;
});

const logoLink = computed(() => {
	// Support both prop-based and actual role values
	if (props.userRole === 'partner' || props.userRole === 'SELLER') {
		return '/b2b';
	}
	if (props.userRole === 'admin' || props.userRole === 'ADMIN') {
		return '/admin';
	}
	return '/';
});

// Check if a route is active
const isRouteActive = (routeName: string) => {
	return route.name === routeName;
};

const handleSearch = ({ query }: { query: string }) => {
	emit('search', query);
};

const handleFilterChange = (filters: any[]) => {
	emit('filter', filters);
};

const updateScreenWidth = () => {
	screenWidth.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateScreenWidth);
});
</script>

<style module>
.header {
	background: var(--background-default);
	border-bottom: 1px solid #e5e5e5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	padding: 27px 0;
	position: sticky;
	z-index: 100;
	top: 0;
}

.lightHeader {
	background: var(--background-default);
	border-bottom: none;
	box-shadow: none;
	padding: 16px 0;
}

.headerContent {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 120px;
}

.lightHeader .headerContent {
	justify-content: flex-end;
}

.logoWrapper {
	display: flex;
	align-items: center;
	gap: 8px;
	text-decoration: none;
	cursor: pointer;
	flex-shrink: 0;
}

.logo {
	height: 35px;
	width: auto;
	max-width: 138px;
	flex-shrink: 0;
	object-fit: contain;
}

.partnersText {
	font-size: 20px;
	font-weight: 700;
    margin-bottom: 10px;
	color: var(--color-accent);
	text-transform: lowercase;
}

.adminText {
	font-size: 20px;
	font-weight: 700;
	color: var(--color-accent);
	text-transform: lowercase;
}

.lightHeader .logoWrapper {
	width: min-content;
	margin-right: auto;
	position: absolute;
	left: 20px;
	margin-left: 24px;
}

.searchWrapper {
	flex: 1;
	max-width: 600px;
	min-width: 0;
	margin: 0 24px;
}

.search {
	width: 100%;
}

.headerIcons {
	display: flex;
	gap: 12px;
	flex-shrink: 0;
}

.iconBtn {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	transition: background 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	text-decoration: none;
	color: inherit;
}

.iconBtn:hover {
	background: #f3f4f6;
}

.iconBtn.active .headerIcon {
	color: var(--color-main);
}

.headerIcon {
	width: 24px;
	height: 24px;
	color: var(--color-secondary);
}

.closeBtn {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	transition: background 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	text-decoration: none;
}

.closeBtn:hover {
	background: #f3f4f6;
}

@media (max-width: 1200px) {
	.headerContent {
		padding: 0 15px;
	}

	.logoWrapper {
		flex-shrink: 0;
		gap: 0;
	}
	
	.logo {
		margin-left: 24px;
	}
}

/* Responsive */
@media (max-width: 768px) {
	.header {
		padding: 8px 0;
	}

	.lightHeader {
		padding: 24px 0;
	}

	.headerContent {
		flex-wrap: wrap;
		padding: 0 16px;
		margin-top: 12px;
	}

	.logoWrapper {
		flex-shrink: 0;
		gap: 6px;
	}

	.logo {
		height: 30px;
		width: auto;
		max-width: 120px;
		margin-left: 24px;
	}

	.partnersText,
	.adminText {
		font-size: 14px;
		margin-bottom: 10px;
		white-space: nowrap;
	}

	.searchWrapper {
		order: 3;
		flex-basis: 100%;
		max-width: none;
		margin: 0;
	}

	.headerIcons {
		display: none;
	}

	.iconBtn {
		padding: 6px;
	}
}

.cartIconWrapper {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cartBadge {
	position: absolute;
	top: -4px;
	right: -4px;
	background: var(--color-accent);
	color: var(--background-default);;
	font-size: 10px;
	font-weight: bold;
	border-radius: 50%;
	width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 16px;
}
</style>
