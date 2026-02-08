<template>
  <div :class="$style.page">
    <Header :userRole="'admin'" />
    
    <main :class="$style.main">
      <div :class="$style.container">
        <!-- Tabs Navigation -->
        <div :class="$style.tabsWrapper">
          <div :class="$style.tabsLine"></div>
          <div :class="$style.tabs">
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'sellers' }]"
              @click="activeTab = 'sellers'"
            >
              Список продавцов
            </button>
            <button
              :class="[$style.tab, { [$style.tabActive]: activeTab === 'applications' }]"
              @click="activeTab = 'applications'"
            >
              Список заявок
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div :class="$style.content">
          <!-- Sellers Tab -->
          <div v-if="activeTab === 'sellers'" :class="$style.tabContent">
            <h2 :class="$style.title">Список продавцов</h2>
            <p :class="$style.placeholder">Здесь будет список продавцов</p>
          </div>

          <!-- Applications Tab -->
          <div v-if="activeTab === 'applications'" :class="$style.tabContent">
            <h2 :class="$style.title">Список заявок</h2>
            <p :class="$style.placeholder">Здесь будет список заявок</p>
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

const activeTab = ref<'sellers' | 'applications'>('sellers');
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
  border-bottom: 1px solid #E5E7EB;
}

.tabsLine {
  display: none;
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
  font-weight: 400;
  color: #9CA3AF;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;
  width: 410px;
  text-align: left;
}

.tab:hover {
  color: #6B7280;
}

.tabActive {
  color: #1F2937;
  font-weight: 400;
}

.tabActive::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-dark);
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
