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
                  <div :class="$style.statValue">{{ revenueTotal }}</div>
                  <div :class="$style.statChange">{{ revenueChange }} {{ t('b2b.comparedToPrevious') }}</div>
                  <MultiLineChart
                    v-if="selectedProductIds.length > 0"
                    :key="`revenue-${revenuePeriod}-${selectedProductIds.join(',')}`"
                    :datasets="revenueDatasets"
                    :labels="analytics.revenue.chartData.labels"
                  />
                  <LineChart
                    v-else
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
                  <div :class="$style.statValue">{{ productsSoldTotal }} {{ t('b2b.sold').split(' ')[1] }}</div>
                  <div :class="$style.statChange">{{ productsSoldChange }} {{ t('b2b.comparedToPrevious') }}</div>
                  <MultiLineChart
                    v-if="selectedProductIds.length > 0"
                    :key="`products-${productsPeriod}-${selectedProductIds.join(',')}`"
                    :datasets="productsSoldDatasets"
                    :labels="analytics.productsSold.chartData.labels"
                  />
                  <LineChart
                    v-else
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
                    <tr
                      v-for="product in analytics.products"
                      :key="product.id"
                      :class="[$style.tr, { [$style.trSelected]: selectedProductIds.includes(product.id) }]"
                      @click="toggleProduct(product.id)"
                    >
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
import { ref, onMounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Header, Footer } from '../../widgets';
import { LineChart, MultiLineChart } from '@shared/ui';
import { getAnalyticsDashboard, getSellerProducts } from '@shared/api';
import type { AnalyticsDashboard, ProductListItem, ChartData } from '@shared/api';
import $style from './B2B.module.css';

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

// Selected products for filtering charts (multiple selection)
const selectedProductIds = ref<number[]>([]);

// Colors for different product lines
const productColors = ['#5fdbd1', '#f59e0b', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'];

// Load revenue analytics data
const loadRevenueAnalytics = async () => {
  isLoading.value = true;
  try {
    const response = await getAnalyticsDashboard({
      period: revenuePeriod.value as 'month' | 'quarter' | 'year',
      __mock: true,
    });
    
    if (response.success && response.data && analytics.value) {
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

// Generate mock chart data for a specific product
const generateProductChartData = (productId: number, period: string): number[] => {
  let data = [15, 20, 25, 45, 35, 30];

  if (period === 'quarter') {
    data = [35, 50, 60, 70];
  } else if (period === 'year') {
    data = [80, 120, 160, 220, 280, 340];
  }

  // Vary data based on product ID
  return data.map(value => value + (productId * 3));
};

// Toggle product selection
const toggleProduct = (productId: number) => {
  const index = selectedProductIds.value.indexOf(productId);
  if (index > -1) {
    // Remove if already selected - create new array to trigger reactivity
    selectedProductIds.value = selectedProductIds.value.filter(id => id !== productId);
  } else {
    // Add if not selected - create new array to trigger reactivity
    selectedProductIds.value = [...selectedProductIds.value, productId];
  }
};

// Computed datasets for revenue chart
const revenueDatasets = computed(() => {
  if (!analytics.value) return [];
  
  return selectedProductIds.value.map((productId, index) => {
    const product = analytics.value!.products.find(p => p.id === productId);
    if (!product) return null;
    
    return {
      label: product.name,
      data: generateProductChartData(productId, revenuePeriod.value),
      color: productColors[index % productColors.length],
    };
  }).filter(Boolean) as { label: string; data: number[]; color: string }[];
});

// Computed datasets for products sold chart
const productsSoldDatasets = computed(() => {
  if (!analytics.value) return [];
  
  return selectedProductIds.value.map((productId, index) => {
    const product = analytics.value!.products.find(p => p.id === productId);
    if (!product) return null;
    
    return {
      label: product.name,
      data: generateProductChartData(productId, productsPeriod.value),
      color: productColors[index % productColors.length],
    };
  }).filter(Boolean) as { label: string; data: number[]; color: string }[];
});

// Computed total revenue
const revenueTotal = computed(() => {
  if (!analytics.value) return '0 ₽';
  
  if (selectedProductIds.value.length === 0) {
    return analytics.value.revenue.total;
  }
  
  const total = selectedProductIds.value.reduce((sum, productId) => {
    const product = analytics.value!.products.find(p => p.id === productId);
    return sum + (product?.revenue || 0);
  }, 0);
  
  return `${total.toLocaleString('ru-RU')} ₽`;
});

// Computed revenue change
const revenueChange = computed(() => {
  if (!analytics.value) return '+0%';
  
  if (selectedProductIds.value.length === 0) {
    return analytics.value.revenue.change;
  }
  
  // Average change across selected products
  const changes = selectedProductIds.value.map(productId => {
    const product = analytics.value!.products.find(p => p.id === productId);
    return parseFloat(product?.dynamics.replace(/[+%]/g, '') || '0');
  });
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return `${avgChange > 0 ? '+' : ''}${avgChange.toFixed(1)}%`;
});

// Computed total products sold
const productsSoldTotal = computed(() => {
  if (!analytics.value) return 0;
  
  if (selectedProductIds.value.length === 0) {
    return analytics.value.productsSold.total;
  }
  
  return selectedProductIds.value.reduce((sum, productId) => {
    const product = analytics.value!.products.find(p => p.id === productId);
    return sum + (product?.sold || 0);
  }, 0);
});

// Computed products sold change
const productsSoldChange = computed(() => {
  if (!analytics.value) return '+0%';
  
  if (selectedProductIds.value.length === 0) {
    return analytics.value.productsSold.change;
  }
  
  // Average change across selected products
  const changes = selectedProductIds.value.map(productId => {
    const product = analytics.value!.products.find(p => p.id === productId);
    return parseFloat(product?.dynamics.replace(/[+%]/g, '') || '0');
  });
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return `${avgChange > 0 ? '+' : ''}${avgChange.toFixed(1)}%`;
});

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
