<template>
  <div :class="$style.page">
    <Header :hideSearch="true" />
    <main :class="$style.main">
      <div :class="$style.formContainer">
        <form :class="$style.form" @submit.prevent="handleLogin">
          <div :class="$style.inputGroup">
            <div :class="$style.inputLabel">Телефон или почта</div>
            <Input
              v-model="login"
              placeholder="Телефон или почта"
              variant="default"
              :class="$style.input"
            />
          </div>
          
          <div :class="$style.inputGroup">
            <div :class="$style.inputLabel">Пароль</div>
            <Input
              v-model="password"
              type="password"
              placeholder="Пароль"
              variant="default"
              showPasswordToggle
              :class="$style.input"
            />
          </div>
          
          <Button
            type="accent"
            typeAttr="submit"
            variant="filled"
            size="large"
            :class="$style.loginButton"
          >
            Войти
          </Button>
        </form>
        
        <div :class="$style.linksContainer">
          <a
            :class="$style.linkButton"
            @click="handleBecomeSeller"
          >
            Хочу стать продавцом
          </a>
          
          <a
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
import { ref } from 'vue';
import { Header, Footer } from '../../widgets';
import { Input, Button } from '../../shared/ui';

const login = ref('');
const password = ref('');

const handleLogin = () => {
  // Handle login logic here
  console.log('Login attempt:', { login: login.value, password: password.value });
};

const handleRegister = () => {
  // Handle registration navigation
  console.log('Navigate to registration');
};

const handleBecomeSeller = () => {
  // Handle become seller navigation
  console.log('Navigate to seller application');
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

@media (max-width: 480px) {
  .formContainer {
    padding: 24px 16px;
  }
  
  .title {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .linksContainer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
