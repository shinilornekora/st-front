<template>
	<div :class="$style.page">
		<Header />

		<!-- Breadcrumbs -->
		<div :class="$style.breadcrumbs">
			<router-link to="/" :class="$style.breadcrumbLink">Главная страница</router-link>
			<span :class="$style.breadcrumbSeparator">›</span>
			<span :class="$style.breadcrumbCurrent">{{ product.name || 'Товар' }}</span>
		</div>

		<!-- Main Content -->
		<main :class="$style.main">
			<div :class="$style.productContainer">
				<!-- Left Column: Image Gallery -->
				<div :class="$style.imageGallery">
					<div :class="$style.mainImageContainer">
						<button
							:class="[$style.favoriteBtn, isFavorite ? $style.favoriteBtnActive : '']"
							aria-label="Добавить в избранное"
							@click="toggleFavoriteStatus"
						>
							<img
								:src="isFavorite ? darkHeartIcon : heartIcon"
								alt="Heart icon"
								:class="[$style.heartIcon, isFavorite ? $style.heartIconActive : '']"
							/>
						</button>
						<div :class="$style.leatherBadge">
							<svg width="40" height="40" viewBox="0 0 100 100" fill="none">
								<rect x="10" y="10" width="80" height="80" rx="8" stroke="currentColor" stroke-width="3"/>
								<path d="M30 30 Q50 45 70 30" stroke="currentColor" stroke-width="2" fill="none"/>
								<path d="M30 50 Q50 65 70 50" stroke="currentColor" stroke-width="2" fill="none"/>
								<path d="M30 70 Q50 55 70 70" stroke="currentColor" stroke-width="2" fill="none"/>
							</svg>
							<div :class="$style.leatherText">
								<span>НАТУРАЛЬНАЯ</span>
								<span>КОЖА</span>
							</div>
						</div>
						<div :class="$style.mainImageWrapper">
							<img v-if="currentImage" :src="currentImage" :alt="product.name" :class="$style.mainImage" />
							<div v-else :class="$style.imageSkeleton"></div>
						</div>
					</div>
					<div :class="$style.thumbnails">
						<button
							v-for="(image, index) in product.images"
							:key="index"
							:class="[$style.thumbnail, { [$style.thumbnailActive]: currentImageIndex === index }]"
							@click="currentImageIndex = index"
						>
							<img :src="image" :alt="`${product.name} ${index + 1}`" />
						</button>
					</div>
				</div>

				<!-- Right Column: Product Info -->
				<div :class="$style.productInfo">
					<div :class="$style.topRow">
						<span v-if="product.discount" :class="$style.badge">Распродажа</span>
					</div>
					
					<div :class="$style.titleRow">
						<h1 :class="$style.productTitle">{{ product.name }}</h1>
						<button :class="[$style.shareBtn, { [$style.shareBtnClicked]: shareBtnClicked }]" aria-label="Поделиться" @click="copyCurrentUrl">
							<img src="@assets/ghost_share.svg" alt="Share icon" :class="$style.shareIcon" />
						</button>
					</div>
					
					<div :class="$style.priceBlock">
						<span :class="$style.currentPrice">{{ formatPrice(product.price) }}</span>
						<span v-if="product.discount" :class="$style.oldPrice">{{ formatPrice(product.price / (1 - product.discount / 100)) }}</span>
					</div>
					
					<div :class="$style.articleRow">
						<span :class="$style.articleLabel">Артикул</span>
						<span :class="$style.articleValue">{{ product.article }}</span>
					</div>

					<div :class="$style.quantityBlock">
						<button :class="$style.quantityBtn" @click="decreaseQuantity" :disabled="quantity <= 1">
							<img src="@assets/minus_circle.svg" alt="Decrease quantity" :class="$style.quantityIcon" />
						</button>
						<input type="number" v-model.number="quantity" :class="$style.quantityInput" min="1" />
						<button :class="$style.quantityBtn" @click="increaseQuantity">
							<img src="@assets/plus_circle.svg" alt="Increase quantity" :class="$style.quantityIcon" />
						</button>
					</div>

					<button :class="$style.addToCartBtn" @click="addToCart">
						В корзину
					</button>
					
					<!-- Characteristics Section -->
					<section :class="$style.characteristicsSection">
						<h2 :class="$style.sectionTitle">Характеристики и описание</h2>
						<p :class="$style.sectionSubtitle">Основная информация</p>
						
						<div v-if="characteristics.length > 0" :class="$style.characteristicsTable">
							<div v-for="(char, index) in characteristics" :key="index" :class="$style.characteristicRow">
								<span :class="$style.charLabel">{{ char.label }}</span>
								<span :class="$style.charValue">{{ char.value }}</span>
							</div>
						</div>
						<div v-else :class="$style.characteristicsSkeleton">
							<div v-for="i in 5" :key="i" :class="$style.skeletonRow"></div>
						</div>
					</section>

				<!-- Additional Info Section (Accordion) -->
				<section :class="$style.additionalSection">
					<button :class="$style.accordionHeader" @click="toggleAccordion">
						<h2 :class="$style.sectionTitle">Дополнительная информация</h2>
						<svg 
							width="24" 
							height="24" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="currentColor" 
							stroke-width="2"
							:class="[$style.accordionIcon, { [$style.accordionIconOpen]: isAccordionOpen }]"
						>
							<polyline points="6 9 12 15 18 9"></polyline>
						</svg>
					</button>
					
					<Transition name="accordion">
						<div v-if="isAccordionOpen" :class="$style.accordionContent">
							<div :class="$style.additionalTable">
								<div v-for="(info, index) in additionalInfo" :key="index" :class="$style.additionalRow">
									<span :class="$style.infoLabel">{{ info.label }}</span>
									<span :class="$style.infoValue">{{ info.value }}</span>
								</div>
							</div>
						</div>
					</Transition>
				</section>
				</div>
			</div>

			<!-- Similar Products Section -->
			<section v-if="similarProducts.length === 0" :class="$style.similarSkeleton">
				<h2 :class="$style.sectionTitle">Вам может понравиться:</h2>
				<div :class="$style.skeletonCards">
					<div v-for="i in 5" :key="i" :class="$style.skeletonCard"></div>
				</div>
			</section>
			
			<Recommendations
				v-else
				title="Вам может понравиться:"
				:products="similarProducts"
				@product-click="goToProduct"
				@add-to-cart="addSimilarToCart"
			/>
		</main>

		<Footer />
		
		<!-- Status Line -->
		<StatusLine :show="showStatusLine" message="Ссылка на товар была успешно скопирована" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Header, Footer } from '@widgets/index';
import { recommendations } from '@entities/product/ui';
import { StatusLine, Skeleton } from '@shared/ui';
const { Recommendations } = recommendations;
import { addItem } from '@entities/cart/cart.store';
import type { Product } from '@entities/product/product.types';
import { getProductById, getSimilarProducts } from '@shared/api';
import { isUserAuthenticated } from '@shared/utils/auth';
import { isProductFavorite, toggleFavorite } from '@shared/utils/favorites';
import heartIcon from '@assets/heart_icon.svg';
import darkHeartIcon from '@assets/dark_heart_icon.svg';

interface ProductRouterState {
  product?: Partial<Product>;
}

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const quantity = ref(1);
const currentImageIndex = ref(0);
const isAccordionOpen = ref(false);
const isFavorite = ref(false);
const showStatusLine = ref(false);
const shareBtnClicked = ref(false);

// Get initial product data from router state if available
const routerState = history.state as ProductRouterState;
const stateProduct = routerState?.product;

// Initialize product with router state data if available, otherwise use empty defaults
const product = ref<Product>(stateProduct && stateProduct.id ? {
  id: stateProduct.id,
  name: stateProduct.name || '',
  slug: stateProduct.slug || '',
  description: stateProduct.description || '',
  price: stateProduct.price || 0,
  currency: stateProduct.currency || '₽',
  inStock: stateProduct.inStock ?? true,
  category: stateProduct.category || [],
  tags: stateProduct.tags || [],
  images: stateProduct.images || [],
  sizes: stateProduct.sizes || [],
  stockStatus: stateProduct.stockStatus || 'in_stock',
  gender: stateProduct.gender || 'unisex',
  seller: stateProduct.seller || { id: 0, name: '' },
  discount: stateProduct.discount,
  article: stateProduct.article,
} : {
  id: 0,
  name: '',
  slug: '',
  description: '',
  price: 0,
  currency: '₽',
  inStock: true,
  category: [],
  tags: [],
  images: [],
  sizes: [],
  stockStatus: 'in_stock',
  gender: 'unisex',
  seller: { id: 0, name: '' },
});

const characteristics = ref<Array<{label: string, value: string}>>([]);
const additionalInfo = ref<Array<{label: string, value: string}>>([]);
const similarProducts = ref<Product[]>([]);


const currentImage = computed(() => product.value.images[currentImageIndex.value]);

const formatPrice = (price: number) => {
	return `${price.toLocaleString('ru-RU')} ₽`;
};

const increaseQuantity = () => {
	quantity.value++;
};

const decreaseQuantity = () => {
	if (quantity.value > 1) {
		quantity.value--;
	}
};

const toggleAccordion = () => {
	isAccordionOpen.value = !isAccordionOpen.value;
};

const addToCart = () => {
	addItem({
		id: product.value.id,
		product: product.value as Product,
		quantity: quantity.value,
		price: product.value.price,
		discount: product.value.discount,
		currency: product.value.currency,
	});
};

const addSimilarToCart = (similarProduct: Product) => {
	addItem({
		id: similarProduct.id,
		product: similarProduct,
		quantity: 1,
		price: similarProduct.price,
		discount: similarProduct.discount,
		currency: similarProduct.currency,
	});
};

const goToProduct = (product: Product) => {
	// Pass product data through history state for instant display
	router.replace(`/product/${product.id}`);
	// Use history.replaceState to add product data to the current state
	history.replaceState({ product: { ...product } }, '');
};

onMounted(async () => {
	// Scroll to top when page loads
	window.scrollTo({ top: 0, behavior: 'instant' });
	
	try {
		// Load product data based on route.params.id
		const productId = parseInt(route.params.id as string, 10);
		if (!isNaN(productId)) {
			// If we don't have basic product data from router state, fetch it
			if (!product.value.id || product.value.id !== productId) {
				isLoading.value = true;
				const productResponse = await getProductById({ id: productId, __mock: true });
				
				if (productResponse.success && productResponse.data) {
					product.value = productResponse.data;
				}
				isLoading.value = false;
			}
			
			// Load additional data (characteristics and similar products) asynchronously
			// This happens in the background while basic product info is already displayed
			const loadAdditionalData = async () => {
				const [similarResponse] = await Promise.all([
					getSimilarProducts({ productId, __mock: true })
				]);
				
				// Generate characteristics based on product data
				const material = product.value.tags.find(tag => tag.name.includes('кожа') || tag.name.includes('замша') || tag.name.includes('нубук'))?.name || 'натуральная кожа';
				const color = product.value.tags.find(tag => ['черный', 'коричневый', 'бежевый', 'белый', 'синий', 'красный', 'серый', 'зеленый', 'бордовый'].includes(tag.name))?.name || 'черный';
				const brand = product.value.seller.name;
				
				// Import and generate characteristics
				const { mockData } = await import('../../shared/lib/mockData');
				characteristics.value = mockData.generateCharacteristics(material, color, brand);
				additionalInfo.value = mockData.generateAdditionalInfo();
				
				// Set similar products
				if (similarResponse.success && similarResponse.data) {
					similarProducts.value = similarResponse.data;
				}
			};
			
			// Load additional data in the background
			loadAdditionalData();
		}
	} catch (error) {
		console.error('Error loading product:', error);
		isLoading.value = false;
	}
});

// Check if product is favorite on mount and when product changes
const checkFavoriteStatus = () => {
	if (product.value.id && !isUserAuthenticated()) {
		isFavorite.value = isProductFavorite(product.value.id);
	}
};

// Watch for product changes
watch(() => product.value.id, () => {
	checkFavoriteStatus();
});

// Initial check
checkFavoriteStatus();

const toggleFavoriteStatus = () => {
	if (!product.value.id) return;
	
	if (!isUserAuthenticated()) {
		// Use localStorage for non-authenticated users
		isFavorite.value = toggleFavorite(product.value.id);
	} else {
		// For authenticated users, just toggle the UI state
		// In a real app, this would make an API call
		isFavorite.value = !isFavorite.value;
	}
	
	console.log('Product favorite status changed:', product.value.name, isFavorite.value);
};

const copyCurrentUrl = async () => {
	// Add click animation to button
	shareBtnClicked.value = true;
	setTimeout(() => {
		shareBtnClicked.value = false;
	}, 200);
	
	try {
		await navigator.clipboard.writeText(window.location.href);
		console.log('URL copied to clipboard:', window.location.href);
		showStatusLine.value = true;
		setTimeout(() => {
			showStatusLine.value = false;
		}, 2500);
	} catch (err) {
		console.error('Failed to copy URL:', err);
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = window.location.href;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
		showStatusLine.value = true;
		setTimeout(() => {
			showStatusLine.value = false;
		}, 2500);
	}
};
</script>

<style module>
@import '@shared/ui/theme.module.css';

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

/* Breadcrumbs */
.breadcrumbs {
	max-width: 1440px;
	margin: 0 auto;
	padding: 16px 120px;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	width: 100%;
	box-sizing: border-box;
}

.breadcrumbLink {
	color: var(--color-secondary);
	text-decoration: none;
	transition: color 0.2s;
}

.breadcrumbLink:hover {
	color: var(--color-accent);
}

.breadcrumbSeparator {
	color: var(--color-secondary);
}

.breadcrumbCurrent {
	color: var(--color-primary);
}

/* Main Content */
.main {
	flex: 1;
	max-width: 1440px;
	margin: 0 auto;
	padding: 0 120px 48px;
	width: 100%;
	box-sizing: border-box;
}

.productContainer {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 48px;
	margin-bottom: 48px;
	background: var(--background-default);
	padding: 32px;
	border-radius: 16px;
}

/* Image Gallery */
.imageGallery {
	display: flex;
	gap: 16px;
}

.mainImageContainer {
	flex: 1;
	position: relative;
	background: #f5f5f5;
	border-radius: 16px;
	max-height: min-content;
}

.favoriteBtn {
	position: absolute;
	top: 12px;
	left: 12px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.1);
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--color-secondary);
	transition: all 0.2s;
	z-index: 2;
}

.favoriteBtn:hover {
	color: var(--color-accent);
	transform: scale(1.1);
}

.favoriteBtnActive {
	background: rgba(255, 255, 255, 0.95);
}

.heartIcon {
	width: 24px;
	height: 24px;
	transition: all 0.2s;
}

.heartIconActive {
	width: 32px;
	height: 32px;
}

.leatherBadge {
	position: absolute;
	top: 24px;
	left: 24px;
	width: 120px;
	height: 120px;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	z-index: 1;
}

.leatherBadge svg {
	width: 50px;
	height: 50px;
	color: var(--color-primary);
	margin-bottom: 8px;
}

.leatherText {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 10px;
	font-weight: 700;
	color: var(--color-primary);
	line-height: 1.2;
	text-align: center;
}

.mainImageWrapper {
	width: 100%;
	aspect-ratio: 3 / 4;
	border-radius: 12px;
	overflow: hidden;
	background: var(--background-default);
}

.mainImage {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.thumbnails {
	display: flex;
	flex-direction: column;
	gap: 12px;
	flex-shrink: 0;
}

.thumbnail {
	width: 100px;
	height: 100px;
	border-radius: 12px;
	overflow: hidden;
	border: 2px solid transparent;
	cursor: pointer;
	transition: border-color 0.2s;
	padding: 0;
	background: #f3f4f6;
	flex-shrink: 0;
}

.thumbnail img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.thumbnail:hover {
	border-color: var(--color-accent);
}

.thumbnailActive {
	border-color: var(--color-accent);
}

/* Product Info */
.productInfo {
	display: flex;
	flex-direction: column;
}

.topRow {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.titleRow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 16px 0;
}

.badge {
	display: inline-block;
	background: var(--color-accent);
	color: var(--background-default);;
	padding: 6px 16px;
	border-radius: 16px;
	font-size: 14px;
	font-weight: 500;
}

.shareBtn {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	color: var(--color-secondary);
	transition: color 0.2s;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.shareBtn:hover {
	color: var(--color-accent);
}

.shareIcon {
	width: 20px;
	height: 20px;
}

.shareBtnClicked {
	transform: scale(0.9);
}

.productTitle {
	font-size: 28px;
	font-weight: 600;
	margin: 0;
	color: var(--color-primary);
	line-height: 1.3;
	text-align: left;
}

.priceBlock {
	display: flex;
	align-items: baseline;
	gap: 12px;
}

.currentPrice {
	font-size: 24px;
	font-weight: 700;
	color: var(--color-primary);
}

.oldPrice {
	font-size: 18px;
	color: var(--color-secondary);
	text-decoration: line-through;
}

.articleRow {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
}

.articleLabel {
	font-size: 14px;
	color: var(--color-secondary);
}

.articleValue {
	font-size: 14px;
	color: var(--color-primary);
	font-weight: 500;
}

.quantityBlock {
	display: flex;
	align-items: center;
	gap: 0;
	border: 2px solid var(--color-accent);
	border-radius: 50px;
	width: fit-content;
	padding: 4px;
}

.quantityBtn {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	border: none;
	background: transparent;
	color: var(--color-accent);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	flex-shrink: 0;
}

.quantityBtn:hover:not(:disabled) {
	background: var(--color-accent);
	color: var(--background-default);;
}

.quantityBtn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.quantityIcon {
	width: 20px;
	height: 20px;
}

.quantityInput {
	width: 50px;
	height: 36px;
	text-align: center;
	border: none;
	background: transparent;
	font-size: 16px;
	font-weight: 600;
	color: var(--color-primary);
}

.quantityInput::-webkit-outer-spin-button,
.quantityInput::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.quantityInput[type=number] {
	-moz-appearance: textfield;
}

.addToCartBtn {
	width: 100%;
	padding: 16px;
	background: var(--color-accent);
	color: var(--background-default);;
	border: none;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s;
	margin-top: 24px;
}

.addToCartBtn:hover {
	background: var(--color-focus);
}

/* Characteristics Section */
.characteristicsSection {
	text-align: left;
	background: var(--background-default);
	border-radius: 16px;
}

.sectionTitle {
	font-size: 24px;
	font-weight: 600;
	color: var(--color-primary);
	text-align: left;
	margin: 12px 0 0 0;
}

.sectionSubtitle {
	font-size: 14px;
	color: var(--color-primary);
	margin: 0 0 24px 0;
}

.characteristicsTable {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.characteristicRow {
	display: grid;
	grid-template-columns: 200px 1fr;
	gap: 32px;
	align-items: baseline;
}

.charLabel {
	color: var(--color-secondary);
	font-size: 15px;
}

.charValue {
	color: var(--color-primary);
	font-size: 15px;
	font-weight: 400;
}

/* Additional Info Section */
.additionalSection {
	background: var(--background-default);
	margin-bottom: 24px;
	overflow: hidden;
}

.accordionHeader {
	width: 100%;
	background: transparent;
	border: none;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: background 0.2s;
	padding: 0;
	margin-top: 16px;
}

.accordionHeader:hover {
	background: #f9fafb;
}

.accordionIcon {
	transition: transform 0.3s;
	color: var(--color-secondary);
}

.accordionIconOpen {
	transform: rotate(180deg);
}

.accordionContent {
	padding: 20px 0 0 0;
}

.additionalTable {
	text-align: left;
	display: flex;
	flex-direction: column;	
}

.additionalRow {
	display: grid;
	grid-template-columns: 240px 1fr;
	gap: 32px;
	align-items: baseline;
}

.infoLabel {
	color: var(--color-secondary);
	font-size: 15px;
}

.infoValue {
	color: var(--color-primary);
	font-size: 15px;
	font-weight: 400;
}

/* Accordion transition */
.accordion-enter-active,
.accordion-leave-active {
	transition: all 0.3s ease;
}

.accordion-enter-from {
	opacity: 0;
	max-height: 0;
}

.accordion-leave-to {
	opacity: 0;
	max-height: 0;
}


/* Responsive */
@media (max-width: 1024px) {
	.productContainer {
		grid-template-columns: 1fr;
		gap: 32px;
	}
	
	.imageGallery {
		flex-direction: column;
	}
	
	.thumbnails {
		flex-direction: row;
		overflow-x: auto;
	}
	
	.thumbnail {
		width: 80px;
		height: 80px;
	}
	
	.breadcrumbs,
	.main {
		padding-left: 32px;
		padding-right: 32px;
	}
	
}

@media (max-width: 768px) {
	.breadcrumbs,
	.main {
		padding-left: 16px;
		padding-right: 16px;
	}

	.mainImageContainer {
		padding: 0;
	}

	.mainImageWrapper {
		width: 100% !important;
		height: 100% !important;
	}

	.accordionHeader:hover {
		background: none;
	}

	.favoriteBtn {
		top: 12px;
		left: 12px;
	}

	.productContainer {
		padding: 24px 0 24px 0;
		margin-bottom: 0;
	}

	.productTitle {
		font-size: 22px;
	}

	.currentPrice {
		font-size: 20px;
	}

	.characteristicsSection,
	.additionalSection {
		padding: 24px 0 24px 0;
	}

	.characteristicsRow {
		display: flex;
		flex-direction: row;
		gap: 0;
	}

	.leatherBadge {
		width: 80px;
		height: 80px;
		padding: 8px;
	}
	
	.leatherBadge svg {
		width: 35px;
		height: 35px;
	}
	
	.leatherText {
		font-size: 8px;
	}

	.sectionTitle {
		font-size: 18px;
	}
	
	.mainImageWrapper {
		width: 166px;
		height: 198px;
	}
	
	.thumbnail {
		width: 50px;
		height: 60px;
	}

	.additionalTable {
		gap: 12px;
	}
}

/* Characteristics Skeleton */
.characteristicsSkeleton {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.skeletonRow {
	height: 20px;
	background: #e5e7eb;
	border-radius: 8px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonRow:nth-child(1) { width: 100%; }
.skeletonRow:nth-child(2) { width: 90%; }
.skeletonRow:nth-child(3) { width: 95%; }
.skeletonRow:nth-child(4) { width: 85%; }
.skeletonRow:nth-child(5) { width: 92%; }

/* Similar Products Skeleton */
.similarSkeleton {
	background: var(--background-default);
	padding: 32px;
	border-radius: 16px;
}

.skeletonCards {
	display: flex;
	gap: 35px;
	margin-top: 24px;
	overflow-x: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.skeletonCards::-webkit-scrollbar {
	display: none;
}

.skeletonCard {
	flex-shrink: 0;
	width: 166px;
	height: 278px;
	background: #e5e7eb;
	border-radius: 8px;
	animation: pulse 1.5s ease-in-out infinite;
}

/* Image Skeleton */
.imageSkeleton {
	width: 100%;
	height: 100%;
	background: #e5e7eb;
	animation: pulse 1.5s ease-in-out infinite;
}

/* Skeleton styles */
.skeletonBadge {
	width: 100px;
	height: 28px;
	background: #e5e7eb;
	border-radius: 16px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonTitle {
	width: 70%;
	height: 36px;
	background: #e5e7eb;
	border-radius: 8px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonPrice {
	width: 150px;
	height: 32px;
	background: #e5e7eb;
	border-radius: 8px;
	margin-top: 16px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonArticle {
	width: 100%;
	height: 20px;
	background: #e5e7eb;
	border-radius: 8px;
	margin: 12px 0;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonQuantity {
	width: 150px;
	height: 48px;
	background: #e5e7eb;
	border-radius: 50px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonButton {
	width: 100%;
	height: 54px;
	background: #e5e7eb;
	border-radius: 12px;
	margin-top: 24px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonCharacteristics {
	margin-top: 32px;
}

.skeletonCharacteristics::before {
	content: '';
	display: block;
	width: 300px;
	height: 28px;
	background: #e5e7eb;
	border-radius: 8px;
	margin-bottom: 8px;
	animation: pulse 1.5s ease-in-out infinite;
}

.skeletonCharacteristics::after {
	content: '';
	display: block;
	width: 200px;
	height: 16px;
	background: #e5e7eb;
	border-radius: 8px;
	margin-bottom: 24px;
	animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

/* Status Line */
.statusLine {
	position: fixed;
	bottom: 20px;
	right: 20px;
	background: var(--background-default);
	color: var(--color-dark);
	padding: 12px 20px;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	text-align: left;
	font-size: 14px;
	font-weight: 500;
	z-index: 1000;
	animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
	from {
		transform: translateX(100%);
		opacity: 0;
	}
	to {
		transform: translateX(0);
		opacity: 1;
	}
}
</style>
