<template>
	<header :class="[$style.header, { [$style.lightHeader]: lightHeader }]">
		<div :class="$style.headerContent">
			<router-link :class="$style.logo" to="/">
				<img :src="logoSrc" alt="Stivalli" :class="$style.logo" />
			</router-link>
			<div v-if="!lightHeader" :class="$style.searchWrapper">
				<SearchField
					v-model="searchQuery"
					placeholder="Value"
					:class="$style.search"
				/>
			</div>
			<div v-if="!lightHeader" :class="$style.headerIcons">
				<router-link
					to="/profile"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Profile') }]"
					aria-label="Профиль"
				>
					<img
						:src="isRouteActive('Profile') ? profileFilledIcon : userCircleIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
				<router-link
					to="/cart"
					:class="[$style.iconBtn, { [$style.active]: isRouteActive('Cart') }]"
					aria-label="Корзина"
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
					aria-label="Уведомления"
				>
					<img
						:src="isRouteActive('Notifications') ? notificationFilledIcon : notificationIcon"
						alt=""
						:class="$style.headerIcon"
					/>
				</router-link>
			</div>
			<router-link v-if="lightHeader" to="/" :class="$style.closeBtn" aria-label="Закрыть">
				<img :src="crossIcon" alt="" :class="$style.headerIcon" />
			</router-link>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'effector-vue/composition';
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

// Define props
interface Props {
	lightHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	lightHeader: false,
});

const route = useRoute();
const searchQuery = ref('');
const screenWidth = ref(window.innerWidth);
const cart = useStore($cart);

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

// Check if a route is active
const isRouteActive = (routeName: string) => {
	return route.name === routeName;
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
	background: white;
	border-bottom: 1px solid #e5e5e5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	padding: 27px 0;
	position: sticky;
	z-index: 100;
	top: 0;
}

.lightHeader {
	background: transparent;
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

.logo {
	height: 35px;
	width: 138px;
	flex-shrink: 0;
	object-fit: contain;
	cursor: pointer;
}

.lightHeader .logo {
	margin-right: auto;
	position: absolute;
	left: 0;
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
	color: #6b7280;
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
		gap: 8px;
		padding: 0 16px;
	}

	.logo {
		flex: 1;
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
	color: white;
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
