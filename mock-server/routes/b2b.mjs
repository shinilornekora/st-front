import { json } from '../lib/http.mjs';

const getPeriodChart = (period, metric) => {
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
						180000, 210000, 240000, 260000, 300000, 340000, 320000,
						360000, 390000, 410000, 450000, 490000,
					]
				: [78, 92, 106, 118, 133, 147, 141, 154, 167, 176, 189, 205],
		};
	}

	if (period === 'quarter') {
		return {
			labels: ['Янв', 'Фев', 'Мар'],
			data: isRevenue ? [560000, 610000, 690000] : [248, 276, 305],
		};
	}

	return {
		labels: ['1-7', '8-14', '15-21', '22-30'],
		data: isRevenue ? [160000, 170000, 220000, 290000] : [110, 123, 141, 167],
	};
};

const formatTotal = (value) => `${value.toLocaleString('ru-RU')} RUB`;

export const handleB2bRoute = ({ res, method, pathname, body, state, url }) => {
	if (method === 'GET' && pathname === '/api/b2b/analytics/dashboard') {
		const periodQuery = url?.searchParams.get('period');
		const period =
			periodQuery === 'month' || periodQuery === 'quarter' || periodQuery === 'year'
				? periodQuery
				: 'month';

		const revenueChart = getPeriodChart(period, 'revenue');
		const productsSoldChart = getPeriodChart(period, 'productsSold');
		const revenueTotal = revenueChart.data.reduce((sum, value) => sum + value, 0);
		const productsTotal = productsSoldChart.data.reduce(
			(sum, value) => sum + value,
			0,
		);

		json(res, 200, {
			revenue: {
				total: formatTotal(revenueTotal),
				change:
					period === 'year'
						? '+18.7%'
						: period === 'quarter'
							? '+9.8%'
							: '+12.4%',
				chartData: {
					labels: revenueChart.labels,
					data: revenueChart.data,
				},
			},
			productsSold: {
				total: productsTotal,
				change:
					period === 'year'
						? '+11.3%'
						: period === 'quarter'
							? '+6.5%'
							: '+8.2%',
				chartData: {
					labels: productsSoldChart.labels,
					data: productsSoldChart.data,
				},
			},
			products: state.b2bProducts.map((item, index) => ({
				id: item.id,
				name: item.name,
				article: item.article,
				price: item.price,
				sold: 15 + index * 3,
				revenue: (15 + index * 3) * item.price,
				dynamics: `+${4 + index}%`,
				stock: 100 - index * 7,
			})),
		});
		return true;
	}

	if (method === 'GET' && pathname === '/api/b2b/products') {
		json(res, 200, state.b2bProducts);
		return true;
	}

	if (method === 'POST' && pathname === '/api/b2b/products') {
		const newId =
			state.b2bProducts.length > 0
				? Math.max(...state.b2bProducts.map((item) => item.id)) + 1
				: 1;
		const created = {
			id: newId,
			article: body?.article ?? `B2B-${String(newId).padStart(4, '0')}`,
			name: body?.name ?? `B2B Product #${newId}`,
			price: Number(body?.price ?? 0),
		};
		state.b2bProducts.push(created);
		json(res, 200, created);
		return true;
	}

	const b2bProductMatch = pathname.match(/^\/api\/b2b\/products\/(\d+)$/);
	if (b2bProductMatch) {
		const id = Number(b2bProductMatch[1]);
		const index = state.b2bProducts.findIndex((item) => item.id === id);
		if (index < 0) {
			json(res, 404, { error: 'Product not found' });
			return true;
		}

		if (method === 'PUT') {
			state.b2bProducts[index] = { ...state.b2bProducts[index], ...body, id };
			json(res, 200, state.b2bProducts[index]);
			return true;
		}

		if (method === 'DELETE') {
			state.b2bProducts.splice(index, 1);
			json(res, 200, { message: 'Product deleted' });
			return true;
		}
	}

	return false;
};
