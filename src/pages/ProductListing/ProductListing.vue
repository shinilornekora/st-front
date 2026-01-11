<template>
	<div :class="$style.page">
		<!-- Header -->
		<header :class="$style.header">
			<div :class="$style.headerContent">
				<img src="../../assets/logo_full.svg" alt="Stivalli" :class="$style.logo" />
				<div :class="$style.searchWrapper">
					<SearchField
						v-model="searchQuery"
						placeholder="Value"
						:class="$style.search"
					/>
				</div>
				<div :class="$style.headerIcons">
					<button :class="$style.iconBtn" aria-label="Избранное">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M12 6v6l4 2"/>
						</svg>
					</button>
					<button :class="$style.iconBtn" aria-label="Корзина">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 2L7 6H3l3 14h12l3-14h-4l-2-4H9z"/>
							<circle cx="9" cy="20" r="1"/>
							<circle cx="15" cy="20" r="1"/>
						</svg>
					</button>
					<button :class="$style.iconBtn" aria-label="Профиль">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="8" r="4"/>
							<path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
						</svg>
					</button>
				</div>
			</div>
		</header>

		<!-- Hero Carousel with 3 images -->
		<section :class="$style.heroSection">
			<div :class="$style.heroCarousel">
				<div :class="$style.heroThumbnail">
					<img :src="heroImages[0]" alt="Hero thumbnail 1" />
				</div>
				<div :class="$style.heroMain">
					<img :src="heroImages[1]" alt="Main hero image" />
				</div>
				<div :class="$style.heroThumbnail">
					<img :src="heroImages[2]" alt="Hero thumbnail 2" />
				</div>
			</div>
		</section>

		<!-- Gray placeholder boxes -->
		<section :class="$style.placeholderSection">
			<div :class="$style.placeholderBox" v-for="i in 6" :key="i"></div>
		</section>

		<!-- Category Chips -->
		<section :class="$style.categorySection">
			<div :class="$style.categoryScroll">
				<Chip
					v-for="category in categories"
					:key="category.id"
					:label="category.name"
					:selected="selectedCategory === category.id"
					@click="selectCategory(category.id)"
					:class="$style.categoryChip"
				/>
			</div>
		</section>

		<!-- Product Grid -->
		<main :class="$style.main">
			<div :class="$style.productGrid">
				<div v-for="product in displayedProducts" :key="product.id" :class="$style.productCardWrapper">
					<div :class="$style.productCard">
						<img
							:src="product.images && product.images.length > 0 ? product.images[0] : ''"
							:alt="product.name"
							:class="$style.productImage"
						/>
						<div :class="$style.productInfo">
							<h3 :class="$style.productName">{{ product.name }}</h3>
							<div :class="$style.productPrice">
								<span :class="$style.currentPrice">{{ product.price }} ₽</span>
								<span v-if="product.discount" :class="$style.oldPrice">{{ Math.round(product.price / (1 - product.discount / 100)) }} ₽</span>
								<span v-if="product.discount" :class="$style.discountBadge">−{{ product.discount }}%</span>
							</div>
							<button :class="$style.addToCartBtn" @click="addToCart(product)">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 2L7 6H3l3 14h12l3-14h-4l-2-4H9z"/>
									<circle cx="9" cy="20" r="1"/>
									<circle cx="15" cy="20" r="1"/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Pagination -->
			<nav :class="$style.pagination" aria-label="Pagination">
				<button
					:class="[$style.paginationBtn, $style.paginationArrow]"
					@click="goToPreviousPage"
					:disabled="currentPage === 1"
					aria-label="Previous page"
				>
					<img src="../../assets/arrow_left.svg" alt="" :class="$style.arrowIcon" />
					Previous
				</button>
				
				<button
					v-for="page in paginationPages"
					:key="page"
					:class="[$style.paginationBtn, { [$style.active]: page === currentPage }]"
					@click="goToPage(page)"
					:aria-label="`Page ${page}`"
					:aria-current="page === currentPage ? 'page' : undefined"
				>
					{{ page }}
				</button>
				
				<span v-if="showEllipsis" :class="$style.ellipsis">...</span>
				
				<button
					v-if="totalPages > 5 && currentPage < totalPages - 2"
					:class="$style.paginationBtn"
					@click="goToPage(totalPages)"
					:aria-label="`Page ${totalPages}`"
				>
					{{ totalPages }}
				</button>
				
				<button
					:class="[$style.paginationBtn, $style.paginationArrow]"
					@click="goToNextPage"
					:disabled="currentPage === totalPages"
					aria-label="Next page"
				>
					Next
					<img src="../../assets/arrow_right.svg" alt="" :class="$style.arrowIcon" />
				</button>
			</nav>
		</main>

		<!-- Footer -->
		<footer :class="$style.footer">
			<div :class="$style.footerContent">
				<div :class="$style.footerColumn">
					<h2 :class="$style.footerLogo">Stivalli</h2>
				</div>
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">Каталог</h3>
					<Link href="#" variant="secondary" :class="$style.footerLink">Новинки</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Женщинам</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Мужчинам</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Распродажа (Sale)</Link>
				</div>
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">Покупателям</h3>
					<Link href="#" variant="secondary" :class="$style.footerLink">Доставка и оплата</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Обмен и возврат</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Вопросы и ответы (FAQ)</Link>
				</div>
				<div :class="$style.footerColumn">
					<h3 :class="$style.footerTitle">О компании</h3>
					<Link href="#" variant="secondary" :class="$style.footerLink">О бренде Stivalli</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Контакты</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Партнерам (B2B)</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Публичная оферта</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Политика</Link>
					<Link href="#" variant="secondary" :class="$style.footerLink">Конфиденциальности</Link>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'effector-vue/composition';
import { $products, getProductsFx } from '../../entities/product/product.store';
import { addItem } from '../../entities/cart/cart.store';
import type { Product } from '../../entities/product/product.types';
import SearchField from '../../shared/ui/SearchField.vue';
import IconButton from '../../shared/ui/IconButton.vue';
import Carousel from '../../shared/ui/Carousel.vue';
import Chip from '../../shared/ui/Chip.vue';
import ProductCard from '../../shared/ui/ProductCard.vue';
import Button from '../../shared/ui/Button.vue';
import Link from '../../shared/ui/Link.vue';

// State
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 20;
const currentHeroIndex = ref(0);

// Store
const products = useStore($products);

// Hero images
const heroImages = ref([
	'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop',
	'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=400&fit=crop',
	'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&h=400&fit=crop',
]);

// Auto-rotate hero images
setInterval(() => {
	currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.value.length;
}, 5000);

// Categories
const categories = ref([
	{ id: 'all', name: 'Все' },
	{ id: 'new', name: 'Новинки' },
	{ id: 'women', name: 'Женщинам' },
	{ id: 'men', name: 'Мужчинам' },
	{ id: 'sale', name: 'Распродажа' },
	{ id: 'accessories', name: 'Аксессуары' },
]);

// Computed
const filteredProducts = computed(() => {
	let result = products.value;

	if (searchQuery.value) {
		result = result.filter((p) =>
			p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
		);
	}

	if (selectedCategory.value && selectedCategory.value !== 'all') {
		result = result.filter((p) =>
			p.category.some((c) => c.id === selectedCategory.value)
		);
	}

	return result;
});

const totalPages = computed(() =>
	Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const displayedProducts = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filteredProducts.value.slice(start, end);
});

const paginationPages = computed(() => {
	const pages: number[] = [];
	const maxVisible = 3;
	
	if (totalPages.value <= 5) {
		// Show all pages if 5 or fewer
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);
		
		// Show pages around current page
		if (currentPage.value > 2) {
			pages.push(currentPage.value - 1);
		}
		if (currentPage.value !== 1 && currentPage.value !== totalPages.value) {
			pages.push(currentPage.value);
		}
		if (currentPage.value < totalPages.value - 1) {
			pages.push(currentPage.value + 1);
		}
	}
	
	return [...new Set(pages)].sort((a, b) => a - b);
});

const showEllipsis = computed(() => {
	return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// Methods
const selectCategory = (categoryId: string) => {
	selectedCategory.value = categoryId;
	currentPage.value = 1;
};

const goToPage = (page: number) => {
	currentPage.value = page;
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToPreviousPage = () => {
	if (currentPage.value > 1) {
		goToPage(currentPage.value - 1);
	}
};

const goToNextPage = () => {
	if (currentPage.value < totalPages.value) {
		goToPage(currentPage.value + 1);
	}
};

const addToCart = (product: Product) => {
	addItem({
		id: product.id,
		product,
		quantity: 1,
		price: product.price,
		discount: product.discount,
		currency: product.currency,
	});
};

// Lifecycle
onMounted(async () => {
	await getProductsFx();
	
	// Generate mock products for demo
	const mockProducts: Product[] = [];
	for (let i = 1; i <= 100; i++) {
		mockProducts.push({
			id: i,
			name: 'Name',
			slug: `product-${i}`,
			description: 'Product description',
			price: 100500,
			discount: i % 3 === 0 ? 20 : undefined,
			currency: '₽',
			inStock: true,
			category: [{ id: 'all', name: 'All' }],
			tags: [],
			images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop'],
			seller: { id: 1, name: 'Seller' },
		});
	}
	
	// Set mock products
	const { setProducts } = await import('../../entities/product/product.store');
	setProducts(mockProducts);
});
</script>

<style module>
.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
}

/* Header */
.header {
	background: white;
	border-bottom: 1px solid #e5e5e5;
	padding: 12px 0;
	position: sticky;
	top: 0;
	z-index: 100;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.headerContent {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24px;
}

.logo {
	height: 35px;
	width: 138px;
	flex-shrink: 0;
	object-fit: contain;
}

.searchWrapper {
	flex: 1;
	max-width: 600px;
	min-width: 0;
}

.search {
	width: 100%;
}

.headerIcons {
	display: flex;
	gap: clamp(8px, 1.5vw, 12px);
	flex-shrink: 0;
}

.iconBtn {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	color: #6b7280;
	transition: color 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
}

.iconBtn:hover {
	color: #2c2c2c;
	background: #f3f4f6;
}

/* Hero Section */
.heroSection {
	background: white;
	padding: clamp(16px, 3vw, 24px) 0;
}

.heroCarousel {
	width: 100%;	margin: 0 auto;
	padding: 0 clamp(16px, 4vw, 32px);
	display: flex;
	gap: clamp(12px, 2vw, 16px);
	align-items: center;
}

.heroThumbnail {
	flex: 0 0 clamp(120px, 15vw, 180px);
	height: clamp(180px, 20vw, 250px);
	overflow: hidden;
	border-radius: 12px;
}

.heroThumbnail img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.heroMain {
	flex: 1;
	height: clamp(180px, 20vw, 250px);
	overflow: hidden;
	border-radius: 12px;
	min-width: 0;
}

.heroMain img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Placeholder Section */
.placeholderSection {
	background: white;
	width: 100%;
	margin: 0 auto;
	padding: 0 clamp(16px, 4vw, 32px) clamp(16px, 3vw, 24px);
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: clamp(12px, 2vw, 16px);
}

.placeholderBox {
	height: clamp(60px, 8vw, 80px);
	background: #d1d5db;
	border-radius: 8px;
}

/* Category Section */
.categorySection {
	background: white;
	padding: clamp(12px, 2vw, 16px) 0;
	border-bottom: 1px solid #e5e5e5;
}

.categoryScroll {
	width: 100%;
	margin: 0 auto;
	padding: 0 clamp(16px, 4vw, 32px);
	display: flex;
	gap: clamp(8px, 1.5vw, 12px);
	overflow-x: auto;
	scrollbar-width: none;
	-webkit-overflow-scrolling: touch;
}

.categoryScroll::-webkit-scrollbar {
	display: none;
}

.categoryChip {
	flex-shrink: 0;
}

/* Main Content */
.main {
	flex: 1;
	width: 100%;
	margin: 0 auto;
	padding: clamp(24px, 4vw, 32px) clamp(16px, 4vw, 32px);
	width: 100%;
	box-sizing: border-box;
}

.productGrid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
	gap: clamp(16px, 2vw, 20px);
	margin-bottom: clamp(32px, 5vw, 48px);
}

.productCardWrapper {
	display: flex;
	flex-direction: column;
}

.productCard {
	background: white;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	display: flex;
	flex-direction: column;
	height: 100%;
	transition: transform 0.2s, box-shadow 0.2s;
}

.productCard:hover {
	transform: translateY(-4px);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.productImage {
	width: 100%;
	aspect-ratio: 1 / 1;
	object-fit: cover;
	background: #f3f4f6;
}

.productInfo {
	padding: clamp(12px, 2vw, 16px);
	display: flex;
	flex-direction: column;
	gap: clamp(6px, 1vw, 8px);
	flex: 1;
}

.productName {
	font-size: clamp(13px, 1.5vw, 14px);
	font-weight: 500;
	margin: 0;
	color: #2c2c2c;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.productPrice {
	display: flex;
	align-items: center;
	gap: clamp(6px, 1vw, 8px);
	flex-wrap: wrap;
}

.currentPrice {
	font-size: clamp(15px, 2vw, 16px);
	font-weight: 700;
	color: #2e7d32;
}

.oldPrice {
	font-size: clamp(12px, 1.5vw, 13px);
	color: #9ca3af;
	text-decoration: line-through;
}

.discountBadge {
	font-size: clamp(11px, 1.3vw, 12px);
	color: #d32f2f;
	font-weight: 600;
}

.addToCartBtn {
	background: #5fdbd1;
	border: none;
	border-radius: 8px;
	padding: clamp(8px, 1.5vw, 10px);
	cursor: pointer;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background 0.2s, transform 0.1s;
	margin-top: auto;
}

.addToCartBtn:hover {
	background: #49a49d;
	transform: scale(1.05);
}

.addToCartBtn:active {
	transform: scale(0.98);
}

/* Pagination */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	padding: 0 clamp(8px, 2vw, 16px);
}

.paginationBtn {
	min-width: 40px;
	height: 40px;
	padding: 8px 12px;
	border: none;
	background: transparent;
	color: #2c2c2c;
	font-size: 14px;
	font-weight: 500;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.paginationBtn:hover:not(:disabled):not(.active) {
	background: #f3f4f6;
}

.paginationBtn:disabled {
	color: #d1d5db;
	cursor: not-allowed;
}

.paginationBtn.active {
	background: var(--color-main);
	color: white;
	font-weight: 600;
}

.paginationArrow {
	color: #6b7280;
	font-size: 14px;
}

.paginationArrow:hover:not(:disabled) {
	color: #2c2c2c;
	background: #f3f4f6;
}

.arrowIcon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.paginationBtn:disabled .arrowIcon {
	opacity: 0.3;
}

.ellipsis {
	padding: 0 8px;
	color: #6b7280;
	font-size: 14px;
	display: flex;
	align-items: center;
}

/* Footer */
.footer {
	background: #2c2c2c;
	color: white;
	padding: clamp(32px, 5vw, 48px) 0 clamp(24px, 3vw, 32px);
	margin-top: auto;
}

.footerContent {
	width: 100%;
	margin: 0 auto;
	padding: 0 clamp(16px, 4vw, 32px);
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
	gap: clamp(24px, 4vw, 32px);
}

.footerColumn {
	display: flex;
	flex-direction: column;
	gap: clamp(10px, 1.5vw, 12px);
}

.footerLogo {
	font-size: clamp(20px, 3vw, 24px);
	font-weight: 700;
	margin: 0;
	color: white;
}

.footerTitle {
	font-size: clamp(15px, 2vw, 16px);
	font-weight: 600;
	text-align: left;
	margin: 0 0 clamp(6px, 1vw, 8px) 0;
	color: white;
}

.footerLink {
	color: #9ca3af;
	text-align: left;
	text-decoration: none;
	font-size: clamp(13px, 1.5vw, 14px);
	transition: color 0.2s;
}

.footerLink:hover {
	color: white;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
	.heroThumbnail:first-child {
		display: none;
	}
}

@media (max-width: 768px) {
	.header {
		padding: 8px 0;
	}

	.headerContent {
		flex-wrap: wrap;
		gap: 8px;
	}

	.logo {
		flex: 1;
	}

	.searchWrapper {
		order: 3;
		flex-basis: 100%;
		max-width: none;
	}

	.headerIcons {
		gap: 4px;
	}

	.iconBtn {
		padding: 6px;
	}

	.heroCarousel {
		flex-direction: column;
		gap: 12px;
	}
	
	.heroThumbnail {
		width: 100%;
		height: 150px;
	}
	
	.heroMain {
		width: 100%;
		height: 200px;
	}
	
	.placeholderSection {
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	}

	.categoryScroll {
		gap: 8px;
	}

	.productGrid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
		gap: 12px;
	}

	.footerContent {
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
}

@media (max-width: 480px) {
	.headerContent {
		padding: 0 12px;
	}

	.heroSection,
	.categorySection {
		padding-left: 12px;
		padding-right: 12px;
	}

	.heroCarousel,
	.placeholderSection,
	.categoryScroll {
		padding-left: 12px;
		padding-right: 12px;
	}

	.main {
		padding: 16px 12px;
	}

	.heroThumbnail:last-child {
		display: none;
	}

	.heroMain {
		height: 180px;
	}

	.placeholderSection {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.productGrid {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.footerContent {
		grid-template-columns: 1fr;
		gap: 16px;
	}

	.footer {
		padding: 24px 0 16px;
	}
}

@media (max-width: 360px) {
	.productGrid {
		grid-template-columns: 1fr;
	}
}
</style>
