<template>
  <div :class="$style.page">
    <Header :hideSearch="true" :userRole="currentUserRole" />
    
    <!-- Success Alert Popup with Backdrop -->
    <transition name="fade">
      <div v-if="showSuccessAlert" :class="$style.alertBackdrop" @click="closeAlert">
        <div :class="$style.successAlert" @click.stop>
          <img :src="successCheckIcon" alt="" :class="$style.alertIcon" />
          <div :class="$style.alertContent">
            <div :class="$style.alertTitle">В процессе рассмотрения</div>
            <div :class="$style.alertText">
              <p>Ваша заявка в данный момент ожидает резолюции от администратора, пожалуйста, подождите.</p>
              <p>После рассмотрения вашей заявки, на указанную электронную почту придет резолюция, после чего использовав ваши данные для входа, вы сможете войти в ваш аккаунт.</p>
              <p>Если рассмотрение заявки занимает более трех дней, вы можете написать нам на почту, после чего мы проверим актуальный статус вашей заявки, и сообщим вам примерные сроки.</p>
            </div>
          </div>
          <button :class="$style.alertClose" @click="closeAlert" aria-label="Закрыть">
            <img :src="crossIcon" alt="" :class="$style.closeIcon" />
          </button>
        </div>
      </div>
    </transition>
    
    <main :class="$style.main">
      <div :class="$style.formContainer">
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Header, Footer } from '../../widgets';
import { Input, Button } from '../../shared/ui';
import { loginUser, registerUser } from '@shared/api';
import { setUser } from '@entities/user/user.store';
import successCheckIcon from '@assets/success_check.svg';
import crossIcon from '@assets/cross.svg';

const router = useRouter();

// Loading states
const isLoading = ref(false);

// Режимы формы
const isSellerMode = ref(false);
const isRegisterMode = ref(false);
const showSuccessAlert = ref(false);

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

        // Перенаправляем в зависимости от роли
        if (response.data.role === 'SELLER') {
          router.push('/b2b');
        } else if (response.data.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/'); // Покупатели на главную
        }
      }
    }
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const closeAlert = () => {
  showSuccessAlert.value = false;
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
</script>

<style module>
@import '../../shared/ui/theme.module.css';

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.alertBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.successAlert {
  width: 90%;
  max-width: 400px;
  min-height: 84px;
  background: #fff;
  border: 1px solid var(--color-success-light);
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alertIcon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 0;
}

.alertContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.alertTitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.2;
  text-align: left;
}

.alertText {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-secondary);
  line-height: 1.4;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alertText p {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--color-secondary);
  line-height: 1.4;
  text-align: left;
}

.alertClose {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;
  position: absolute;
  top: 16px;
  right: 16px;
}

.alertClose:hover {
  opacity: 0.7;
}

.closeIcon {
  width: 16px;
  height: 16px;
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
  background: #fff;
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
  background: #fff !important;
  background-color: #fff !important;
}

.input :global(.uiInput:-webkit-autofill),
.input :global(.uiInput:-webkit-autofill:hover),
.input :global(.uiInput:-webkit-autofill:focus),
.input :global(.uiInput:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: var(--color-primary) !important;
  background-color: #fff !important;
}

.input :global(.uiInput:-internal-autofill-selected) {
  background-color: #fff !important;
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

/* Transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
