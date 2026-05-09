<template>
	<div :class="$style.page">
		<Header :hide-search="true" :user-role="displayUserRole" />

		<!-- Settings Modal -->
		<SettingsModal
			v-model="showSettingsModal"
			@save="handleSaveSettings"
			@logout="handleLogout"
			@delete-account="handleDeleteAccount"
		/>

		<!-- Requisites Modal -->
		<RequisitesModal
			v-model="showRequisitesModal"
			@save-requisites="handleSaveRequisites"
		/>

		<!-- Success Alert Popup with Backdrop -->
		<SuccessAlert
			v-model="showSuccessAlert"
			:title="t('profile.applicationPending')"
		>
			<p>{{ t('profile.applicationPendingText') }}</p>
			<p>{{ t('profile.applicationPendingText2') }}</p>
			<p>{{ t('profile.applicationPendingText3') }}</p>
		</SuccessAlert>

		<main :class="$style.main">
			<!-- Profile View (when authenticated) -->
			<div v-if="isAuthenticated && user" :class="$style.profileWrapper">
				<!-- Admin/Seller View: Only Actions Block -->
				<div
					v-if="user.role === 'ADMIN' || user.role === 'SELLER'"
					:class="$style.adminLayout"
				>
					<div :class="$style.actionsBlock">
						<nav :class="$style.actionsList">
							<a
								:class="[$style.actionItem, $style.profileItem]"
								@click="handleProfileEdit"
							>
								<div :class="$style.avatar">
									<img
										:src="userCircleIcon"
										alt="User"
										:class="$style.avatarIcon"
									/>
								</div>
								<span>{{ t('profile.profile') }}</span>
								<span :class="$style.userNameArrow">›</span>
							</a>
							<!-- Hide "Способы оплаты" for both ADMIN and SELLER -->
							<!-- Hide "Реквизиты" for ADMIN only -->
							<a
								v-if="user.role === 'SELLER'"
								:class="$style.actionItem"
								@click="handleRequisites"
							>
								<img
									:src="docsIcon"
									alt=""
									:class="$style.actionIcon"
								/>
								<span>{{ t('profile.requisites') }}</span>
							</a>
							<a
								:class="$style.actionItem"
								@click="handleSupport"
							>
								<img
									:src="chatIcon"
									alt=""
									:class="$style.actionIcon"
								/>
								<span>{{ t('profile.support') }}</span>
							</a>
							<a
								:class="$style.actionItem"
								@click="handleSettings"
							>
								<img
									:src="settingsIcon"
									alt=""
									:class="$style.actionIcon"
								/>
								<span>{{ t('profile.settings') }}</span>
							</a>
						</nav>
					</div>
				</div>

				<!-- Customer View: Full Layout -->
				<div v-else>
					<div :class="$style.profileLayout">
						<!-- Left Column: Actions Block -->
						<div :class="$style.actionsBlock">
							<nav :class="$style.actionsList">
								<a
									:class="[
										$style.actionItem,
										$style.profileItem,
									]"
									@click="handleProfileEdit"
								>
									<div :class="$style.avatar">
										<img
											:src="userCircleIcon"
											alt="User"
											:class="$style.avatarIcon"
										/>
									</div>
									<span>{{ t('profile.profile') }}</span>
									<span :class="$style.userNameArrow">›</span>
								</a>
								<a
									:class="$style.actionItem"
									@click="handlePaymentMethods"
								>
									<img
										:src="cardIcon"
										alt=""
										:class="$style.actionIcon"
									/>
									<span>{{
										t('profile.paymentMethods')
									}}</span>
								</a>
								<a
									:class="$style.actionItem"
									@click="handleRequisites"
								>
									<img
										:src="docsIcon"
										alt=""
										:class="$style.actionIcon"
									/>
									<span>{{ t('profile.requisites') }}</span>
								</a>
								<a
									:class="$style.actionItem"
									@click="handleSupport"
								>
									<img
										:src="chatIcon"
										alt=""
										:class="$style.actionIcon"
									/>
									<span>{{ t('profile.support') }}</span>
								</a>
								<a
									:class="$style.actionItem"
									@click="handleSettings"
								>
									<img
										:src="settingsIcon"
										alt=""
										:class="$style.actionIcon"
									/>
									<span>{{ t('profile.settings') }}</span>
								</a>
							</nav>
						</div>

						<!-- Right Column: Links Block and Carousel -->
						<div :class="$style.rightColumn">
							<div :class="$style.linksBlock">
								<router-link
									to="/favorites"
									:class="$style.linkCard"
								>
									<div :class="$style.linkHeader">
										<h3 :class="$style.linkTitle">
											{{ t('profile.favorites') }}
										</h3>
										<img
											:src="favouritesIcon"
											alt=""
											:class="$style.linkIcon"
										/>
									</div>
									<p :class="$style.linkDescription">
										{{ favoritesCount }}
										{{ getFavoritesText(favoritesCount) }}
									</p>
								</router-link>

								<router-link
									to="/favorites?tab=purchases"
									:class="$style.linkCard"
								>
									<div :class="$style.linkHeader">
										<h3 :class="$style.linkTitle">
											{{ t('profile.purchases') }}
										</h3>
										<img
											:src="boxIcon"
											alt=""
											:class="$style.linkIcon"
										/>
									</div>
									<p :class="$style.linkDescription">
										{{ t('profile.view') }}
									</p>
								</router-link>
							</div>

							<!-- Hero Carousel with placeholder boxes -->
							<div :class="$style.heroCarousel">
								<div :class="$style.heroThumbnail"></div>
								<div :class="$style.heroMain"></div>
								<div :class="$style.heroThumbnail"></div>
							</div>
						</div>
					</div>

					<!-- Hero Carousel visible only with compact devices -->
					<div :class="$style.heroCarouselCompact">
						<div :class="$style.heroThumbnail"></div>
						<div :class="$style.heroMain"></div>
						<div :class="$style.heroThumbnail"></div>
					</div>

					<!-- Recently Viewed Products (full width) -->
					<div
						v-if="recentlyViewedProducts.length > 0"
						:class="$style.recentlyViewedSection"
					>
						<Recommendations
							:title="t('profile.recentlyViewed')"
							:products="recentlyViewedProducts"
							@product-click="handleProductClick"
							@add-to-cart="handleAddToCart"
						/>
					</div>
				</div>
			</div>

			<!-- Login/Register Form (when not authenticated) -->
			<div v-else :class="$style.formContainer">
				<form :class="$style.form" @submit.prevent="handleLogin">
					<!-- Форма для входа покупателя (2 поля) -->
					<template v-if="!isSellerMode && !isRegisterMode">
						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.phoneOrEmail') }}
							</div>
							<Input
								v-model="login"
								:placeholder="t('auth.phoneOrEmail')"
								:variant="loginError ? 'error' : 'default'"
								:error="Boolean(loginError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.password') }}
							</div>
							<Input
								v-model="password"
								type="password"
								:placeholder="t('auth.password')"
								:variant="passwordError ? 'error' : 'default'"
								:error="Boolean(passwordError)"
								show-password-toggle
								:class="$style.input"
							/>
						</div>
					</template>

					<!-- Форма для регистрации покупателя (4 поля) -->
					<template v-else-if="isRegisterMode">
						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.name') }}
							</div>
							<Input
								v-model="customerName"
								:placeholder="t('auth.name')"
								:variant="
									customerNameError ? 'error' : 'default'
								"
								:error="Boolean(customerNameError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.phone') }}
							</div>
							<Input
								v-model="customerPhone"
								:placeholder="t('auth.phone')"
								:variant="
									customerPhoneError ? 'error' : 'default'
								"
								:error="Boolean(customerPhoneError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.email') }}
							</div>
							<Input
								v-model="customerEmail"
								type="email"
								:placeholder="t('auth.email')"
								:variant="
									customerEmailError ? 'error' : 'default'
								"
								:error="Boolean(customerEmailError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.password') }}
							</div>
							<Input
								v-model="customerPassword"
								type="password"
								:placeholder="t('auth.password')"
								:variant="
									customerPasswordError ? 'error' : 'default'
								"
								:error="Boolean(customerPasswordError)"
								show-password-toggle
								:class="$style.input"
							/>
						</div>
					</template>

					<!-- Форма для продавца (4 поля) -->
					<template v-else>
						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.name') }}
							</div>
							<Input
								v-model="sellerName"
								:placeholder="t('auth.name')"
								:variant="sellerNameError ? 'error' : 'default'"
								:error="Boolean(sellerNameError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.phone') }}
							</div>
							<Input
								v-model="sellerPhone"
								:placeholder="t('auth.phone')"
								:variant="
									sellerPhoneError ? 'error' : 'default'
								"
								:error="Boolean(sellerPhoneError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.email') }}
							</div>
							<Input
								v-model="sellerEmail"
								type="email"
								:placeholder="t('auth.email')"
								:variant="
									sellerEmailError ? 'error' : 'default'
								"
								:error="Boolean(sellerEmailError)"
								:class="$style.input"
							/>
						</div>

						<div :class="$style.inputGroup">
							<div :class="$style.inputLabel">
								{{ t('auth.password') }}
							</div>
							<Input
								v-model="sellerPassword"
								type="password"
								:placeholder="t('auth.password')"
								:variant="
									sellerPasswordError ? 'error' : 'default'
								"
								:error="Boolean(sellerPasswordError)"
								show-password-toggle
								:class="$style.input"
							/>
						</div>
					</template>

					<Button
						type="accent"
						type-attr="submit"
						variant="filled"
						size="large"
						:class="$style.loginButton"
						:disabled="isLoading"
					>
						<span v-if="isLoading">{{ t('auth.loading') }}</span>
						<span v-else>{{
							isRegisterMode
								? t('auth.registerCustomer')
								: isSellerMode
									? t('auth.registerSeller')
									: t('auth.login')
						}}</span>
					</Button>
				</form>

				<div :class="$style.linksContainer">
					<a :class="$style.linkButton" @click="toggleSellerMode">
						{{
							isSellerMode
								? t('auth.becomeCustomer')
								: t('auth.becomeSeller')
						}}
					</a>

					<a
						v-if="isSellerMode || isRegisterMode"
						:class="$style.linkButton"
						@click="handlePasswordRecovery"
					>
						{{ t('auth.recoverPassword') }}
					</a>

					<a
						v-else
						:class="$style.linkButton"
						@click="handleRegister"
					>
						{{ t('auth.register') }}
					</a>
				</div>
			</div>
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, watch } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'effector-vue/composition';
	import { useI18n } from 'vue-i18n';
	import { Header, Footer } from '../../widgets';
	import { Input, Button, SuccessAlert } from '../../shared/ui';
	import { SettingsModal } from '@features/settings';
	import { RequisitesModal } from '@features/requisites';
	import { loginUser, registerUser } from '@shared/api';
	import {
		deleteAccount,
		saveRequisites,
		saveSettings,
	} from '@shared/api/user.api';
	import type { UserSettings } from '@shared/api/user.api';
	import { setUser, resetUser, $user } from '@entities/user/user.store';
	import {
		isUserAuthenticated,
		setAuthenticationStatus,
	} from '@shared/utils/auth';
	import { Recommendations } from '@entities/product/ui/recommendations';
	import { addItem } from '@entities/cart/cart.store';
	import type { Product } from '@entities/product/product.types';
	import { getFavoriteProducts } from '@shared/utils/favorites';
	import { getRecentlyViewedProducts } from '@shared/utils/recentlyViewed';
	import { showToast } from '@shared/model';
	import userCircleIcon from '@assets/user_circle.svg';
	import cardIcon from '@assets/card.svg';
	import docsIcon from '@assets/docs.svg';
	import chatIcon from '@assets/chat.svg';
	import settingsIcon from '@assets/settings.svg';
	import favouritesIcon from '@assets/favourutes.svg';
	import boxIcon from '@assets/box.svg';
	import $style from './Profile.module.css';

	const { t } = useI18n();
	const router = useRouter();
	const user = useStore($user);

	// Check if user is authenticated
	const isAuthenticated = ref(false);

	// Check authentication on mount
	onMounted(() => {
		isAuthenticated.value = isUserAuthenticated() && user.value !== null;
		updateFavoritesCount();
		recentlyViewedProducts.value = getRecentlyViewedProducts();
	});

	// Watch for user changes to update authentication status
	watch(user, (newUser) => {
		isAuthenticated.value = isUserAuthenticated() && newUser !== null;
	});

	// Loading states
	const isLoading = ref(false);

	// Режимы формы
	const isSellerMode = ref(false);
	const isRegisterMode = ref(false);
	const showSuccessAlert = ref(false);
	const showSettingsModal = ref(false);
	const showRequisitesModal = ref(false);

	// Favorites count
	const favoritesCount = ref(0);

	// Update favorites count
	const updateFavoritesCount = () => {
		favoritesCount.value = getFavoriteProducts().length;
	};

	// Helper function for correct Russian pluralization
	const getFavoritesText = (count: number): string => {
		const lastDigit = count % 10;
		const lastTwoDigits = count % 100;

		if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
			return t('profile.items5');
		}

		if (lastDigit === 1) {
			return t('profile.items');
		}

		if (lastDigit >= 2 && lastDigit <= 4) {
			return t('profile.items2');
		}

		return t('profile.items5');
	};

	// Вычисляемое свойство для определения роли пользователя
	const currentUserRole = computed<'customer' | 'partner' | 'admin' | null>(
		() => {
			if (isSellerMode.value) {
				return 'partner';
			}
			// В будущем здесь будет проверка ответа от бэкенда для admin
			// Пока что можно раскомментировать для тестирования:
			// return 'admin';
			return null;
		},
	);

	// Вычисляемое свойство для отображения роли в Header
	const displayUserRole = computed<'customer' | 'partner' | 'admin' | null>(
		() => {
			if (isAuthenticated.value && user.value) {
				const role = user.value.role;
				if (role === 'CUSTOMER') return 'customer';
				if (role === 'SELLER') return 'partner';
				if (role === 'ADMIN') return 'admin';
			}
			return currentUserRole.value;
		},
	);

	// Поля для входа покупателя
	const login = ref('');
	const password = ref('');

	// Поля для регистрации покупателя
	const customerName = ref('');
	const customerPhone = ref('');
	const customerEmail = ref('');
	const customerPassword = ref('');

	// Поля для продавца
	const sellerName = ref('');
	const sellerPhone = ref('');
	const sellerEmail = ref('');
	const sellerPassword = ref('');

	// Ошибки валидации
	const loginError = ref('');
	const passwordError = ref('');
	const customerNameError = ref('');
	const customerPhoneError = ref('');
	const customerEmailError = ref('');
	const customerPasswordError = ref('');
	const sellerNameError = ref('');
	const sellerPhoneError = ref('');
	const sellerEmailError = ref('');
	const sellerPasswordError = ref('');

	// Функции валидации
	const validateEmail = (email: string): string => {
		if (!email) return t('validation.emailRequired');
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return t('validation.emailInvalid');
		return '';
	};

	const validatePhone = (phone: string): string => {
		if (!phone) return t('validation.phoneRequired');
		const phoneRegex = /^[\d\s\+\-\(\)]+$/;
		if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
			return t('validation.phoneInvalid');
		}
		return '';
	};

	const validatePassword = (password: string): string => {
		if (!password) return t('validation.passwordRequired');
		if (password.length < 6) return t('validation.passwordMinLength');
		return '';
	};

	const validateName = (name: string): string => {
		if (!name) return t('validation.nameRequired');
		if (name.length < 2) return t('validation.nameMinLength');
		return '';
	};

	const validateLogin = (login: string): string => {
		if (!login) return t('validation.loginRequired');
		return '';
	};

	// Очистка ошибок
	const clearErrors = () => {
		loginError.value = '';
		passwordError.value = '';
		customerNameError.value = '';
		customerPhoneError.value = '';
		customerEmailError.value = '';
		customerPasswordError.value = '';
		sellerNameError.value = '';
		sellerPhoneError.value = '';
		sellerEmailError.value = '';
		sellerPasswordError.value = '';
	};

	// Валидация формы входа
	const validateLoginForm = (): boolean => {
		clearErrors();
		let isValid = true;

		loginError.value = validateLogin(login.value);
		if (loginError.value) isValid = false;

		passwordError.value = validatePassword(password.value);
		if (passwordError.value) isValid = false;

		return isValid;
	};

	// Валидация формы регистрации покупателя
	const validateCustomerForm = (): boolean => {
		clearErrors();
		let isValid = true;

		customerNameError.value = validateName(customerName.value);
		if (customerNameError.value) isValid = false;

		customerPhoneError.value = validatePhone(customerPhone.value);
		if (customerPhoneError.value) isValid = false;

		customerEmailError.value = validateEmail(customerEmail.value);
		if (customerEmailError.value) isValid = false;

		customerPasswordError.value = validatePassword(customerPassword.value);
		if (customerPasswordError.value) isValid = false;

		return isValid;
	};

	// Валидация формы регистрации продавца
	const validateSellerForm = (): boolean => {
		clearErrors();
		let isValid = true;

		sellerNameError.value = validateName(sellerName.value);
		if (sellerNameError.value) isValid = false;

		sellerPhoneError.value = validatePhone(sellerPhone.value);
		if (sellerPhoneError.value) isValid = false;

		sellerEmailError.value = validateEmail(sellerEmail.value);
		if (sellerEmailError.value) isValid = false;

		sellerPasswordError.value = validatePassword(sellerPassword.value);
		if (sellerPasswordError.value) isValid = false;

		return isValid;
	};

	const handleLogin = async () => {
		// Валидация в зависимости от режима
		let isValid = false;
		if (isRegisterMode.value) {
			isValid = validateCustomerForm();
		} else if (isSellerMode.value) {
			isValid = validateSellerForm();
		} else {
			isValid = validateLoginForm();
		}

		if (!isValid) {
			return;
		}

		isLoading.value = true;

		try {
			if (isRegisterMode.value) {
				// Регистрация покупателя
				const response = await registerUser({
						name: customerName.value,
						phone: customerPhone.value,
						email: customerEmail.value,
						password: customerPassword.value,
						role: 'CUSTOMER',
					});

				if (response.success && response.data) {
					// Показываем сообщение об успешной регистрации
					alert(response.data.message);
					// Переключаемся на форму входа
					isRegisterMode.value = false;
					clearAllFields();
				}
			} else if (isSellerMode.value) {
				// Регистрация продавца
				const response = await registerUser({
						name: sellerName.value,
						phone: sellerPhone.value,
						email: sellerEmail.value,
						password: sellerPassword.value,
						role: 'SELLER',
					});

				if (response.success) {
					// Показываем success alert для продавца
					showSuccessAlert.value = true;
					clearAllFields();
				}
			} else {
				// Вход в систему
				const response = await loginUser({
						login: login.value,
						password: password.value,
					});

				if (response.success && response.data) {
					// Сохраняем пользователя в store
					setUser(response.data);

					// Устанавливаем cookie аутентификации
					setAuthenticationStatus(true);

					// Обновляем статус аутентификации
					isAuthenticated.value = true;

					// Перенаправляем в зависимости от роли
					if (response.data.role === 'SELLER') {
						router.push('/b2b');
					} else if (response.data.role === 'ADMIN') {
						router.push('/admin');
					} else {
						router.push('/'); // Покупатели на главную
					}
				} else {
					// Ошибка входа - показываем тост и делаем инпуты красными
					showToast({
						message: t('validation.loginError'),
						type: 'error',
					});
					loginError.value = t('validation.invalidCredentials');
					passwordError.value = t('validation.invalidCredentials');
				}
			}
		} catch (error) {
			console.error('Login error:', error);
		} finally {
			isLoading.value = false;
		}
	};

	const handleRegister = () => {
		// Switch to customer registration mode
		isRegisterMode.value = true;
		isSellerMode.value = false;

		// Clear all fields
		clearAllFields();
	};

	const toggleSellerMode = () => {
		// Toggle between seller and customer mode
		isSellerMode.value = !isSellerMode.value;

		// If switching to seller mode, disable register mode
		if (isSellerMode.value) {
			isRegisterMode.value = false;
		}

		// Clear all fields when switching modes
		clearAllFields();
	};

	const handlePasswordRecovery = () => {
		// Password recovery page is not yet implemented — no-op
	};

	const clearAllFields = () => {
		login.value = '';
		password.value = '';
		customerName.value = '';
		customerPhone.value = '';
		customerEmail.value = '';
		customerPassword.value = '';
		sellerName.value = '';
		sellerPhone.value = '';
		sellerEmail.value = '';
		sellerPassword.value = '';
		clearErrors();
	};

	const handleLogout = () => {
		resetUser();
		setAuthenticationStatus(false);
		isAuthenticated.value = false;
		router.push('/');
	};

	// Recently viewed products — populated from localStorage on mount
	const recentlyViewedProducts = ref<Product[]>([]);

	// Handlers for action items
	const handleProfileEdit = () => {
		// Scroll to top of the profile page (user is already on /profile)
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handlePaymentMethods = () => {
		// Navigate to purchases tab (closest existing page for payment/order history)
		router.push('/favorites?tab=purchases');
	};

	const handleRequisites = () => {
		showRequisitesModal.value = true;
	};

	const handleSaveRequisites = async (requisitesData: any) => {
		try {
			await saveRequisites(requisitesData);
			showToast({ message: t('profile.requisitesSaved'), type: 'success' });
		} catch {
			showToast({ message: t('profile.requisitesError'), type: 'error' });
		}
	};

	const handleSupport = () => {
		// Открытие внешней формы поддержки — не требует API
	};

	const handleSettings = () => {
		showSettingsModal.value = true;
	};

	const handleSaveSettings = async (settings: any[]) => {
		try {
			const payload: UserSettings = {
				notifications:
					settings.find((s) => s.id === 'notifications')
						?.enabled ?? true,
				email:
					settings.find((s) => s.id === 'email')?.enabled ?? true,
				marketing:
					settings.find((s) => s.id === 'marketing')?.enabled ??
					false,
				analytics:
					settings.find((s) => s.id === 'analytics')?.enabled ??
					true,
			};
			await saveSettings(payload);
			showToast({ message: t('profile.settingsSaved'), type: 'success' });
		} catch {
			showToast({ message: t('profile.settingsError'), type: 'error' });
		}
	};

	const handleDeleteAccount = async () => {
		if (!confirm(t('profile.deleteAccountConfirm'))) return;
		try {
			await deleteAccount();
			handleLogout();
		} catch {
			showToast({ message: t('profile.deleteAccountError'), type: 'error' });
		}
	};

	// Handlers for recommendations
	const handleProductClick = (product: Product) => {
		router.push(`/product/${product.id}`);
	};

	const handleAddToCart = (product: Product) => {
		addItem({
			id: product.id,
			product: product,
			quantity: 1,
			price: product.price,
			discount: product.discount,
			currency: product.currency,
		});
	};
</script>
