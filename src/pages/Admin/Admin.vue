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
            <!-- Loading State -->
            <div v-if="loading" :class="$style.loading">
              <p>Загрузка данных...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" :class="$style.error">
              <p>{{ error }}</p>
              <button @click="loadDashboard" :class="$style.retryButton">Попробовать снова</button>
            </div>

            <!-- Content -->
            <template v-else-if="dashboard">
              <!-- Statistics Cards -->
              <div :class="$style.statsGrid">
                <!-- Revenue Card -->
                <div :class="$style.statCard">
                  <div :class="$style.statHeader">
                    <h3 :class="$style.statTitle">Оборот</h3>
                    <select :class="$style.periodSelect" v-model="revenuePeriod" @change="loadDashboard">
                      <option value="month">Выбрать период</option>
                      <option value="quarter">За квартал</option>
                      <option value="year">За год</option>
                    </select>
                  </div>
                  <div :class="$style.statValue">{{ dashboard.revenue.total }}</div>
                  <div :class="$style.statSubtext">{{ dashboard.revenue.itemsCount }} Товаров</div>
                  
                  <LineChart
                    :data="dashboard.revenue.chartData.data"
                    :labels="dashboard.revenue.chartData.labels"
                    legendLabel="Stivalli"
                    color="#5fdbd1"
                  />
                </div>

                <!-- Growth Card -->
                <div :class="$style.statCard">
                  <div :class="$style.statHeader">
                    <h3 :class="$style.statTitle">Динамика развития</h3>
                    <select :class="$style.periodSelect" v-model="growthPeriod" @change="loadDashboard">
                      <option value="month">Выбрать период</option>
                      <option value="quarter">За квартал</option>
                      <option value="year">За год</option>
                    </select>
                  </div>
                  <div :class="$style.statValue" style="color: #5fdbd1;">{{ dashboard.growth.percentage }}</div>
                  <div :class="$style.statSubtext">{{ dashboard.growth.itemsCount }} Товаров</div>
                  
                  <LineChart
                    :data="dashboard.growth.chartData.data"
                    :labels="dashboard.growth.chartData.labels"
                    legendLabel="Stivalli"
                    color="#5fdbd1"
                  />
                </div>
              </div>

              <!-- Sellers Table -->
              <div :class="$style.tableWrapper">
                <table :class="$style.sellersTable">
                  <thead>
                    <tr>
                      <th>Имя производителя</th>
                      <th>Оборот</th>
                      <th>Динамика развития (с пред мес)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="seller in dashboard.sellers" :key="seller.id" :class="seller.id % 2 === 0 ? $style.evenRow : ''">
                      <td>{{ seller.name }}</td>
                      <td>{{ seller.revenue }}</td>
                      <td>{{ seller.growth }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>

          <!-- Applications Tab -->
          <div v-if="activeTab === 'applications'" :class="$style.tabContent">
            <!-- Loading State -->
            <div v-if="applicationsLoading" :class="$style.loading">
              <p>Загрузка заявок...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="applicationsError" :class="$style.error">
              <p>{{ applicationsError }}</p>
              <button @click="loadApplications" :class="$style.retryButton">Попробовать снова</button>
            </div>

            <!-- Applications Table -->
            <div v-else-if="applications.length > 0" :class="$style.tableWrapper">
              <table :class="$style.applicationsTable">
                <thead>
                  <tr>
                    <th>Имя производителя</th>
                    <th>Телефонный номер</th>
                    <th>Электронный адрес</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="app in applications" :key="app.id">
                    <td>{{ app.name }}</td>
                    <td>{{ app.phone }}</td>
                    <td>{{ app.email }}</td>
                    <td>
                      <div :class="$style.actions">
                        <button
                          @click="handleReject(app.id)"
                          :class="$style.rejectButton"
                          :disabled="processingId === app.id"
                        >
                          Отклонить
                        </button>
                        <button
                          @click="handleApprove(app.id)"
                          :class="$style.approveButton"
                          :disabled="processingId === app.id"
                        >
                          Принять
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-else :class="$style.placeholder">
              Нет заявок для обработки
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
import { Header, Footer } from '../../widgets';
import { LineChart } from '../../shared/ui';
import { getSellersDashboard, getApplications, updateApplicationStatus } from '../../shared/api';
import type { SellersDashboard, Application } from '../../shared/api';

const activeTab = ref<'sellers' | 'applications'>('sellers');

// Sellers State
const loading = ref(false);
const error = ref<string | null>(null);
const dashboard = ref<SellersDashboard | null>(null);

// Period selectors
const revenuePeriod = ref('month');
const growthPeriod = ref('month');

// Applications State
const applicationsLoading = ref(false);
const applicationsError = ref<string | null>(null);
const applications = ref<Application[]>([]);
const processingId = ref<number | null>(null);

// Load dashboard data
const loadDashboard = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getSellersDashboard({
      period: revenuePeriod.value as 'month' | 'quarter' | 'year',
      __mock: true
    });
    
    if (response.success && response.data) {
      dashboard.value = response.data;
    } else {
      error.value = response.error || 'Не удалось загрузить данные';
    }
  } catch (err) {
    error.value = 'Произошла ошибка при загрузке данных';
    console.error('Failed to load dashboard:', err);
  } finally {
    loading.value = false;
  }
};

// Load applications data
const loadApplications = async () => {
  applicationsLoading.value = true;
  applicationsError.value = null;
  
  try {
    const response = await getApplications({ __mock: true });
    
    if (response.success && response.data) {
      applications.value = response.data;
    } else {
      applicationsError.value = response.error || 'Не удалось загрузить заявки';
    }
  } catch (err) {
    applicationsError.value = 'Произошла ошибка при загрузке заявок';
    console.error('Failed to load applications:', err);
  } finally {
    applicationsLoading.value = false;
  }
};

// Handle approve application
const handleApprove = async (id: number) => {
  processingId.value = id;
  
  try {
    const response = await updateApplicationStatus({
      id,
      status: 'approved',
      __mock: true
    });
    
    if (response.success) {
      // Remove from list after approval
      applications.value = applications.value.filter(app => app.id !== id);
    } else {
      alert(response.error || 'Не удалось принять заявку');
    }
  } catch (err) {
    alert('Произошла ошибка при обработке заявки');
    console.error('Failed to approve application:', err);
  } finally {
    processingId.value = null;
  }
};

// Handle reject application
const handleReject = async (id: number) => {
  processingId.value = id;
  
  try {
    const response = await updateApplicationStatus({
      id,
      status: 'rejected',
      __mock: true
    });
    
    if (response.success) {
      // Remove from list after rejection
      applications.value = applications.value.filter(app => app.id !== id);
    } else {
      alert(response.error || 'Не удалось отклонить заявку');
    }
  } catch (err) {
    alert('Произошла ошибка при обработке заявки');
    console.error('Failed to reject application:', err);
  } finally {
    processingId.value = null;
  }
};

// Watch tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'applications' && applications.value.length === 0) {
    loadApplications();
  }
});

// Load data on mount
onMounted(() => {
  loadDashboard();
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

/* Loading & Error States */
.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-secondary);
}

.error {
  color: var(--color-error-main);
}

.retryButton {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.retryButton:hover {
  background: var(--color-dark);
}

/* Statistics Grid */
.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.statCard {
  background: white;
  border: 1px solid #E5E7EB;
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
  font-weight: 400;
  color: #6B7280;
  margin: 0;
}

.periodSelect {
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  font-size: 14px;
  color: #6B7280;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.periodSelect:hover {
  border-color: #9CA3AF;
}

.periodSelect:focus {
  border-color: var(--color-main);
}

.statValue {
  font-size: 36px;
  font-weight: 400;
  color: #1F2937;
  margin-bottom: 8px;
  text-align: left;
}

.statSubtext {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
  text-align: left;
}

/* Table */
.tableWrapper {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}

.sellersTable {
  width: 100%;
  border-collapse: collapse;
}

.sellersTable thead {
  background: var(--background-secondary);
}

.sellersTable th {
  padding: 16px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.sellersTable td {
  padding: 16px 24px;
  font-size: 14px;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

.sellersTable tbody tr:last-child td {
  border-bottom: none;
}

.sellersTable tbody tr.evenRow {
  background: #F9FAFB;
}

.sellersTable tbody tr:hover {
  background: #F3F4F6;
}

/* Applications Table */
.applicationsTable {
  width: 100%;
  border-collapse: collapse;
}

.applicationsTable thead {
  background: #F9FAFB;
}

.applicationsTable th {
  padding: 16px 24px;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.applicationsTable td {
  padding: 16px 24px;
  font-size: 14px;
  color: #1F2937;
  border-bottom: 1px solid #F3F4F6;
}

.applicationsTable tbody tr:last-child td {
  border-bottom: none;
}

.applicationsTable tbody tr:hover {
  background: #F9FAFB;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.rejectButton,
.approveButton {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.rejectButton {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
}

.rejectButton:hover:not(:disabled) {
  background: #F9FAFB;
  border-color: #9CA3AF;
}

.approveButton {
  background: #5fdbd1;
  color: white;
}

.approveButton:hover:not(:disabled) {
  background: #4ac5bc;
}

.rejectButton:disabled,
.approveButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

  .statsGrid {
    grid-template-columns: 1fr;
  }

  .statCard {
    padding: 16px;
  }

  .statValue {
    font-size: 28px;
  }

  .sellersTable th,
  .sellersTable td {
    padding: 12px 16px;
    font-size: 13px;
  }

  .applicationsTable th,
  .applicationsTable td {
    padding: 12px 16px;
    font-size: 13px;
  }

  .actions {
    flex-direction: column;
    gap: 8px;
  }

  .rejectButton,
  .approveButton {
    width: 100%;
    padding: 10px;
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
