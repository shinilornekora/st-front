import { createApp } from 'vue';
import App from './App.vue';
import { router } from './app/router';
import { i18n } from './shared/i18n';
import { getCartFx } from './entities/cart/cart.store';
import { initUserFx } from './entities/user/user.store';
import './style.css';

// Initialize cart and user on app startup
getCartFx();
initUserFx();

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
