const RUB = 'RUB';

const sellers = [
	{ id: 1, name: 'Stivalli' },
	{ id: 2, name: 'Marco Tozzi' },
	{ id: 3, name: 'Rieker' },
];

const nowIso = () => new Date().toISOString();

const parseIntOr = (value, fallback) => {
	const parsed = Number.parseInt(value ?? '', 10);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const createToken = (userId) =>
	`mock-token-${userId}-${Math.random().toString(36).slice(2, 10)}`;

const sanitizeUser = (user) => {
	const { password, ...safeUser } = user;
	return safeUser;
};

const makeProduct = (id) => {
	const seller = sellers[id % sellers.length];
	const discount = id % 3 === 0 ? 15 : undefined;
	const price = 3500 + id * 57;

	return {
		id,
		name: `Mock Shoes #${id}`,
		slug: `mock-shoes-${id}`,
		description: `Mock description for product #${id}`,
		price,
		discount,
		currency: RUB,
		inStock: id % 8 !== 0,
		article: `MS-${String(id).padStart(5, '0')}`,
		category: [{ id: 'all', name: 'All' }],
		tags: [{ id: 'mock', name: 'mock' }],
		images: ['https://picsum.photos/600/800?blur=1'],
		sizes: ['39', '40', '41', '42'],
		stockStatus: id % 8 === 0 ? 'pre_order' : 'in_stock',
		gender: id % 2 === 0 ? 'female' : 'male',
		seller,
	};
};

const createProducts = () => {
	const products = new Map();
	for (let i = 1; i <= 300; i += 1) {
		products.set(i, makeProduct(i));
	}
	return products;
};

const createUsers = () => [
	{
		id: 1,
		role: 'SELLER',
		email: 'seller@example.com',
		fullName: 'Mock Seller',
		phone: '+79001234567',
		specificFields: {
			id: 1,
			userId: 1,
			name: 'Mock Shop',
			logo: undefined,
			phone: '+79001234567',
			email: 'seller@example.com',
			inn: '1234567890',
			billingAccount: '40817810099910004312',
			extraFields: [],
		},
		password: 'seller123',
	},
	{
		id: 2,
		role: 'CUSTOMER',
		email: 'customer@example.com',
		fullName: 'Mock Customer',
		phone: '+79009876543',
		specificFields: { favoriteProducts: [1, 5, 10] },
		password: 'customer123',
	},
	{
		id: 3,
		role: 'ADMIN',
		email: 'admin@example.com',
		fullName: 'Mock Admin',
		phone: '+79005555555',
		specificFields: { isRestrictedAdmin: false },
		password: 'admin123',
	},
];

const createB2bProducts = () =>
	Array.from({ length: 8 }).map((_, index) => {
		const id = index + 1;
		return {
			id,
			article: `B2B-${String(id).padStart(4, '0')}`,
			name: `B2B Product #${id}`,
			price: 1800 + id * 100,
		};
	});

export const createState = () => {
	let activeUserId = 2;

	const users = createUsers();
	const products = createProducts();
	const activeTokens = new Map();
	const carts = new Map();
	const userSettings = new Map();
	const userRequisites = new Map();
	const favoriteByUser = new Map([[2, new Set([1, 5, 10])]]);
	const discountRequests = [];
	const sellerApplications = [];
	const adminApplications = [
		{
			id: 1,
			name: 'IP Test',
			phone: '+79000000000',
			email: 'ip-test@example.com',
			status: 'pending',
		},
		{
			id: 2,
			name: 'Demo LLC',
			phone: '+79000000001',
			email: 'demo@example.com',
			status: 'approved',
		},
	];
	const orders = [];
	const b2bProducts = createB2bProducts();

	const getCurrentUser = () =>
		users.find((entry) => entry.id === activeUserId) ?? users[1];

	const setActiveUserId = (userId) => {
		activeUserId = userId;
	};

	const ensureCart = (userId) => {
		if (!carts.has(userId)) {
			carts.set(userId, { items: [], total: 0, currency: RUB });
		}
		return carts.get(userId);
	};

	const recalcCart = (cart) => {
		cart.total = cart.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		return cart;
	};

	return {
		RUB,
		sellers,
		products,
		users,
		activeTokens,
		carts,
		userSettings,
		userRequisites,
		favoriteByUser,
		discountRequests,
		sellerApplications,
		adminApplications,
		orders,
		b2bProducts,
		nowIso,
		parseIntOr,
		createToken,
		sanitizeUser,
		makeProduct,
		getCurrentUser,
		setActiveUserId,
		ensureCart,
		recalcCart,
	};
};
