import type { Product } from '@entities/product/product.types';
import { i18n } from '@shared/i18n';

const t = i18n.global.t;

// Product name templates - using translation keys
const getProductTypes = () => [
	t('mockData.productTypes.sandals'),
	t('mockData.productTypes.boots'),
	t('mockData.productTypes.sneakers'),
	t('mockData.productTypes.shoes'),
	t('mockData.productTypes.keds'),
	t('mockData.productTypes.moccasins'),
	t('mockData.productTypes.loafers'),
	t('mockData.productTypes.oxfords'),
	t('mockData.productTypes.derby'),
	t('mockData.productTypes.brogues'),
	t('mockData.productTypes.trainers'),
	t('mockData.productTypes.espadrilles'),
	t('mockData.productTypes.slipons'),
	t('mockData.productTypes.uggs'),
	t('mockData.productTypes.booties'),
	t('mockData.productTypes.halfBoots'),
	t('mockData.productTypes.highBoots'),
	t('mockData.productTypes.overKneeBoots'),
];

const getMaterials = () => [
	t('mockData.materials.naturalLeather'),
	t('mockData.materials.suede'),
	t('mockData.materials.nubuck'),
	t('mockData.materials.textile'),
	t('mockData.materials.cotton'),
	t('mockData.materials.leatherette'),
	t('mockData.materials.ecoLeather'),
	t('mockData.materials.suedeMaterial'),
];

const getColors = () => [
	t('filters.colors.black'),
	t('filters.colors.brown'),
	t('filters.colors.beige'),
	t('filters.colors.white'),
	t('filters.colors.blue'),
	t('filters.colors.red'),
	t('filters.colors.gray'),
	t('filters.colors.green'),
];

const brands = [
	'Stivalli',
	'Marco Tozzi',
	'Rieker',
	'Gabor',
	'Tamaris',
	'ECCO',
	'Clarks',
	'Geox',
	'Skechers',
	'Adidas',
	'Nike',
	'Puma',
	'New Balance',
];

// Image URLs for different product types (all shoe photos)
const imageUrls = [
	'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
	'https://img.freepik.com/free-psd/classic-white-leather-sneakers-stylish-footwear-fashionable-shoes_632498-46182.jpg?semt=ais_hybrid&w=740',
	'https://img.freepik.com/premium-psd/psd-3d-heels-top-isolated-transparent-background_817178-4771.jpg?semt=ais_hybrid&w=740',
	'https://img.freepik.com/premium-vector/collection-silhouette-illustrations-types-womens-high-heel-shoes-silhouette-vector_1014129-3467.jpg?semt=ais_hybrid&w=740',
	'https://img.freepik.com/free-psd/elegant-brown-leather-oxford-shoes-stylish-footwear-choice_191095-86336.jpg?semt=ais_hybrid&w=740',
	'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
	'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
];

// Generate a random item from an array
const randomItem = <T>(array: T[]): T => {
	return array[Math.floor(Math.random() * array.length)]!;
};

// Generate a random number between min and max
const randomBetween = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random price
const generatePrice = (): number => {
	return randomBetween(2990, 25990);
};

// Generate product images
const generateImages = (count: number = 3): string[] => {
	const images: string[] = [];
	const usedIndexes = new Set<number>();

	for (let i = 0; i < count; i++) {
		let index;
		do {
			index = randomBetween(0, imageUrls.length - 1);
		} while (usedIndexes.has(index));

		usedIndexes.add(index);
		images.push(imageUrls[index]!);
	}

	return images;
};

// Generate product characteristics
const generateCharacteristics = (
	material: string,
	color: string,
	brand: string,
) => {
	const genderOptions = [
		t('mockData.characteristics.genderFemale'),
		t('mockData.characteristics.genderMale'),
		t('mockData.characteristics.genderUnisex'),
	];

	return [
		{ label: t('mockData.characteristics.color'), value: color },
		{
			label: t('mockData.characteristics.composition'),
			value: `${material} 100%`,
		},
		{
			label: t('mockData.characteristics.gender'),
			value: randomItem(genderOptions),
		},
		{ label: t('mockData.characteristics.manufacturer'), value: brand },
		{
			label: t('mockData.characteristics.phoneContact'),
			value: '+7 495 123 45 67',
		},
		{
			label: t('mockData.characteristics.emailAddress'),
			value: `info@${brand.toLowerCase().replace(/\s+/g, '')}.ru`,
		},
	];
};

// Generate additional product info
const generateAdditionalInfo = () => {
	return [
		{
			label: t('mockData.characteristics.soleMaterial'),
			value: randomItem([
				t('mockData.soleMaterials.tep'),
				t('mockData.soleMaterials.rubber'),
				t('mockData.soleMaterials.polyurethane'),
			]),
		},
		{
			label: t('mockData.characteristics.insoleMaterial'),
			value: randomItem([
				t('mockData.materials.naturalLeather'),
				t('mockData.materials.textile'),
				t('mockData.combined'),
			]),
		},
		{
			label: t('mockData.characteristics.liningMaterial'),
			value: randomItem([
				t('mockData.materials.naturalLeather'),
				t('mockData.materials.textile'),
				t('mockData.materials.leatherette'),
			]),
		},
		{
			label: t('mockData.characteristics.width'),
			value: randomItem(['F (6)', 'G (7)', 'H (8)']),
		},
		{
			label: t('mockData.characteristics.fastenerType'),
			value: randomItem([
				t('mockData.fasteners.buckle'),
				t('mockData.fasteners.laces'),
				t('mockData.fasteners.zipper'),
				t('mockData.fasteners.velcro'),
			]),
		},
		{
			label: t('mockData.characteristics.package'),
			value: t('mockData.characteristics.packageValue'),
		},
	];
};

// Generate a single product (deterministic based on ID)
export const generateProduct = (id: number): Product => {
	// Use the ID to make the generation deterministic
	const random = (seed: number) => {
		const x = Math.sin(seed) * 10000;
		return x - Math.floor(x);
	};

	const productTypes = getProductTypes();
	const materials = getMaterials();
	const colors = getColors();

	const typeIndex = Math.floor(random(id * 1) * productTypes.length);
	const materialIndex = Math.floor(random(id * 2) * materials.length);
	const colorIndex = Math.floor(random(id * 3) * colors.length);
	const brandIndex = Math.floor(random(id * 4) * brands.length);

	const type = productTypes[typeIndex];
	const material = materials[materialIndex];
	const color = colors[colorIndex];
	const brand = brands[brandIndex];

	const price = 2990 + ((id * 137) % 23000);
	const hasDiscount = random(id * 5) > 0.7;
	const discount = hasDiscount
		? 10 + Math.floor(random(id * 6) * 40)
		: undefined;

	// Generate deterministic images based on ID
	const generateDeterministicImages = (count: number = 3): string[] => {
		const images: string[] = [];
		for (let i = 0; i < count; i++) {
			const index = Math.floor(random(id * (i + 10)) * imageUrls.length);
			images.push(imageUrls[index]!);
		}
		return images;
	};

	// Generate article based on brand, type and ID
	const brandCode = brand!.substring(0, 3).toUpperCase();
	const typeCode = type!.substring(0, 3).toUpperCase();
	const article = `${brandCode}-${typeCode}-${id.toString().padStart(5, '0')}`;

	// Generate available sizes (simplified for performance)
	const allSizes = [
		'35',
		'36',
		'37',
		'38',
		'39',
		'40',
		'41',
		'42',
		'43',
		'44',
		'45',
		'46',
	];
	const sizeCount = 3 + Math.floor(random(id * 11) * 5); // 3-7 sizes per product
	const availableSizes: string[] = [];

	// Simple size generation without Set for better performance
	for (let i = 0; i < sizeCount; i++) {
		const sizeIndex = Math.floor(random(id * (i + 20)) * allSizes.length);
		if (!availableSizes.includes(allSizes[sizeIndex]!)) {
			availableSizes.push(allSizes[sizeIndex]!);
		}
	}

	// Generate stock status
	const stockStatus = random(id * 12) > 0.3 ? 'in_stock' : 'pre_order';

	// Generate gender
	const genderOptions = ['male', 'female', 'unisex'];
	const gender = genderOptions[
		Math.floor(random(id * 13) * genderOptions.length)
	] as 'male' | 'female' | 'unisex';

	// Generate gender-specific description using translation
	const genderText = t(`mockData.genderText.${gender}`);

	return {
		id,
		name: `${type!} ${brand!} ${color!}`,
		slug: `${type!.toLowerCase().replace(/\s+/g, '-')}-${brand!.toLowerCase()}-${id}`,
		description: t('mockData.description', {
			gender: genderText,
			brand: brand!,
			material: material!,
		}),
		price,
		discount,
		currency: '₽',
		inStock: stockStatus === 'in_stock',
		article,
		category: [
			{
				id: ['all', 'new', 'women', 'men', 'sale', 'accessories'][
					Math.floor(random(id * 8) * 6)
				]!,
				name: 'All',
			},
		],
		tags: [
			{ id: `tag-${material!}`, name: material! },
			{ id: `tag-${color!}`, name: color! },
			// Add 2-4 additional colors for variety
			{
				id: `tag-${colors[Math.floor(random(id * 14) * colors.length)]!}`,
				name: colors[Math.floor(random(id * 14) * colors.length)]!,
			},
			{
				id: `tag-${colors[Math.floor(random(id * 15) * colors.length)]!}`,
				name: colors[Math.floor(random(id * 15) * colors.length)]!,
			},
			...(random(id * 16) > 0.5
				? [
						{
							id: `tag-${colors[Math.floor(random(id * 17) * colors.length)]!}`,
							name: colors[
								Math.floor(random(id * 17) * colors.length)
							]!,
						},
					]
				: []),
			{ id: `tag-${brand!}`, name: brand! },
			{ id: `tag-${gender}`, name: genderText },
		],
		images: generateDeterministicImages(),
		sizes: availableSizes,
		stockStatus,
		gender,
		seller: {
			id: 1 + Math.floor(random(id * 9) * 10),
			name: brand!,
			rating: 3 + random(id * 10) * 2,
			logo: undefined,
		},
	};
};

// Generate multiple products
export const generateProducts = (count: number): Product[] => {
	const products: Product[] = [];
	for (let i = 1; i <= count; i++) {
		products.push(generateProduct(i));
	}
	return products;
};

// Get product by ID
export const getProductById = (id: number): Product | undefined => {
	// In a real app, this would fetch from an API
	// For now, we'll generate a deterministic product based on ID
	return generateProduct(id);
};

// Get similar products
export const getSimilarProducts = (
	currentProductId: number,
	count: number = 5,
): Product[] => {
	const similarProducts: Product[] = [];
	for (let i = 0; i < count; i++) {
		// Generate products with IDs different from the current one
		const id = currentProductId + i + 1;
		similarProducts.push(generateProduct(id));
	}
	return similarProducts;
};

// Export the mock data generators
export const mockData = {
	generateProduct,
	generateProducts,
	getProductById,
	getSimilarProducts,
	generateCharacteristics,
	generateAdditionalInfo,
};
