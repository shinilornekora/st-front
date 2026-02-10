<template>
  <div :class="$style.page">
    <Header :userRole="'partner'" />
    
    <main :class="$style.main">
      <div :class="$style.container">
        <!-- Tabs Navigation -->
        <div :class="$style.tabsWrapper">
          <div :class="$style.tabsLine"></div>
          <div :class="$style.tabs">
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'analytics' }]"
              @click="activeTab = 'analytics'"
            >
              {{ t('b2b.analytics') }}
            </button>
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'products' }]"
              @click="activeTab = 'products'"
            >
              {{ t('b2b.productsList') }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div :class="$style.content">
          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" :class="$style.tabContent">
            <div v-if="isLoading" :class="$style.loading">{{ t('b2b.loading') }}</div>
            <div v-else-if="analytics">
              <!-- Stats Cards -->
              <div :class="$style.statsGrid">
                <!-- Revenue Card -->
                <div :class="$style.statCard">
                  <div :class="$style.statHeader">
                    <h3 :class="$style.statTitle">{{ t('b2b.totalRevenue') }}</h3>
                    <select :class="$style.periodSelect" v-model="revenuePeriod" @change="loadRevenueAnalytics">
                      <option value="month">{{ t('admin.month') }}</option>
                      <option value="quarter">{{ t('admin.quarter') }}</option>
                      <option value="year">{{ t('admin.year') }}</option>
                    </select>
                  </div>
                  <div :class="$style.statValue">{{ analytics.revenue.total }}</div>
                  <div :class="$style.statChange">{{ analytics.revenue.change }}</div>
                  <LineChart
                    :key="`revenue-${revenuePeriod}`"
                    :data="analytics.revenue.chartData.data"
                    :labels="analytics.revenue.chartData.labels"
                    :legendLabel="t('b2b.sandals')"
                    color="#5fdbd1"
                  />
                </div>

                <!-- Products Sold Card -->
                <div :class="$style.statCard">
                  <div :class="$style.statHeader">
                    <h3 :class="$style.statTitle">{{ t('b2b.productsSold') }}</h3>
                    <select :class="$style.periodSelect" v-model="productsPeriod" @change="loadProductsAnalytics">
                      <option value="month">{{ t('admin.month') }}</option>
                      <option value="quarter">{{ t('admin.quarter') }}</option>
                      <option value="year">{{ t('admin.year') }}</option>
                    </select>
                  </div>
                  <div :class="$style.statValue">{{ analytics.productsSold.total }} {{ t('b2b.sold').split(' ')[1] }}</div>
                  <div :class="$style.statChange">{{ analytics.productsSold.change }}</div>
                  <LineChart
                    :key="`products-${productsPeriod}`"
                    :data="analytics.productsSold.chartData.data"
                    :labels="analytics.productsSold.chartData.labels"
                    :legendLabel="t('b2b.sandals')"
                    color="#5fdbd1"
                  />
                </div>
              </div>

              <!-- Products Table -->
              <div :class="$style.tableSection">
                <table :class="$style.table">
                  <thead>
                    <tr>
                      <th :class="$style.th">{{ t('b2b.productName') }}</th>
                      <th :class="$style.th">{{ t('b2b.price') }}</th>
                      <th :class="$style.th">{{ t('b2b.sold') }}</th>
                      <th :class="$style.th">{{ t('b2b.revenue') }}</th>
                      <th :class="$style.th">{{ t('b2b.dynamics') }}</th>
                      <th :class="$style.th">{{ t('b2b.stock') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in analytics.products" :key="product.id" :class="$style.tr">
                      <td :class="$style.td">
                        <div :class="$style.productCell">
                          <div :class="$style.productImage"></div>
                          <div :class="$style.productInfo">
                            <div :class="$style.productName">{{ product.name }}</div>
                            <div :class="$style.productArticle">({{ t('b2b.articleShort') }} {{ product.article }})</div>
                          </div>
                        </div>
                      </td>
                      <td :class="$style.td">{{ product.price.toLocaleString('ru-RU') }} ₽</td>
                      <td :class="$style.td">{{ product.sold }} {{ t('b2b.sold').split(' ')[1] }}</td>
                      <td :class="$style.td">{{ product.revenue.toLocaleString('ru-RU') }} ₽</td>
                      <td :class="$style.td">
                        <span :class="$style.dynamics">{{ product.dynamics }}</span>
                      </td>
                      <td :class="$style.td">{{ product.stock }} {{ t('b2b.sold').split(' ')[1] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" :class="$style.tabContent">
            <div v-if="isLoadingProducts" :class="$style.loading">{{ t('b2b.loading') }}</div>
            <div v-else-if="products.length > 0" :class="$style.productsListWrapper">
              <!-- Products Table -->
              <div :class="$style.productsTableSection">
                <table :class="$style.productsTable">
                  <thead>
                    <tr>
                      <th :class="$style.productsTableTh">{{ t('cart.article') }}</th>
                      <th :class="$style.productsTableTh">{{ t('b2b.productName') }}</th>
                      <th :class="$style.productsTableTh">{{ t('filters.price') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product.id" :class="$style.productsTableTr">
                      <td :class="$style.productsTableTd">({{ t('b2b.articleShort') }} {{ product.article }})</td>
                      <td :class="$style.productsTableTd">{{ product.name }}</td>
                      <td :class="$style.productsTableTd">{{ product.price.toLocaleString('ru-RU', { minimumFractionDigits: 0 }) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Action Controls -->
              <div :class="$style.actionControls">
                <button :class="$style.actionBtn" @click="handleAdd" :aria-label="t('b2b.addProduct')">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </button>
                <button :class="$style.actionBtn" @click="handleEdit" :aria-label="t('b2b.editProduct')">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button :class="$style.actionBtn" @click="handleDelete" :aria-label="t('b2b.deleteProduct')">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Header, Footer } from '../../widgets';
import { LineChart } from '@shared/ui';
import { getAnalyticsDashboard, getSellerProducts } from '@shared/api';
import type { AnalyticsDashboard, ProductListItem } from '@shared/api';

const { t } = useI18n();
const activeTab = ref<'analytics' | 'products'>('analytics');

// Period selectors
const revenuePeriod = ref('month');
const productsPeriod = ref('month');

// Analytics data
const analytics = ref<AnalyticsDashboard | null>(null);
const isLoading = ref(false);

// Products data
const products = ref<ProductListItem[]>([]);
const isLoadingProducts = ref(false);

// Load revenue analytics data
const loadRevenueAnalytics = async () => {
  isLoading.value = true;
  try {
    const response = await getAnalyticsDashboard({
      period: revenuePeriod.value as 'month' | 'quarter' | 'year',
      __mock: true,
    });
    
    if (response.success && response.data && analytics.value) {
      // Create a completely new object to trigger reactivity
      analytics.value = {
        revenue: response.data.revenue,
        productsSold: analytics.value.productsSold,
        products: analytics.value.products,
      };
    }
  } catch (error) {
    console.error('Failed to load revenue analytics:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load products sold analytics data
const loadProductsAnalytics = async () => {
  isLoading.value = true;
  try {
    const response = await getAnalyticsDashboard({
      period: productsPeriod.value as 'month' | 'quarter' | 'year',
      __mock: true,
    });
    
    if (response.success && response.data && analytics.value) {
      // Create a completely new object to trigger reactivity
      analytics.value = {
        revenue: analytics.value.revenue,
        productsSold: response.data.productsSold,
        products: analytics.value.products,
      };
    }
  } catch (error) {
    console.error('Failed to load products analytics:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load all analytics data initially
const loadAnalytics = async () => {
  isLoading.value = true;
  try {
    const response = await getAnalyticsDashboard({
      period: revenuePeriod.value as 'month' | 'quarter' | 'year',
      __mock: true,
    });
    
    if (response.success && response.data) {
      analytics.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load products data
const loadProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const response = await getSellerProducts({ __mock: true });
    
    if (response.success && response.data) {
      products.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load products:', error);
  } finally {
    isLoadingProducts.value = false;
  }
};

// Action handlers (placeholders for now)
const handleAdd = () => {
  console.log('Add product clicked');
};

const handleEdit = () => {
  console.log('Edit product clicked');
};

const handleDelete = () => {
  console.log('Delete product clicked');
};

// Watch tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'products' && products.value.length === 0) {
    loadProducts();
  }
});

onMounted(() => {
  loadAnalytics();
});
</script>

<style module>
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

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 24px;
}

.placeholder {
  font-size: 16px;
  color: var(--color-secondary);
  padding: 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e5e5;
}

/* Loading */
.loading {
  text-align: center;
  padding: 60px 20px;
  font-size: 16px;
  color: var(--color-secondary);
}

/* Analytics Styles */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.statCard {
  background: var(--background-default);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
}

.statHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.statTitle {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.periodSelect {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  color: var(--color-primary);
  background: var(--background-default);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.periodSelect:hover {
  border-color: var(--color-accent);
}

.periodSelect:focus {
  border-color: var(--color-accent);
}

.statValue {
  font-size: 32px;
  font-weight: 700;
  color: #5fdbd1;
  margin-bottom: 8px;
}

.statChange {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: 16px;
}

/* Table Styles */
.tableSection {
  background: var(--background-default);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.th {
  background: #f9fafb;
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
  border-bottom: 1px solid #e5e5e5;
}

.tr {
  border-bottom: 1px solid #e5e5e5;
  transition: background 0.2s;
}

.tr:last-child {
  border-bottom: none;
}

.tr:hover {
  background: #f9fafb;
}

.td {
  padding: 16px;
  font-size: 14px;
  color: var(--color-primary);
}

.productCell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.productImage {
  width: 60px;
  height: 80px;
  background: #6B7280;
  border-radius: 8px;
  flex-shrink: 0;
}

.productInfo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.productName {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
}

.productArticle {
  font-size: 12px;
  color: var(--color-secondary);
}

.dynamics {
  color: #10B981;
  font-weight: 500;
}

/* Products List Styles */
.productsListWrapper {
  position: relative;
  min-height: 400px;
}

.productsTableSection {
  background: var(--background-default);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 80px;
}

.productsTable {
  width: 100%;
  border-collapse: collapse;
}

.productsTableTh {
  background: #f9fafb;
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-secondary);
  border-bottom: 1px solid #e5e5e5;
}

.productsTableTr {
  border-bottom: 1px solid #e5e5e5;
  transition: background 0.2s;
}

.productsTableTr:last-child {
  border-bottom: none;
}

.productsTableTr:hover {
  background: #f9fafb;
}

.productsTableTd {
  padding: 16px;
  font-size: 14px;
  color: var(--color-primary);
}

/* Action Controls */
.actionControls {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 100;
  background: var(--background-default);
  border: 1px solid #e5e5e5;
  border-radius: 100px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.actionBtn {
  width: 56px;
  height: 56px;
  border-radius: 0;
  border: none;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
}

.actionBtn:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background: #e5e5e5;
}

.actionBtn:hover {
  color: var(--color-accent);
  transform: scale(1.05);
}

.actionBtn:active {
  transform: scale(0.95);
}

.actionBtn svg {
  width: 24px;
  height: 24px;
}

/* Responsive */
@media (max-width: 1200px) {
  .main {
    padding: 6px 20px 48px;
  }
  
  .statsGrid {
    grid-template-columns: 1fr;
  }
  
  .actionControls {
    right: 20px;
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

  .title {
    font-size: 24px;
  }

  .placeholder {
    font-size: 14px;
    padding: 32px 16px;
  }
  
  .statsGrid {
    gap: 16px;
  }
  
  .statCard {
    padding: 16px;
  }
  
  .statValue {
    font-size: 24px;
  }
  
  .tableSection {
    overflow-x: auto;
  }
  
  .table {
    min-width: 800px;
  }
  
  .th,
  .td {
    padding: 12px;
    font-size: 13px;
  }
  
  .productImage {
    width: 50px;
    height: 66px;
  }
  
  .productsTableSection {
    overflow-x: auto;
  }
  
  .productsTable {
    min-width: 600px;
  }
  
  .productsTableTh,
  .productsTableTd {
    padding: 12px;
    font-size: 13px;
  }
  
  .actionControls {
    bottom: 24px;
    right: 16px;
  }
  
  .actionBtn {
    width: 48px;
    height: 48px;
  }
  
  .actionBtn svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .page {
    padding-bottom: 46px;
  }

  .tab {
    margin-right: 24px;
  }
  
  .statCard {
    padding: 12px;
  }
  
  .statHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .statValue {
    font-size: 20px;
  }
  
  .statChange {
    font-size: 12px;
  }
  
  .actionControls {
    bottom: 70px;
    right: 12px;
    gap: 8px;
  }
  
  .actionBtn {
    width: 44px;
    height: 44px;
  }
}
</style>
