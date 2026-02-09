<template>
  <div :class="$style.page">
    <Header :hideSearch="true" :userRole="displayUserRole" />
    
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
    <SuccessAlert v-model="showSuccessAlert" title="В процессе рассмотрения">
      <p>Ваша заявка в данный момент ожидает резолюции от администратора, пожалуйста, подождите.</p>
      <p>После рассмотрения вашей заявки, на указанную электронную почту придет резолюция, после чего использовав ваши данные для входа, вы сможете войти в ваш аккаунт.</p>
      <p>Если рассмотрение заявки занимает более трех дней, вы можете написать нам на почту, после чего мы проверим актуальный статус вашей заявки, и сообщим вам примерные сроки.</p>
    </SuccessAlert>
    
    <main :class="$style.main">
      <!-- Profile View (when authenticated) -->
      <div v-if="isAuthenticated && user" :class="$style.profileWrapper">
        <!-- Admin/Seller View: Only Actions Block -->
        <div v-if="user.role === 'ADMIN' || user.role === 'SELLER'" :class="$style.adminLayout">
          <div :class="$style.actionsBlock">
            <nav :class="$style.actionsList">
              <a :class="[$style.actionItem, $style.profileItem]" @click="handleProfileEdit">
                <div :class="$style.avatar">
                  <img :src="userCircleIcon" alt="User" :class="$style.avatarIcon" />
                </div>
                <span>Профиль</span>
                <span :class="$style.userNameArrow">›</span>
              </a>
              <!-- Hide "Способы оплаты" for both ADMIN and SELLER -->
              <!-- Hide "Реквизиты" for ADMIN only -->
              <a v-if="user.role === 'SELLER'" :class="$style.actionItem" @click="handleRequisites">
                <img :src="docsIcon" alt="" :class="$style.actionIcon" />
                <span>Реквизиты</span>
              </a>
              <a :class="$style.actionItem" @click="handleSupport">
                <img :src="chatIcon" alt="" :class="$style.actionIcon" />
                <span>Написать в поддержку</span>
              </a>
              <a :class="$style.actionItem" @click="handleSettings">
                <img :src="settingsIcon" alt="" :class="$style.actionIcon" />
                <span>Настройки</span>
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
                <a :class="[$style.actionItem, $style.profileItem]" @click="handleProfileEdit">
                  <div :class="$style.avatar">
                    <img :src="userCircleIcon" alt="User" :class="$style.avatarIcon" />
                  </div>
                  <span>Профиль</span>
                  <span :class="$style.userNameArrow">›</span>
                </a>
                <a :class="$style.actionItem" @click="handlePaymentMethods">
                  <img :src="cardIcon" alt="" :class="$style.actionIcon" />
                  <span>Способы оплаты</span>
                </a>
                <a :class="$style.actionItem" @click="handleRequisites">
                  <img :src="docsIcon" alt="" :class="$style.actionIcon" />
                  <span>Реквизиты</span>
                </a>
                <a :class="$style.actionItem" @click="handleSupport">
                  <img :src="chatIcon" alt="" :class="$style.actionIcon" />
                  <span>Написать в поддержку</span>
                </a>
                <a :class="$style.actionItem" @click="handleSettings">
                  <img :src="settingsIcon" alt="" :class="$style.actionIcon" />
                  <span>Настройки</span>
                </a>
              </nav>
            </div>

            <!-- Right Column: Links Block and Carousel -->
            <div :class="$style.rightColumn">
              <div :class="$style.linksBlock">
                <router-link to="/favorites" :class="$style.linkCard">
                  <div :class="$style.linkHeader">
                    <h3 :class="$style.linkTitle">Избранное</h3>
                    <img :src="favouritesIcon" alt="" :class="$style.linkIcon" />
                  </div>
                  <p :class="$style.linkDescription">{{ favoritesCount }} {{ getFavoritesText(favoritesCount) }}</p>
                </router-link>
                
                <router-link to="/favorites?tab=purchases" :class="$style.linkCard">
                  <div :class="$style.linkHeader">
                    <h3 :class="$style.linkTitle">Покупки</h3>
                    <img :src="boxIcon" alt="" :class="$style.linkIcon" />
                  </div>
                  <p :class="$style.linkDescription">Смотреть</p>
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
          <div v-if="recentlyViewedProducts.length > 0" :class="$style.recentlyViewedSection">
            <Recommendations
              title="Недавно смотрели:"
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
              <div :class="$style.inputLabel">Телефон или почта</div>
              <Input
                v-model="login"
                placeholder="Телефон или почта"
                :variant="loginError ? 'error' : 'default'"
                :error="Boolean(loginError)"
                :class="$style.input"
              />
            </div>
            
            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Пароль</div>
              <Input
                v-model="password"
                type="password"
                placeholder="Пароль"
                :variant="passwordError ? 'error' : 'default'"
                :error="Boolean(passwordError)"
                showPasswordToggle
                :class="$style.input"
              />
            </div>
          </template>

          <!-- Форма для регистрации покупателя (4 поля) -->
          <template v-else-if="isRegisterMode">
            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Имя</div>
              <Input
                v-model="customerName"
                placeholder="Имя"
                :variant="customerNameError ? 'error' : 'default'"
                :error="Boolean(customerNameError)"
                :class="$style.input"
              />
            </div>

            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Номер телефона</div>
              <Input
                v-model="customerPhone"
                placeholder="Номер телефона"
                :variant="customerPhoneError ? 'error' : 'default'"
                :error="Boolean(customerPhoneError)"
                :class="$style.input"
              />
            </div>

            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Email</div>
              <Input
                v-model="customerEmail"
                type="email"
                placeholder="Email"
                :variant="customerEmailError ? 'error' : 'default'"
                :error="Boolean(customerEmailError)"
                :class="$style.input"
              />
            </div>
            
            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Пароль</div>
              <Input
                v-model="customerPassword"
                type="password"
                placeholder="Пароль"
                :variant="customerPasswordError ? 'error' : 'default'"
                :error="Boolean(customerPasswordError)"
                showPasswordToggle
                :class="$style.input"
              />
            </div>
          </template>

          <!-- Форма для продавца (4 поля) -->
          <template v-else>
            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Имя</div>
              <Input
                v-model="sellerName"
                placeholder="Имя"
                :variant="sellerNameError ? 'error' : 'default'"
                :error="Boolean(sellerNameError)"
                :class="$style.input"
              />
            </div>

            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Номер телефона</div>
              <Input
                v-model="sellerPhone"
                placeholder="Номер телефона"
                :variant="sellerPhoneError ? 'error' : 'default'"
                :error="Boolean(sellerPhoneError)"
                :class="$style.input"
              />
            </div>

            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Email</div>
              <Input
                v-model="sellerEmail"
                type="email"
                placeholder="Email"
                :variant="sellerEmailError ? 'error' : 'default'"
                :error="Boolean(sellerEmailError)"
                :class="$style.input"
              />
            </div>
            
            <div :class="$style.inputGroup">
              <div :class="$style.inputLabel">Пароль</div>
              <Input
                v-model="sellerPassword"
                type="password"
                placeholder="Пароль"
                :variant="sellerPasswordError ? 'error' : 'default'"
                :error="Boolean(sellerPasswordError)"
                showPasswordToggle
                :class="$style.input"
              />
            </div>
          </template>
          
          <Button
            type="accent"
            typeAttr="submit"
            variant="filled"
            size="large"
            :class="$style.loginButton"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Загрузка...</span>
            <span v-else>{{ isRegisterMode ? 'Зарегистрироваться' : isSellerMode ? 'Зарегистрироваться как продавец' : 'Войти' }}</span>
          </Button>
        </form>
        
        <div :class="$style.linksContainer">
          <a
            :class="$style.linkButton"
            @click="toggleSellerMode"
          >
            {{ isSellerMode ? 'Хочу стать покупателем' : 'Хочу стать продавцом' }}
          </a>
          
          <a
            v-if="isSellerMode || isRegisterMode"
            :class="$style.linkButton"
            @click="handlePasswordRecovery"
          >
            Восстановить пароль
          </a>
          
          <a
            v-else
            :class="$style.linkButton"
            @click="handleRegister"
          >
            Зарегистрироваться
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
import { Header, Footer } from '../../widgets';
import { Input, Button, SettingsModal, RequisitesModal, SuccessAlert } from '../../shared/ui';
import { loginUser, registerUser } from '@shared/api';
import { setUser, resetUser, $user } from '@entities/user/user.store';
import { isUserAuthenticated, setAuthenticationStatus } from '@shared/utils/auth';
import { Recommendations } from '@entities/product/ui/recommendations';
import { addItem } from '@entities/cart/cart.store';
import type { Product } from '@entities/product/product.types';
import { getFavoriteProducts } from '@shared/utils/favorites';
import { showToast } from '@shared/ui/toast.store';
import userCircleIcon from '@assets/user_circle.svg';
import cardIcon from '@assets/card.svg';
import docsIcon from '@assets/docs.svg';
import chatIcon from '@assets/chat.svg';
import settingsIcon from '@assets/settings.svg';
import favouritesIcon from '@assets/favourutes.svg';
import boxIcon from '@assets/box.svg';

const router = useRouter();
const user = useStore($user);

// Check if user is authenticated
const isAuthenticated = ref(false);

// Check authentication on mount
onMounted(() => {
  isAuthenticated.value = isUserAuthenticated() && user.value !== null;
  updateFavoritesCount();
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
    return 'товаров';
  }
  
  if (lastDigit === 1) {
    return 'товар';
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }
  
  return 'товаров';
};

// Вычисляемое свойство для определения роли пользователя
const currentUserRole = computed<'customer' | 'partner' | 'admin' | null>(() => {
  if (isSellerMode.value) {
    return 'partner';
  }
  // В будущем здесь будет проверка ответа от бэкенда для admin
  // Пока что можно раскомментировать для тестирования:
  // return 'admin';
  return null;
});

// Вычисляемое свойство для отображения роли в Header
const displayUserRole = computed<'customer' | 'partner' | 'admin' | null>(() => {
  if (isAuthenticated.value && user.value) {
    const role = user.value.role;
    if (role === 'CUSTOMER') return 'customer';
    if (role === 'SELLER') return 'partner';
    if (role === 'ADMIN') return 'admin';
  }
  return currentUserRole.value;
});

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
  if (!email) return 'Email обязателен';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Некорректный формат email';
  return '';
};

const validatePhone = (phone: string): string => {
  if (!phone) return 'Телефон обязателен';
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return 'Некорректный формат телефона';
  }
  return '';
};

const validatePassword = (password: string): string => {
  if (!password) return 'Пароль обязателен';
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
  return '';
};

const validateName = (name: string): string => {
  if (!name) return 'Имя обязательно';
  if (name.length < 2) return 'Имя должно содержать минимум 2 символа';
  return '';
};

const validateLogin = (login: string): string => {
  if (!login) return 'Логин обязателен';
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
        __mock: true // TODO: убрать когда будет реальный API
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
        __mock: true // TODO: убрать когда будет реальный API
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
        __mock: true // TODO: убрать когда будет реальный API
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
          message: 'Не удалось войти, проверьте правильность ввода логина и/или пароля',
          type: 'error'
        });
        loginError.value = 'Неверный логин или пароль';
        passwordError.value = 'Неверный логин или пароль';
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
  // Handle password recovery
  console.log('Navigate to password recovery');
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
  // Сбрасываем пользователя в store
  resetUser();
  
  // Удаляем cookie аутентификации
  setAuthenticationStatus(false);
  
  // Обновляем статус аутентификации
  isAuthenticated.value = false;
  
  // Перенаправляем на главную
  router.push('/');
};

// Mock data for recently viewed products (в будущем будет из localStorage или API)
const recentlyViewedProducts = ref<Product[]>([
  {
    id: 1,
    name: 'Кроссовки Nike Air Max',
    slug: 'nike-air-max',
    price: 12990,
    discount: 15,
    currency: 'RUB',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'],
    description: 'Удобные кроссовки для повседневной носки',
    category: [{ id: '1', name: 'Обувь' }],
    tags: [{ id: 't1', name: 'Спорт' }],
    sizes: ['40', '41', '42', '43'],
    stockStatus: 'in_stock',
    gender: 'unisex',
    inStock: true,
    seller: {
      id: 1,
      name: 'Nike Store',
      rating: 4.8
    }
  },
  {
    id: 2,
    name: 'Футболка Adidas',
    slug: 'adidas-tshirt',
    price: 2990,
    currency: 'RUB',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'],
    description: 'Спортивная футболка из дышащей ткани',
    category: [{ id: '2', name: 'Одежда' }],
    tags: [{ id: 't2', name: 'Спорт' }],
    sizes: ['S', 'M', 'L', 'XL'],
    stockStatus: 'in_stock',
    gender: 'unisex',
    inStock: true,
    seller: {
      id: 2,
      name: 'Adidas Store',
      rating: 4.7
    }
  },
  {
    id: 3,
    name: 'Рюкзак Puma',
    slug: 'puma-backpack',
    price: 4990,
    discount: 10,
    currency: 'RUB',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'],
    description: 'Вместительный рюкзак для спорта и путешествий',
    category: [{ id: '3', name: 'Аксессуары' }],
    tags: [{ id: 't3', name: 'Аксессуары' }],
    sizes: ['One Size'],
    stockStatus: 'in_stock',
    gender: 'unisex',
    inStock: true,
    seller: {
      id: 3,
      name: 'Puma Store',
      rating: 4.9
    }
  }
]);

// Handlers for action items
const handleProfileEdit = () => {
  console.log('Edit profile');
  // TODO: Открыть модальное окно редактирования профиля
};

const handlePaymentMethods = () => {
  console.log('Payment methods');
  // TODO: Перейти на страницу способов оплаты
};

const handleRequisites = () => {
  showRequisitesModal.value = true;
};

const handleSaveRequisites = (requisitesData: any) => {
  console.log('Save requisites:', requisitesData);
  // TODO: Сохранить реквизиты на сервер или в localStorage
  // Можно показать уведомление об успешном сохранении
};

const handleSupport = () => {
  console.log('Contact support');
  // TODO: Открыть форму обращения в поддержку
};

const handleSettings = () => {
  showSettingsModal.value = true;
};

const closeSettingsModal = () => {
  showSettingsModal.value = false;
};

const handleSaveSettings = (settings: any[]) => {
  console.log('Save settings:', settings);
  // TODO: Сохранить настройки в localStorage или отправить на сервер
};

const handleDeleteAccount = () => {
  console.log('Delete account');
  // TODO: Показать подтверждение и удалить аккаунт
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
    currency: product.currency
  });
};
</script>

<style module>
@import '../../shared/ui/theme.module.css';

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background-default);
}

@media (max-width: 480px) {
  .page {
    padding-bottom: 46px; /* Space for mobile footer */
  }
}

.main {
  flex: 1;
  padding: 96px 48px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.formContainer {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  background: var(--background-default);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(73, 164, 157, 0.1);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 32px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.inputGroup {
  width: 100%;
}

.input {
  width: 100%;
}

.input :global(.uiInput) {
  border-radius: 8px !important;
  background: var(--background-default) !important;
  background-color: var(--background-default) !important;
}

.input :global(.uiInput:-webkit-autofill),
.input :global(.uiInput:-webkit-autofill:hover),
.input :global(.uiInput:-webkit-autofill:focus),
.input :global(.uiInput:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: var(--color-primary) !important;
  background-color: var(--background-default) !important;
}

.input :global(.uiInput:-internal-autofill-selected) {
  background-color: var(--background-default) !important;
  background-image: none !important;
}

.inputLabel {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
}

.loginButton {
  width: 100%;
  margin-top: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

.loginButton :global(.btn) {
  border-radius: 8px !important;
}

.linksContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.linkButton {
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  background: none;
  box-shadow: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  color: var(--color-primary);
}

.linkButton:hover {
  transform: none;
  box-shadow: none;
  color: var(--color-primary);
  text-decoration: underline;
}

@media (max-width: 769px) {
  .formContainer {
    padding: 24px 16px;
  }
  
  .title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .main {
    padding: 0;
  }
  
  .linksContainer {
    align-items: center !important;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

.profileContainer {
  width: 100%;
  max-width: 600px;
  padding: 32px;
  border-radius: 16px;
  background: var(--background-default);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(73, 164, 157, 0.1);
}

.profileTitle {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 32px;
  text-align: center;
}

.profileInfo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.infoRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.infoLabel {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
}

.infoValue {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-align: right;
}

.logoutButton {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

.logoutButton :global(.btn) {
  border-radius: 8px !important;
}

@media (max-width: 769px) {
  .profileContainer {
    padding: 24px 16px;
  }
  
  .profileTitle {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .infoRow {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .infoValue {
    text-align: left;
  }
}

/* Profile Wrapper */
.profileWrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 120px;
}

/* Admin Layout */
.adminLayout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 48px;
}

/* Profile Layout */
.profileLayout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  margin-bottom: 48px;
}

/* Actions Block */
.actionsBlock {
  background: var(--background-secondary);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  max-width: 334px;
}

.actionsList {
  display: flex;
  flex-direction: column;
}

.actionItem {
  padding: 16px 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: var(--color-primary);
  transition: background 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
}

.actionItem:hover {
  background: rgba(255, 255, 255, 0.5);
}

.profileItem {
  padding: 24px;
  justify-content: flex-start;
}

.profileItem:hover {
  background: #fafafa;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.avatarIcon {
  width: 32px;
  height: 32px;
  color: #666;
}

.userNameArrow {
  font-size: 20px;
  color: #999;
  margin-left: auto;
}

.actionIcon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Right Column */
.rightColumn {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Links Block */
.linksBlock {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.linkCard {
  background: var(--background-default);
  border-radius: 16px;
  padding: 24px;
  min-width: 338px;
  max-width: 412px;
  text-decoration: none;
  transition: box-shadow 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 87px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.linkCard:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.linkHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.linkTitle {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark);
  margin: 0;
}

.linkIcon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.linkDescription {
  font-size: 14px;
  color: var(--color-dark);
  text-align: left;
  margin: 0;
}

/* Hero Carousel */
.heroCarousel {
  display: flex;
  gap: 16px;
  align-items: center;
}

.heroCarouselCompact {
  display: none;
  gap: 16px;
  align-items: center;
}

.heroThumbnail {
  flex: 0 0 187px;
  height: 251px;
  max-width: 124px;
  background: var(--background-secondary);
  border-radius: 12px;
}

.heroMain {
  flex: 1;
  height: 251px;
  background: var(--background-secondary);
  border-radius: 12px;
  min-width: 0;
}

/* Recently Viewed Section */
.recentlyViewedSection {
  width: 100%;
}

/* Responsive */
@media (max-width: 1200px) {
  .profileWrapper {
    padding: 0 24px;
  }

  .linksBlock {
    display: flex;
    flex-direction: column;
  }

  .heroCarousel {
    display: none;
  }
  
  .heroCarouselCompact {
    display: flex;
  }
}

@media (max-width: 900px) {
  .profileLayout {
    grid-template-columns: 1fr;
  }
  
  .rightColumn {
    order: 2;
  }
  
  .linksBlock {
    grid-template-columns: 1fr;
  }
  
  .heroCarouselCompact {
    order: 3;
  }
}

@media (max-width: 768px) {
  .profileWrapper {
    padding: 0 16px;
  }
  
  .linksBlock {
    grid-template-columns: 1fr;
  }
  
  .placeholderBox {
    min-width: 107px;
    height: 71px;
  }
}
</style>
