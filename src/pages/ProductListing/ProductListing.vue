<template>
	<div :class="$style.page">
		<!-- Header -->
		<Header />

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

		<!-- Product Grid -->
		<main :class="$style.main">
			<div :class="$style.productGrid">
				<ProductCard
					v-for="product in displayedProducts"
					:key="product.id"
					:image="product.images && product.images.length > 0 ? product.images[0] : ''"
					:title="product.name"
					:price="product.price"
					:oldPrice="product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined"
					@click="goToProduct(product.id)"
					@add-to-cart="addToCart(product)"
				/>
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
		<Footer />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { $products, getProductsFx } from '../../entities/product/product.store';
import { addItem } from '../../entities/cart/cart.store';
import type { Product } from '../../entities/product/product.types';
import { Header, Footer } from '../../widgets';
import SearchField from '../../shared/ui/SearchField.vue';
import IconButton from '../../shared/ui/IconButton.vue';
import Carousel from '../../shared/ui/Carousel.vue';
import Chip from '../../shared/ui/Chip.vue';
import ProductCard from '../../shared/ui/ProductCard.vue';
import Button from '../../shared/ui/Button.vue';
import Link from '../../shared/ui/Link.vue';

const router = useRouter();

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

const goToProduct = (productId: number) => {
	router.push(`/product/${productId}`);
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
	background: #fff;
	padding-bottom: 46px; /* Space for mobile footer */
}

/* Hero Section */
.heroSection {
	background: white;
	padding: clamp(16px, 3vw, 24px) 0;
	overflow: hidden;
}

.heroCarousel {
	margin: 0 auto;
	padding: 0 120px;
	display: flex;
	gap: clamp(12px, 2vw, 16px);
	align-items: center;
}

.heroThumbnail {
	flex: 0 0 187px;
	height: 466px;
	width: 187px;
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
	height: 466px;
	width: 852px;
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
	padding: 0 120px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	overflow: scroll;
	gap: 18px;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.placeholderSection::-webkit-scrollbar {
	display: none;
}

.placeholderBox {
	height: 123px;
	width: -webkit-fill-available;
	min-width: 196px;
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
	padding: 0 120px;
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
	padding: 0 120px;
	padding-top: 23px;
	box-sizing: border-box;
	background: white;
}

.productGrid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 35px;
	width: 100%;
}

/* Pagination */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	padding: 0 clamp(8px, 2vw, 16px);
	margin-top: 32px;
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


@media (max-width: 1200px) {
	.placeholderSection {
		padding: 0 !important;
	}

	.placeholderBox {
		min-width: 107px;
		max-height: 71px;
	}
	
	.heroCarousel {
		padding: 0;
	}
	
	.heroThumbnail {
		height: 241px;
		width: 102px;
		flex: 0 0 102px;
		position: relative;
	}
	
	.heroThumbnail:first-child {
		margin-left: -30px;
	}

	.heroThumbnail:last-child {
		margin-right: -30px;
	}
	
	.heroMain {
		height: 241px;
		width: 442px;
	}
}

@media (max-width: 768px) {

	.heroCarousel {
		gap: 12px;
	}
	
	.heroThumbnail {
		max-width: 68px;
		height: 234px;
		position: relative;
	}
	
	.heroMain {
		width: 100%;
		height: 234px;
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

}

@media (max-width: 480px) {
	.headerContent {
		padding: 0 12px;
	}

	.categorySection {
		padding-left: 12px;
		padding-right: 12px;
	}

	.placeholderSection,
	.categoryScroll {
		padding-left: 12px;
		padding-right: 12px;
	}

	.main {
		padding: 16px 12px;
	}

	.heroThumbnail:first-child {
		max-width: 68px;
		height: 234px;
	}
	
	.heroThumbnail:last-child {
		max-width: 68px;
		height: 234px;
	}

	.heroMain {
		height: 234px;
		min-width: 309px;
	}

	.placeholderSection {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

	.productGrid {
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
	}

}

@media (max-width: 360px) {
	.productGrid {
		grid-template-columns: 1fr;
	}
}
</style>
