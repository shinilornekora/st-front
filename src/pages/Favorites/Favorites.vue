<template>
  <div :class="$style.page">
    <Header />
    
    <main :class="$style.main">
      <div :class="$style.container">
        <!-- Header with back button -->
        <div :class="$style.header">
          <button :class="$style.backButton" @click="goBack" :aria-label="t('common.back')">
            <img :src="arrowLeftIcon" alt="" :class="$style.backIcon" />
          </button>
        </div>

        <!-- Tabs Navigation -->
        <div :class="$style.tabsWrapper">
          <div :class="$style.tabsLine"></div>
          <div :class="$style.tabs">
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'purchases' }]"
              @click="activeTab = 'purchases'"
            >
              {{ t('favorites.purchases') }}
            </button>
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'favorites' }]"
              @click="activeTab = 'favorites'"
            >
              {{ t('favorites.favorites') }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div :class="$style.content">
          <!-- Favorites Tab -->
          <div v-if="activeTab === 'favorites'" :class="$style.tabContent">
            <div v-if="favoriteProducts.length > 0" :class="$style.productsGrid">
              <ProductCard
                v-for="product in favoriteProducts"
                :key="product.id"
                :id="product.id"
                :image="product.images[0]"
                :title="product.name"
                :price="product.price"
                :discount="product.discount"
                :product="product"
                @click="handleProductClick(product)"
                @add-to-cart="handleAddToCart(product)"
              />
            </div>
            
            <div v-else :class="$style.emptyState">
              <p :class="$style.emptyText">{{ t('favorites.noFavorites') }}</p>
            </div>
          </div>

          <!-- Purchases Tab -->
          <div v-if="activeTab === 'purchases'" :class="$style.tabContent">
            <div :class="$style.emptyState">
              <p :class="$style.emptyText">{{ t('favorites.noPurchases') }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { useI18n } from 'vue-i18n';
import { Header, Footer } from '../../widgets';
import { ProductCard } from '@entities/product/ui';
import { addItem } from '@entities/cart/cart.store';
import { $products, getProductsFx } from '@entities/product/product.store';
import type { Product } from '@entities/product/product.types';
import { getFavoriteProducts } from '@shared/utils/favorites';
import arrowLeftIcon from '@assets/arrow_left_long.svg';

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const activeTab = ref<'purchases' | 'favorites'>('favorites');
const favoriteProducts = ref<Product[]>([]);
const products = useStore($products);

onMounted(async () => {
  // Check if tab query parameter is set
  const tabParam = route.query.tab as string;
  if (tabParam === 'purchases') {
    activeTab.value = 'purchases';
  }
  
  // Load all products if not already loaded
  if (products.value.length === 0) {
    await getProductsFx();
  }
  
  // Get favorite product IDs
  const favoriteIds = getFavoriteProducts();
  
  // Filter products to get only favorites
  favoriteProducts.value = products.value.filter(product =>
    favoriteIds.includes(product.id)
  ) as Product[];
});

const goBack = () => {
  router.back();
};

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

.main {
  flex: 1;
  padding: 6px 120px 48px;
  background: var(--background-default);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.backButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.backButton:hover {
  opacity: 0.7;
}

.backIcon {
  width: 24px;
  height: 24px;
}

/* Tabs */
.tabsWrapper {
  position: relative;
  margin-bottom: 40px;
}

.tabsLine {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e5e5;
}

.tabs {
  display: flex;
  gap: 0;
  position: relative;
}

.tab {
  background: none;
  border: none;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  margin-right: 48px;
}

.tab:hover {
  color: var(--color-primary);
}

.tabActive {
  color: var(--color-primary);
  font-weight: 600;
}

.tabActive::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
}

/* Content */
.content {
  padding: 24px 0;
}

.tabContent {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(234px, 1fr));
  gap: 24px;
  justify-items: center;
}

.emptyState {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.emptyText {
  font-size: 16px;
  color: var(--color-secondary);
  padding: 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e5e5;
}

/* Responsive */
@media (max-width: 1200px) {
  .main {
    padding: 6px 20px 48px;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 80px 16px 32px;
  }

  .tab {
    font-size: 14px;
    margin-right: 32px;
    padding: 12px 0;
  }

  .productsGrid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .emptyText {
    font-size: 14px;
    padding: 32px 16px;
  }
}

@media (max-width: 480px) {
  .page {
    padding-bottom: 46px;
  }

  .tab {
    margin-right: 24px;
  }

  .productsGrid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>
