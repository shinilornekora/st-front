export interface Product {
	id: number;
	name: string;
	slug: string;
	description: string;
	price: number;
	discount?: number;
	currency: string;
	inStock: boolean;
	article?: string; // Артикул товара
	category: Category[];
	tags: Tag[];
	images: string[];
	sizes: string[]; // Доступные размеры
	stockStatus: 'in_stock' | 'pre_order'; // Статус наличия
	gender: 'male' | 'female' | 'unisex'; // Пол
	seller: {
		id: number;
		name: string;
		logo?: string;
		rating?: number;
	};
	isFavorite?: boolean;
}
export interface Category {
	id: string;
	name: string;
	parentId?: string;
}
export interface Tag {
	id: string;
	name: string;
	color?: string;
}
