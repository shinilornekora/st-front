/**
 * Analytics API
 * API для работы с аналитикой продаж B2B
 */

import { mockClient } from './mockClient/client';
import type { MockResponse } from './mockClient/client';
import { i18n } from '@shared/i18n';

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
const generateMockAnalytics = (
	period: string = 'month',
): AnalyticsDashboard => {
	const monthLabels = [
		i18n.global.t('mockData.months.jan'),
		i18n.global.t('mockData.months.feb'),
		i18n.global.t('mockData.months.mar'),
		i18n.global.t('mockData.months.apr'),
		i18n.global.t('mockData.months.may'),
		i18n.global.t('mockData.months.jun'),
	];
	const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
	const yearLabels = ['2020', '2021', '2022', '2023', '2024', '2025'];

	let labels = monthLabels;
	let revenueData = [20, 25, 30, 55, 45, 35];
	let productsSoldData = [20, 25, 30, 55, 45, 35];
	let revenueTotal = '1 250 000 ₽';
	let productsSoldTotal = 1248;
	let revenueChange = '+12%';
	let productsSoldChange = '+12%';

	if (period === 'quarter') {
		labels = quarterLabels;
		revenueData = [45, 60, 75, 85];
		productsSoldData = [450, 600, 750, 850];
		revenueTotal = '4 500 000 ₽';
		productsSoldTotal = 4500;
		revenueChange = '+18%';
		productsSoldChange = '+18%';
	} else if (period === 'year') {
		labels = yearLabels;
		revenueData = [100, 150, 200, 280, 350, 420];
		productsSoldData = [1000, 1500, 2000, 2800, 3500, 4200];
		revenueTotal = '15 000 000 ₽';
		productsSoldTotal = 15000;
		revenueChange = '+25%';
		productsSoldChange = '+25%';
	}

	return {
		revenue: {
			total: revenueTotal,
			change: revenueChange,
			chartData: {
				labels,
				data: revenueData,
			},
		},
		productsSold: {
			total: productsSoldTotal,
			change: productsSoldChange,
			chartData: {
				labels,
				data: productsSoldData,
			},
		},
		products: [
			{
				id: 1,
				name: i18n.global.t('mockData.mockProducts.stivalliSandals'),
				article: 'ST-8842',
				price: 12000,
				sold: 142,
				revenue: 1704000,
				dynamics: '+8.5%',
				stock: 54,
			},
			{
				id: 2,
				name: i18n.global.t('mockData.mockProducts.stivalliKeds'),
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
	params: GetAnalyticsDashboardRequest = {},
): Promise<MockResponse<AnalyticsDashboard>> => {
	if (params.__mock) {
		return mockClient.get(() => generateMockAnalytics(params.period));
	}

	// Real API call would go here
	try {
		const response = await fetch(
			`/api/b2b/analytics/dashboard?period=${params.period || 'month'}`,
		);
		const data = await response.json();

		return {
			success: response.ok,
			data: response.ok ? data : undefined,
			error: response.ok
				? undefined
				: 'Failed to fetch analytics dashboard',
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: i18n.global.t('errors.networkError'),
		};
	}
};

/**
 * Получить список товаров продавца
 */
export const getSellerProducts = async (
	params: { __mock?: boolean } = {},
): Promise<MockResponse<ProductListItem[]>> => {
	if (params.__mock) {
		const mockProducts: ProductListItem[] = [
			{
				id: 1,
				article: 'ST-8842',
				name: i18n.global.t('mockData.mockProducts.stivalliKeds'),
				price: 12000,
			},
			{
				id: 2,
				article: 'ST-8842',
				name: i18n.global.t('mockData.mockProducts.stivalliKeds'),
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
			error:
				error instanceof Error
					? error.message
					: i18n.global.t('errors.networkError'),
		};
	}
};
