/**
 * Sellers API
 * API для работы с продавцами
 */

import { apiClient, type ApiResponse } from './client';

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
	growthPeriod?: 'month' | 'quarter' | 'year';
}

/**
 * Получить данные дашборда продавцов
 * GET /api/admin/sellers/dashboard
 */
export const getSellersDashboard = async (
	params: GetSellersDashboardRequest = {},
): Promise<ApiResponse<SellersDashboard>> => {
	const period = params.period || 'month';
	const growthPeriod = params.growthPeriod || period;
	return apiClient.get<SellersDashboard>(
		`/admin/sellers/dashboard?period=${period}&growthPeriod=${growthPeriod}`,
	);
};
