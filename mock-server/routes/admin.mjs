import { json } from '../lib/http.mjs';

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
		const period = url.searchParams.get('period') ?? 'month';
		json(res, 200, {
			revenue: {
				total: '1 250 000 RUB',
				itemsCount: period === 'year' ? 12 : period === 'quarter' ? 3 : 1,
				chartData: {
					labels: ['W1', 'W2', 'W3', 'W4'],
					data: [120000, 180000, 210000, 260000],
				},
			},
			growth: {
				percentage: '+18.5%',
				itemsCount: 24,
				chartData: {
					labels: ['W1', 'W2', 'W3', 'W4'],
					data: [12, 14, 17, 19],
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
