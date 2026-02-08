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
              Аналитика продаж
            </button>
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'products' }]"
              @click="activeTab = 'products'"
            >
              Список товаров
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div :class="$style.content">
          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" :class="$style.tabContent">
            <h2 :class="$style.title">Аналитика продаж</h2>
            <p :class="$style.placeholder">Здесь будет аналитика продаж</p>
          </div>

          <!-- Products Tab -->
          <div v-if="activeTab === 'products'" :class="$style.tabContent">
            <h2 :class="$style.title">Список товаров</h2>
            <p :class="$style.placeholder">Здесь будет список товаров</p>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Header, Footer } from '../../widgets';

const activeTab = ref<'analytics' | 'products'>('analytics');
</script>

<style module>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.main {
  flex: 1;
  padding: 6px 120px 48px;
  background: #fff;
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
  color: #6b7280;
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

  .title {
    font-size: 24px;
  }

  .placeholder {
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
}
</style>
