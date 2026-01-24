import { createApp } from 'vue';
import App from './App.vue';
import { router } from './app/router';
import { getCartFx } from './entities/cart/cart.store';
import './style.css';

// Initialize cart on app startup
getCartFx();

const app = createApp(App);
app.use(router);
app.mount('#app');
