import { json } from '../lib/http.mjs';

const getAdminChartByPeriod = (period, metric) => {
	const isRevenue = metric === 'revenue';

	if (period === 'year') {
		return {
			labels: [
				'Янв',
				'Фев',
				'Мар',
				'Апр',
				'Май',
				'Июн',
				'Июл',
				'Авг',
				'Сен',
				'Окт',
				'Ноя',
				'Дек',
			],
			data: isRevenue
				? [
						210000, 230000, 260000, 280000, 320000, 350000, 340000,
						370000, 395000, 420000, 455000, 500000,
					]
				: [8.5, 9.2, 10.4, 11.1, 12.3, 13.4, 12.8, 13.9, 14.6, 15.1, 16.3, 17.2],
		};
	}

	if (period === 'quarter') {
		return {
			labels: ['Янв', 'Фев', 'Мар'],
			data: isRevenue ? [560000, 610000, 690000] : [12.4, 14.1, 15.8],
		};
	}

	return {
		labels: ['1-7', '8-14', '15-21', '22-30'],
		data: isRevenue ? [120000, 180000, 210000, 260000] : [12, 14, 17, 19],
	};
};

const formatRub = (value) => `${Math.round(value).toLocaleString('ru-RU')} RUB`;

export const handleAdminRoute = ({ res, method, pathname, url, body, state }) => {
	if (method === 'GET' && pathname === '/api/admin/applications') {
		json(res, 200, state.adminApplications);
		return true;
	}

	const adminApplicationStatusMatch = pathname.match(
		/^\/api\/admin\/applications\/(\d+)\/status$/,
	);
	if (method === 'PATCH' && adminApplicationStatusMatch) {
		const id = Number(adminApplicationStatusMatch[1]);
		const app = state.adminApplications.find((entry) => entry.id === id);
		if (!app) {
			json(res, 404, { error: 'Application not found' });
			return true;
		}
		app.status = body?.status ?? app.status;
		json(res, 200, { message: 'Status updated' });
		return true;
	}

	if (method === 'GET' && pathname === '/api/admin/sellers/dashboard') {
		const normalizePeriod = (value) =>
			value === 'month' || value === 'quarter' || value === 'year'
				? value
				: 'month';

		const revenuePeriod = normalizePeriod(url.searchParams.get('period'));
		const growthPeriod = normalizePeriod(
			url.searchParams.get('growthPeriod') ?? revenuePeriod,
		);
		const revenueChart = getAdminChartByPeriod(revenuePeriod, 'revenue');
		const growthChart = getAdminChartByPeriod(growthPeriod, 'growth');
		const growthAvg =
			growthChart.data.reduce((sum, value) => sum + value, 0) /
			(growthChart.data.length || 1);

		json(res, 200, {
			revenue: {
				total: formatRub(
					revenueChart.data.reduce((sum, value) => sum + value, 0),
				),
				itemsCount:
					revenuePeriod === 'year' ? 12 : revenuePeriod === 'quarter' ? 3 : 1,
				chartData: {
					labels: revenueChart.labels,
					data: revenueChart.data,
				},
			},
			growth: {
				percentage: `+${growthAvg.toFixed(1)}%`,
				itemsCount:
					growthPeriod === 'year' ? 12 : growthPeriod === 'quarter' ? 3 : 4,
				chartData: {
					labels: growthChart.labels,
					data: growthChart.data,
				},
			},
			sellers: state.sellers.map((seller, index) => ({
				id: seller.id,
				name: seller.name,
				revenue: `${(index + 3) * 120000} RUB`,
				growth: `+${10 + index * 2}%`,
			})),
		});
		return true;
	}

	return false;
};
