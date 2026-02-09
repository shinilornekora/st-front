/**
 * Analytics API
 * API для работы с аналитикой продаж B2B
 */

import { mockClient } from './mockClient/client';
import type { MockResponse } from './mockClient/client';

// Types
export interface ChartData {
  labels: string[];
  data: number[];
}

export interface ProductAnalytics {
  id: number;
  name: string;
  article: string;
  price: number;
  sold: number;
  revenue: number;
  dynamics: string;
  stock: number;
  imageUrl?: string;
}

export interface ProductListItem {
  id: number;
  article: string;
  name: string;
  price: number;
}

export interface AnalyticsDashboard {
  revenue: {
    total: string;
    change: string;
    chartData: ChartData;
  };
  productsSold: {
    total: number;
    change: string;
    chartData: ChartData;
  };
  products: ProductAnalytics[];
}

export interface GetAnalyticsDashboardRequest {
  period?: 'month' | 'quarter' | 'year';
  __mock?: boolean;
}

// Mock data generator
const generateMockAnalytics = (period: string = 'month'): AnalyticsDashboard => {
  const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const yearLabels = ['2020', '2021', '2022', '2023', '2024', '2025'];

  let labels = monthLabels;
  if (period === 'quarter') labels = quarterLabels;
  if (period === 'year') labels = yearLabels;

  return {
    revenue: {
      total: '1 250 000 ₽',
      change: '+12% к прошлому месяцу',
      chartData: {
        labels,
        data: [20, 25, 30, 55, 45, 35],
      },
    },
    productsSold: {
      total: 1248,
      change: '+12% к прошлому месяцу',
      chartData: {
        labels,
        data: [20, 25, 30, 55, 45, 35],
      },
    },
    products: [
      {
        id: 1,
        name: 'Сандали Stivalli Urban Low, Black',
        article: 'ST-8842',
        price: 12000,
        sold: 142,
        revenue: 1704000,
        dynamics: '+8.5%',
        stock: 54,
      },
      {
        id: 2,
        name: 'Кеды Stivalli Urban Low, Black',
        article: 'ST-8842',
        price: 12000,
        sold: 142,
        revenue: 1704000,
        dynamics: '+8.5%',
        stock: 54,
      },
    ],
  };
};

/**
 * Получить данные аналитики продаж
 */
export const getAnalyticsDashboard = async (
  params: GetAnalyticsDashboardRequest = {}
): Promise<MockResponse<AnalyticsDashboard>> => {
  if (params.__mock) {
    return mockClient.get(() => generateMockAnalytics(params.period));
  }

  // Real API call would go here
  try {
    const response = await fetch(`/api/b2b/analytics/dashboard?period=${params.period || 'month'}`);
    const data = await response.json();
    
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : 'Failed to fetch analytics dashboard',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети',
    };
  }
};

/**
 * Получить список товаров продавца
 */
export const getSellerProducts = async (
  params: { __mock?: boolean } = {}
): Promise<MockResponse<ProductListItem[]>> => {
  if (params.__mock) {
    const mockProducts: ProductListItem[] = [
      {
        id: 1,
        article: 'ST-8842',
        name: 'Кеды Stivalli Urban Low, Black',
        price: 12000,
      },
      {
        id: 2,
        article: 'ST-8842',
        name: 'Кеды Stivalli Urban Low, Black',
        price: 12000,
      },
    ];
    return mockClient.get(() => mockProducts);
  }

  // Real API call would go here
  try {
    const response = await fetch('/api/b2b/products');
    const data = await response.json();
    
    return {
      success: response.ok,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : 'Failed to fetch products',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка сети',
    };
  }
};
