<template>
	<!-- Desktop Footer -->
	<footer v-if="!isMobile" :class="$style.footer">
		<div :class="$style.footerContent">
			<div :class="$style.logoColumn">
				<img
					src="@assets/logo_white.svg"
					alt="Stivalli"
					:class="$style.footerLogo"
				/>
			</div>
			<div :class="$style.textColumns">
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">
						{{ t('navigation.catalog') }}
					</h3>
					<router-link
						to="/catalog?category=new"
						:class="$style.footerLink"
						>{{ t('navigation.newArrivals') }}</router-link
					>
					<router-link
						to="/catalog?category=women"
						:class="$style.footerLink"
						>{{ t('navigation.women') }}</router-link
					>
					<router-link
						to="/catalog?category=men"
						:class="$style.footerLink"
						>{{ t('navigation.men') }}</router-link
					>
					<router-link
						to="/catalog?category=sale"
						:class="$style.footerLink"
						>{{ t('navigation.sale') }}</router-link
					>
				</div>
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">
						{{ t('navigation.forCustomers') }}
					</h3>
					<router-link to="/delivery" :class="$style.footerLink">{{
						t('navigation.deliveryAndPayment')
					}}</router-link>
					<router-link to="/returns" :class="$style.footerLink">{{
						t('navigation.exchangeAndReturn')
					}}</router-link>
					<router-link to="/faq" :class="$style.footerLink">{{
						t('navigation.faqFull')
					}}</router-link>
				</div>
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">
						{{ t('navigation.aboutCompany') }}
					</h3>
					<router-link to="/about" :class="$style.footerLink">{{
						t('navigation.aboutBrand')
					}}</router-link>
					<router-link to="/contacts" :class="$style.footerLink">{{
						t('navigation.contacts')
					}}</router-link>
					<router-link to="/partners" :class="$style.footerLink">{{
						t('navigation.partnersB2B')
					}}</router-link>
					<router-link to="/offer" :class="$style.footerLink">{{
						t('navigation.publicOffer')
					}}</router-link>
					<router-link to="/privacy" :class="$style.footerLink">{{
						t('navigation.privacyPolicy')
					}}</router-link>
				</div>
			</div>
		</div>
	</footer>

	<!-- Mobile Footer Menu -->
	<footer v-else :class="$style.mobileFooter">
		<div :class="$style.mobileFooterContent">
			<router-link
				to="/profile"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isRouteActive('Profile') },
				]"
			>
				<img
					:src="
						isRouteActive('Profile')
							? profileFilledIcon
							: userCircleIcon
					"
					alt="Profile"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
			<router-link
				to="/menu"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isRouteActive('Menu') },
				]"
			>
				<img
					:src="
						isRouteActive('Menu')
							? hamburgerFilledIcon
							: hamburgerIcon
					"
					alt="Menu"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
			<!-- B2B users see edit pencil icon that navigates to products tab -->
			<router-link
				v-if="
					effectiveUserRole === 'partner' ||
					effectiveUserRole === 'SELLER'
				"
				to="/b2b?tab=products"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isB2BProductsTabActive },
				]"
			>
				<img
					:src="editPencilIcon"
					alt="Products"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
			<!-- Admin users see settings icon that navigates to applications tab -->
			<router-link
				v-else-if="
					effectiveUserRole === 'admin' ||
					effectiveUserRole === 'ADMIN'
				"
				to="/admin?tab=applications"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isAdminApplicationsTabActive },
				]"
			>
				<img
					:src="settingsIcon"
					alt="Applications"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
			<!-- Regular users see cart icon -->
			<router-link
				v-else
				to="/cart"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isRouteActive('Cart') },
				]"
			>
				<img
					:src="
						isRouteActive('Cart')
							? cartFilledIcon
							: darkShoppingCartIcon
					"
					alt="Cart"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
			<router-link
				to="/notifications"
				:class="[
					$style.mobileFooterBtn,
					{ [$style.active]: isRouteActive('Notifications') },
				]"
			>
				<img
					:src="
						isRouteActive('Notifications')
							? notificationFilledIcon
							: notificationIcon
					"
					alt="Notifications"
					:class="$style.mobileFooterIcon"
				/>
			</router-link>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from 'vue';
	import { useRoute } from 'vue-router';
	import { useStore } from 'effector-vue/composition';
	import { useI18n } from 'vue-i18n';
	import { $user } from '@entities/user/user.store';
	import userCircleIcon from '@assets/user_circle.svg';
	import profileFilledIcon from '@assets/profile_filled.svg';
	import hamburgerIcon from '@assets/hamburger.svg';
	import hamburgerFilledIcon from '@assets/hamburger_filled.svg';
	import darkShoppingCartIcon from '@assets/dark_shopping_cart.svg';
	import cartFilledIcon from '@assets/cart_filled.svg';
	import notificationIcon from '@assets/notification_icon.svg';
	import notificationFilledIcon from '@assets/notification_filled.svg';
	import editPencilIcon from '@assets/edit_pencil.svg';
	import settingsIcon from '@assets/settings.svg';

	// Define props
	interface Props {
		userRole?:
			| 'customer'
			| 'partner'
			| 'admin'
			| 'CUSTOMER'
			| 'SELLER'
			| 'ADMIN'
			| null;
	}

	const props = withDefaults(defineProps<Props>(), {
		userRole: null,
	});

	const { t } = useI18n();
	const route = useRoute();
	const user = useStore($user);
	const isMobile = ref(window.innerWidth <= 768);

	// Compute effective user role from prop or user store
	const effectiveUserRole = computed(() => {
		if (props.userRole) {
			return props.userRole;
		}
		if (user.value?.role === 'SELLER') {
			return 'SELLER';
		}
		if (user.value?.role === 'ADMIN') {
			return 'ADMIN';
		}
		return null;
	});

	const updateIsMobile = () => {
		isMobile.value = window.innerWidth <= 768;
	};

	// Check if a route is active
	const isRouteActive = (routeName: string) => {
		return route.name === routeName;
	};

	// Check if B2B products tab is active
	const isB2BProductsTabActive = computed(() => {
		return route.name === 'B2B' && route.query.tab === 'products';
	});

	// Check if Admin applications tab is active
	const isAdminApplicationsTabActive = computed(() => {
		return route.name === 'Admin' && route.query.tab === 'applications';
	});

	onMounted(() => {
		window.addEventListener('resize', updateIsMobile);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', updateIsMobile);
	});
</script>

<style module>
	.footer {
		background: var(--color-primary);
		color: var(--inverse-fill-color);
		padding: 40px 120px;
		margin-top: 84px;
	}

	.footerContent {
		width: 100%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12vw;
	}

	.logoColumn {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.textColumns {
		display: contents;
	}

	.footerColumn {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footerLogo {
		height: 35px;
		width: 135px;
		object-fit: contain;
	}

	.footerTitle {
		font-size: 20px;
		font-weight: 600;
		text-align: left;
		margin: 0 0 8px 0;
		color: var(--inverse-fill-color);
	}

	.footerLink {
		color: var(--inverse-fill-color);
		text-align: left;
		text-decoration: none;
		font-size: 14px;
		transition: color 0.2s;
		display: block;
	}

	.footerLink:hover {
		color: var(--inverse-fill-color);
	}

	/* Responsive */
	@media (max-width: 1200px) {
		.footer {
			padding: 40px 60px;
		}

		.footerContent {
			display: flex;
			flex-direction: column;
			gap: 32px;
		}

		.logoColumn {
			margin-bottom: 16px;
		}

		.textColumns {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 32px;
		}
	}

	@media (max-width: 768px) {
		.footer {
			padding: 32px 16px;
			margin-top: 48px;
		}

		.footerContent {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}

		.textColumns {
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}
	}

	/* Mobile Footer Menu */
	.mobileFooter {
		position: fixed;
		display: none;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--background-secondary);
		border-top: 1px solid #e5e5e5;
		z-index: 1000;
		height: 46px;
		width: 100%;
		margin: 0 auto;
	}

	/* Add bottom padding to main content when mobile footer is visible */
	:global(.page) {
		padding-bottom: 46px;
	}

	@media (min-width: 769px) {
		:global(.page) {
			padding-bottom: 0;
		}
	}

	.mobileFooterContent {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.mobileFooterBtn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		padding: 4px;
		border-radius: 8px;
		transition: background-color 0.2s;
		min-width: 50px;
		height: 100%;
		outline: none; /* Remove focus outline */
	}

	.mobileFooterBtn:focus {
		outline: none; /* Remove focus outline on focus */
		box-shadow: none; /* Remove any box shadow on focus */
	}

	.mobileFooterBtn:active {
		outline: none; /* Remove outline on active/click */
		box-shadow: none; /* Remove any box shadow on active/click */
	}

	.mobileFooterIcon {
		width: 24px;
		height: 24px;
		color: var(--color-secondary);
	}

	.mobileFooterBtn.active .mobileFooterIcon {
		color: var(--color-main);
	}

	@media (max-width: 768px) {
		.footer {
			padding: 24px 16px;
		}

		.footerContent {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.mobileFooter {
			display: block;
		}
	}
</style>
