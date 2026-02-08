<template>
	<div :class="$style.page">
		<!-- Header -->
		<Header
			:initial-filters="activeFilters"
			@search="handleHeaderSearch"
			@filter="handleFilterChange"
		/>

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
			<div ref="productGrid" :class="$style.productGrid">
				<ProductCard
					v-for="product in displayedProducts"
					:key="product.id"
					:id="product.id"
					:image="product.images && product.images.length > 0 ? product.images[0] : ''"
					:title="product.name"
					:price="product.price"
					:oldPrice="product.discount ? Math.round(product.price / (1 - product.discount / 100)) : undefined"
					:product="product"
					@click="goToProduct"
					@add-to-cart="addToCart(product)"
				/>
			</div>

			<!-- Pagination -->
			<Pagination
				:current-page="currentPage"
				:total-pages="totalPages"
				:max-visible-pages="7"
				previous-text="Previous"
				next-text="Next"
				:scroll-to-top="false"
				@page-change="handlePageChange"
			/>
		</main>

		<!-- Footer -->
		<Footer />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'effector-vue/composition';
import { $products, getProductsFx } from '@entities/product/product.store';
import { addItem } from '@entities/cart/cart.store';
import type { Product } from '@entities/product/product.types';
import Header from '@widgets/Header.vue';
import Footer from '@widgets/Footer.vue';
import { Pagination } from '@shared/ui';
import ProductCard from '@entities/product/ui/ProductCard.vue';

const router = useRouter();
const route = useRoute();

// State
const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 20;
const activeFilters = ref<any[]>([]);

// Watch for category changes in URL query params
watch(() => route.query.category, (newCategory) => {
	if (newCategory) {
		// Map category to gender filter
		if (newCategory === 'women') {
			activeFilters.value = [{
				id: 'sex',
				label: 'Женский',
				values: ['female']
			}];
		} else if (newCategory === 'men') {
			activeFilters.value = [{
				id: 'sex',
				label: 'Мужской',
				values: ['male']
			}];
		} else {
			selectedCategory.value = newCategory as string;
		}
		currentPage.value = 1;
	} else {
		// Clear filters if no category
		if (selectedCategory.value || activeFilters.value.length > 0) {
			selectedCategory.value = null;
			activeFilters.value = [];
		}
	}
}, { immediate: true });

// Store
const products = useStore($products);

// Hero images
const heroImages = ref([
	'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop',
	'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=400&fit=crop',
	'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&h=400&fit=crop',
]);

// Auto-rotate hero images
let heroInterval: number | null = null;

const startHeroRotation = () => {
	heroInterval = window.setInterval(() => {
		// We don't need to track currentHeroIndex since we're not using it
	}, 5000);
};

const stopHeroRotation = () => {
	if (heroInterval) {
		clearInterval(heroInterval);
		heroInterval = null;
	}
};

// Computed
const filteredProducts = computed(() => {
	// Early return if no products
	if (!products.value || products.value.length === 0) {
		return [];
	}
	
	let result = [...products.value]; // Create a copy to avoid mutations

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter((p) => {
			// Search in product name
			if (p.name.toLowerCase().includes(query)) return true;
			
			// Search in brand (seller name)
			if (p.seller && p.seller.name.toLowerCase().includes(query)) return true;
			
			// Search in description
			if (p.description.toLowerCase().includes(query)) return true;
			
			// Search in tags
			if (p.tags.some(tag => tag.name.toLowerCase().includes(query))) return true;
			
			// Search in article
			if (p.article && p.article.toLowerCase().includes(query)) return true;
			
			return false;
		});
	}

	// Apply filters
	if (activeFilters.value && activeFilters.value.length > 0) {
		result = result.filter((p) => {
			return activeFilters.value.every((filter) => {
				switch (filter.id) {
					case 'size':
						// Check if product has the selected size
						return filter.values.some((size: string) =>
							p.sizes && p.sizes.includes(size)
						);
					
					case 'quantity':
						// Check stock status
						if (filter.values.includes('in_stock')) {
							return p.stockStatus === 'in_stock';
						}
						if (filter.values.includes('pre_order')) {
							return p.stockStatus === 'pre_order';
						}
						return true;
					
					case 'price':
						const [min, max] = filter.values;
						const price = p.price;
						if (min && max) {
							return price >= parseInt(min) && price <= parseInt(max);
						}
						if (min) {
							return price >= parseInt(min);
						}
						if (max) {
							return price <= parseInt(max);
						}
						return true;
					
					case 'sex':
						// Check gender directly from the product property
						return filter.values.includes(p.gender);
					
					case 'color':
						// Check if product name, description or tags contain the color
						return filter.values.some((color: string) => {
							const colorNames: Record<string, string> = {
								'black': 'черный',
								'white': 'белый',
								'brown': 'коричневый',
								'beige': 'бежевый',
								'gray': 'серый',
								'blue': 'синий',
								'red': 'красный',
								'green': 'зеленый'
							};
							const colorName = colorNames[color] || color;
							return p.name.toLowerCase().includes(colorName) ||
								p.description.toLowerCase().includes(colorName) ||
								p.tags.some(tag => tag.name.toLowerCase().includes(colorName));
						});
					
					default:
						return true;
				}
			});
		});
	}

	if (selectedCategory.value && selectedCategory.value !== 'all') {
		result = result.filter((p) =>
			p.category && p.category.some((c) => c.id === selectedCategory.value)
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


// Methods

const handleHeaderSearch = (query: string) => {
	searchQuery.value = query;
	currentPage.value = 1; // Reset to first page when searching
};

const handleFilterChange = (filters: any[]) => {
	activeFilters.value = filters;
	currentPage.value = 1; // Reset to first page when filters change
};

const productGrid = ref<HTMLElement | null>(null);

const handlePageChange = (page: number) => {
	currentPage.value = page;
	// Scroll to the product grid instead of the top of the page
	if (productGrid.value) {
		// + Header height... maybe.
		productGrid.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
};

const goToProduct = (product: Product) => {
	// Pass product data through history state for instant display
	router.push(`/product/${product.id}`);
	// Use history.replaceState to add product data to the current state
	history.replaceState({ product: { ...product } }, '');
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
	startHeroRotation();
});

onUnmounted(() => {
	stopHeroRotation();
});
</script>

<style module>
.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: var(--background-default);
}

@media (max-width: 480px) {
	.page {
		padding-bottom: 46px; /* Space for mobile footer */
	}
}

/* Hero Section */
.heroSection {
	background: var(--background-default);
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
	background: var(--background-default);
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
	background: var(--background-default);
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
	background: var(--background-default);
}

.productGrid {
	display: grid;
	place-items: center;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 35px;
	width: 100%;
}


@media (max-width: 1200px) {
	.placeholderSection {
		padding: 0 !important;
	}
	
	.productGrid {
		grid-template-columns: repeat(auto-fill, minmax(20vw, 1fr));
	}

	.main {
		padding: 20px 20px 48px;
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

@media (max-width: 424px) {
	.heroCarousel {
		transform: translateX(-16px);
	}
}

@media (max-width: 360px) {
	.productGrid {
		grid-template-columns: 1fr;
	}
}
</style>
