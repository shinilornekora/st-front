<template>
  <div :class="$style.page">
    <Header :hide-search="true"/>
    <main :class="$style.main">
      <div v-if="cartItemsCount === 0" :class="$style.emptyCart">
        <img src="@assets/plain_cart_icon.svg" :alt="t('cart.empty')" :class="$style.cartIcon" />
        <Button type="accent" @click="goToShop" :class="$style.customButton">{{ t('cart.goToShop') }}</Button>
      </div>

      <div v-else :class="$style.cartContainer">
        <div :class="$style.cartContent">
          <div :class="$style.cartItems">
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :id="item.id"
              :image="item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''"
              :title="item.product.name"
              :price="item.price"
              :qty="item.quantity"
              :article="item.product.article"
              :selected-color="item.selectedColor"
              @remove="removeFromCart(item.id)"
              @update-quantity="updateQuantity"
              @favourite="addToFavourites(item)"
              @share="shareProduct(item)"
              @product-click="goToProduct"
            />
          </div>
          
          <div :class="$style.cartSummary">
            <div :class="$style.summaryItem">
              <span>{{ t('cart.items') }} ({{ cartItemsCount }})</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <div :class="$style.summaryItem">
              <span>{{ t('cart.delivery') }}</span>
              <span>{{ t('cart.free') }}</span>
            </div>
            <div :class="$style.summaryTotal">
              <span>{{ t('cart.total') }}</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <Button type="accent" @click="checkout" :class="$style.checkoutBtn">{{ t('cart.checkout') }}</Button>
          </div>
        </div>
      </div>

      <!-- Similar Products Section -->
      <section :class="$style.similarSection">
        <h5 :class="$style.sectionTitle">{{ t('cart.youMayLike') }}</h5>
        
        <div :class="$style.similarProducts">
          <ProductCard
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            :id="similarProduct.id"
            :image="similarProduct.images[0]"
            :title="similarProduct.name"
            :price="similarProduct.price"
            :recommendation="true"
            :product="similarProduct"
            @click="goToProduct"
            @add-to-cart="addSimilarToCart(similarProduct)"
            @favourite="addToFavourites(similarProduct)"
          />
        </div>
      </section>
    </main>
    <Footer />
    
    <!-- Status Line -->
    <StatusLine :show="showStatusLine" :message="t('cart.linkCopied')" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { useI18n } from 'vue-i18n';
import { $cart, removeItem, updateQty } from '@entities/cart/cart.store';
import { addItem } from '@entities/cart/cart.store';
import type { Product } from '@entities/product/product.types';
import { Header, Footer } from '@widgets/index';
import { StatusLine } from '@shared/ui';
import Button from '@shared/ui/Button.vue';
import ProductCard from '@entities/product/ui/ProductCard.vue';
import CartItem from '@entities/cart/ui/CartItem.vue';
import { getProducts } from '@shared/api';
import { isUserAuthenticated } from '@shared/utils/auth';

const { t } = useI18n();

const router = useRouter();
const cart = useStore($cart);

// Force reactivity with watchEffect
watchEffect(() => {
  // Just accessing the cart value to ensure reactivity
  cart.value;
});

// Create reactive computed properties
const cartItems = computed(() => cart.value.items);
const cartTotal = computed(() => cart.value.total);
const cartItemsCount = computed(() => cart.value.items.length);

// Similar products state
const similarProducts = ref<Product[]>([]);
// Status line state
const showStatusLine = ref(false);

// Load similar products on mount
onMounted(async () => {
  // Get products using API
  const response = await getProducts({ __mock: true });
  
  if (response.success && response.data) {
    const cartItemIds = cartItems.value.map(item => item.id);
    
    // Filter out products already in cart and take 5 random ones
    const availableProducts = response.data.filter(product => !cartItemIds.includes(product.id));
    similarProducts.value = availableProducts.slice(0, 5);
  }
});

const goToShop = () => {
  router.push('/');
};

const removeFromCart = (itemId: number) => {
  removeItem(itemId);
};

const updateQuantity = (payload: { id: number; quantity: number }) => {
  updateQty(payload);
};

const addToFavourites = (item: any) => {
  // TODO: Implement add to favourites logic
  // Handle both cart items (with product property) and recommendation products (direct)
  const productName = item.product ? item.product.name : item.name;
  const productId = item.product ? item.product.id : item.id;
  console.log('Added to favourites:', productName, 'ID:', productId);
};

const shareProduct = async (item: any) => {
  try {
    // Get the product ID from the cart item
    const productId = item.product ? item.product.id : item.id;
    
    // Generate the dynamic URL for the product
    const productUrl = `${window.location.origin}/product/${productId}`;
    
    // Copy the URL to clipboard
    await navigator.clipboard.writeText(productUrl);
    console.log('Product URL copied to clipboard:', productUrl);
    
    // Show status line
    showStatusLine.value = true;
    setTimeout(() => {
      showStatusLine.value = false;
    }, 2500);
  } catch (err) {
    console.error('Failed to copy product URL:', err);
    // Fallback for older browsers
    const productId = item.product ? item.product.id : item.id;
    const productUrl = `${window.location.origin}/product/${productId}`;
    const textArea = document.createElement('textarea');
    textArea.value = productUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Show status line
    showStatusLine.value = true;
    setTimeout(() => {
      showStatusLine.value = false;
    }, 2500);
  }
};

const checkout = () => {
  // Check if user is authenticated
  if (!isUserAuthenticated()) {
    // Redirect to login page if not authenticated
    router.push('/profile');
    return;
  }
  
  // TODO: Implement checkout logic for authenticated users
  console.log('Checkout for authenticated user');
};

const formatPrice = (price: number) => {
  return `${price.toLocaleString('ru-RU')} ₽`;
};

const addSimilarToCart = (similarProduct: Product) => {
  addItem({
    id: similarProduct.id,
    product: similarProduct,
    quantity: 1,
    price: similarProduct.price,
    discount: similarProduct.discount,
    currency: similarProduct.currency,
  });
};

const goToProduct = (productOrId: number | Product) => {
  // Handle both number (from CartItem) and Product object (from ProductCard)
  const productId = typeof productOrId === 'number' ? productOrId : productOrId.id;
  router.push(`/product/${productId}`);
};
</script>

<style module>
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
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

.emptyCart {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin-top: 0;
  margin-bottom: 48px;
  align-self: center;
}

.cartIcon {
  width: 320px;
  height: 320px;
  margin-bottom: 32px;
  opacity: 0.7;
}

.customButton {
  width: 270px;
  height: 54px;
}

/* Cart Container */
.cartContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cartTitle {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--color-primary);
}

.cartContent {
  display: flex;
  gap: 32px;
  flex: 1;
}

.cartItems {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cartSummary {
  width: 320px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 24px;
}

.summaryItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 16px;
  color: var(--color-secondary);
}

.summaryTotal {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.checkoutBtn {
  width: 100%;
  height: 48px;
}

/* Similar Products */
.similarSection {
  background: var(--background-default);
  padding: 32px;
  border-radius: 16px;
  margin-top: 48px;
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  text-align: left;
  margin: 0 0 24px 0;
}

.similarProducts {
  gap: 24px;
  display: flex;
  margin-top: 24px;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.similarProducts::-webkit-scrollbar {
  display: none;
}

.similarProducts :deep(.productCard) {
  flex-shrink: 0;
}

@media (min-width: 769px) {
  .cartIcon {
    width: 440px;
    height: 440px;
  }
}

@media (max-width: 1024px) {
  .cartContent {
    flex-direction: column;
  }
  
  .cartSummary {
    width: auto;
    position: static;
  }
}

@media (max-width: 768px) {
  .cartTitle {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .cartSummary {
    width: auto;
  }

  .similarSection {
    padding: 0;
    margin-top: 32px;
  }
  
  .similarProducts {
    gap: 12px;
  }
}

/* Status Line */
.statusLine {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--background-default);
  color: var(--color-dark);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
