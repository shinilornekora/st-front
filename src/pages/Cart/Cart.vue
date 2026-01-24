<template>
  <div :class="$style.page">
    <Header />
    <main :class="$style.main">
      <div v-if="cartItemsCount === 0" :class="$style.emptyCart">
        <img src="@assets/plain_cart_icon.svg" alt="Empty Cart" :class="$style.cartIcon" />
        <Button type="accent" @click="goToShop" :class="$style.customButton">Перейти к покупкам</Button>
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
              @remove="removeFromCart(item.id)"
              @update-quantity="updateQuantity"
              @favourite="addToFavourites(item)"
              @share="shareProduct(item)"
              @product-click="goToProduct"
            />
          </div>
          
          <div :class="$style.cartSummary">
            <div :class="$style.summaryItem">
              <span>Товары ({{ cartItemsCount }})</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <div :class="$style.summaryItem">
              <span>Доставка</span>
              <span>Бесплатно</span>
            </div>
            <div :class="$style.summaryTotal">
              <span>Итого</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            <Button type="accent" @click="checkout" :class="$style.checkoutBtn">Оформить заказ</Button>
          </div>
        </div>
      </div>

      <!-- Similar Products Section -->
      <section :class="$style.similarSection">
        <h5 :class="$style.sectionTitle">Вам может понравиться:</h5>
        
        <div :class="$style.similarProducts">
          <ProductCard
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            :id="similarProduct.id"
            :image="similarProduct.images[0]"
            :title="similarProduct.name"
            :price="similarProduct.price"
            :recommendation="true"
            @click="goToProduct(similarProduct.id)"
            @add-to-cart="addSimilarToCart(similarProduct)"
            @favourite="addToFavourites(similarProduct)"
          />
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { $cart, removeItem, updateQty } from '@entities/cart/cart.store';
import { addItem } from '@entities/cart/cart.store';
import type { Product } from '@entities/product/product.types';
import { Header, Footer } from '@widgets/index';
import Button from '@shared/ui/Button.vue';
import ProductCard from '@entities/product/ui/ProductCard.vue';
import CartItem from '@entities/cart/ui/CartItem.vue';
import { generateProducts, getSimilarProducts } from '@shared/lib/mockData';

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

// Load similar products on mount
onMounted(() => {
  // Get a random selection of products that aren't already in the cart
  const allProducts = generateProducts(10);
  const cartItemIds = cartItems.value.map(item => item.id);
  
  // Filter out products already in cart and take 5 random ones
  const availableProducts = allProducts.filter(product => !cartItemIds.includes(product.id));
  similarProducts.value = availableProducts.slice(0, 5);
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

const shareProduct = (item: any) => {
  // TODO: Implement share logic
  console.log('Shared product:', item.product.name);
};

const checkout = () => {
  // TODO: Implement checkout logic
  console.log('Checkout');
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

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};
</script>

<style module>
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
  color: #2c2c2c;
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
  color: #6b7280;
}

.summaryTotal {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: #2c2c2c;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.checkoutBtn {
  width: 100%;
  height: 48px;
}

/* Similar Products */
.similarSection {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-top: 48px;
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
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
    width: 100%;
    position: static;
  }
}

@media (max-width: 768px) {
  .cartTitle {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  .similarSection {
    padding: 0;
    margin-top: 32px;
  }
  
  .similarProducts {
    gap: 12px;
  }
}
</style>
