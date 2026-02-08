/**
 * Sellers API
 * API для работы с продавцами
 */

import { mockClient } from './mockClient/client';
import type { MockResponse } from './mockClient/client';

// Types
export interface SellerStats {
  id: number;
  name: string;
  revenue: string;
  growth: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface SellersDashboard {
  revenue: {
    total: string;
    itemsCount: number;
    chartData: ChartData;
  };
  growth: {
    percentage: string;
    itemsCount: number;
    chartData: ChartData;
  };
  sellers: SellerStats[];
}

export interface GetSellersDashboardRequest {
  period?: 'month' | 'quarter' | 'year';
  __mock?: boolean;
}

// Mock data generator
const generateMockDashboard = (period: string = 'month'): SellersDashboard => {
  const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const yearLabels = ['2020', '2021', '2022', '2023', '2024', '2025'];

  let labels = monthLabels;
  if (period === 'quarter') labels = quarterLabels;
  if (period === 'year') labels = yearLabels;

  return {
    revenue: {
      total: '10.000,00',
      itemsCount: 50,
      chartData: {
        labels,
        data: [20, 15, 25, 35, 40, 30],
      },
    },
    growth: {
      percentage: '+0.6%',
      itemsCount: 50,
      chartData: {
        labels,
        data: [20, 25, 22, 30, 35, 32],
      },
    },
    sellers: [
      { id: 1, name: 'Stivalli', revenue: '10000', growth: '+0.6%' },
      { id: 2, name: 'Stivalli', revenue: '10000', growth: '+0.6%' },
      { id: 3, name: 'Fashion House', revenue: '8500', growth: '+1.2%' },
      { id: 4, name: 'Style Co', revenue: '7200', growth: '-0.3%' },
      { id: 5, name: 'Trend Makers', revenue: '6800', growth: '+2.1%' },
    ],
  };
};

/**
 * Получить данные дашборда продавцов
 */
export const getSellersDashboard = async (
  params: GetSellersDashboardRequest = {}
): Promise<MockResponse<SellersDashboard>> => {
  if (params.__mock) {
    return mockClient.get(() => generateMockDashboard(params.period));
  }

  // Real API call would go here
  try {
    const response = await fetch(`/api/admin/sellers/dashboard?period=${params.period || 'month'}`);
    const data = await response.json();
    
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : 'Failed to fetch sellers dashboard',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети',
    };
  }
};
