<template>
	<div :class="$style.page">
		<Header />

		<!-- Breadcrumbs -->
		<div :class="$style.breadcrumbs">
			<router-link to="/" :class="$style.breadcrumbLink">Главная страница</router-link>
			<span :class="$style.breadcrumbSeparator">›</span>
			<span :class="$style.breadcrumbCurrent">Stivalli</span>
		</div>

		<!-- Main Content -->
		<main :class="$style.main">
			<div :class="$style.productContainer">
				<!-- Left Column: Image Gallery -->
				<div :class="$style.imageGallery">
					<div :class="$style.mainImageContainer">
						<button :class="$style.favoriteBtn" aria-label="Добавить в избранное">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							</svg>
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
							<img :src="currentImage" :alt="product.name" :class="$style.mainImage" />
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
						<button :class="$style.shareBtn" aria-label="Поделиться">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<circle cx="18" cy="5" r="3"></circle>
								<circle cx="6" cy="12" r="3"></circle>
								<circle cx="18" cy="19" r="3"></circle>
								<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
								<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
							</svg>
						</button>
					</div>
					
					<h1 :class="$style.productTitle">{{ product.name }}</h1>
					
					<div :class="$style.priceBlock">
						<span :class="$style.currentPrice">{{ formatPrice(product.price) }}</span>
						<span v-if="product.oldPrice" :class="$style.oldPrice">{{ formatPrice(product.oldPrice) }}</span>
					</div>
					
					<div :class="$style.articleRow">
						<span :class="$style.articleLabel">Артикул</span>
						<span :class="$style.articleValue">{{ product.article }}</span>
					</div>

					<div :class="$style.quantityBlock">
						<button :class="$style.quantityBtn" @click="decreaseQuantity" :disabled="quantity <= 1">
							<img src="../../assets/minus_circle.svg" alt="Decrease quantity" :class="$style.quantityIcon" />
						</button>
						<input type="number" v-model.number="quantity" :class="$style.quantityInput" min="1" />
						<button :class="$style.quantityBtn" @click="increaseQuantity">
							<img src="../../assets/plus_circle.svg" alt="Increase quantity" :class="$style.quantityIcon" />
						</button>
					</div>

					<button :class="$style.addToCartBtn" @click="addToCart">
						В корзину
					</button>
					
					<!-- Characteristics Section -->
					<section :class="$style.characteristicsSection">
						<h2 :class="$style.sectionTitle">Характеристики и описание</h2>
						<p :class="$style.sectionSubtitle">Основная информация</p>
						
						<div :class="$style.characteristicsTable">
							<div v-for="(char, index) in characteristics" :key="index" :class="$style.characteristicRow">
								<span :class="$style.charLabel">{{ char.label }}</span>
								<span :class="$style.charValue">{{ char.value }}</span>
							</div>
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
			<Recommendations
				title="Вам может понравиться:"
				:products="similarProducts"
				@product-click="goToProduct"
				@add-to-cart="addSimilarToCart"
			/>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Header, Footer } from '../../widgets';
import { ProductCard, Recommendations } from '../../shared/ui';
import { addItem } from '../../entities/cart/cart.store';
import type { Product } from '../../entities/product/product.types';
import { getSimilarProducts } from '../../shared/utils/mockData';

const route = useRoute();
const router = useRouter();

const quantity = ref(1);
const currentImageIndex = ref(0);
const isAccordionOpen = ref(0);
const product = ref<Product>({
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

const goToProduct = (product: any) => {
	// Use replace instead of push to ensure navigation happens even if we're on the same route
	router.replace(`/product/${product.id}`);
};

onMounted(async () => {
	// Scroll to top when page loads
	window.scrollTo({ top: 0, behavior: 'instant' });
	
	// Load product data based on route.params.id
	const productId = parseInt(route.params.id as string, 10);
	if (!isNaN(productId)) {
		const { getProductById } = await import('../../shared/utils/mockData');
		
		const productData = getProductById(productId);
		if (productData) {
			product.value = {
				...productData,
				article: `ART-${productId.toString().padStart(6, '0')}`,
			};
			
			// Generate characteristics based on product data
			const material = productData.tags.find(tag => tag.name.includes('кожа') || tag.name.includes('замша') || tag.name.includes('нубук'))?.name || 'натуральная кожа';
			const color = productData.tags.find(tag => ['черный', 'коричневый', 'бежевый', 'белый', 'синий', 'красный', 'серый', 'зеленый', 'бордовый'].includes(tag.name))?.name || 'черный';
			const brand = productData.seller.name;
			
			// Import and generate characteristics
			const { mockData } = await import('../../shared/utils/mockData');
			characteristics.value = mockData.generateCharacteristics(material, color, brand);
			additionalInfo.value = mockData.generateAdditionalInfo();
			
			// Generate similar products
			similarProducts.value = getSimilarProducts(productId);
		}
	}
});
</script>

<style module>
@import '../../shared/ui/theme.module.css';

.page {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	background: #fff;
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
	color: #6b7280;
	text-decoration: none;
	transition: color 0.2s;
}

.breadcrumbLink:hover {
	color: var(--color-accent);
}

.breadcrumbSeparator {
	color: #9ca3af;
}

.breadcrumbCurrent {
	color: #2c2c2c;
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
	background: white;
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
	padding: 16px;
}

.favoriteBtn {
	position: absolute;
	top: 24px;
	left: 24px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: white;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #9ca3af;
	transition: all 0.2s;
	z-index: 2;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favoriteBtn:hover {
	color: var(--color-accent);
	transform: scale(1.1);
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
	color: #2c2c2c;
	margin-bottom: 8px;
}

.leatherText {
	display: flex;
	flex-direction: column;
	align-items: center;
	font-size: 10px;
	font-weight: 700;
	color: #2c2c2c;
	line-height: 1.2;
	text-align: center;
}

.mainImageWrapper {
	width: 100%;
	aspect-ratio: 3 / 4;
	border-radius: 12px;
	overflow: hidden;
	background: white;
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
	justify-content: space-between;
	align-items: center;
}

.badge {
	display: inline-block;
	background: var(--color-accent);
	color: white;
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
	color: #6b7280;
	transition: color 0.2s;
	flex-shrink: 0;
}

.shareBtn:hover {
	color: var(--color-accent);
}

.productTitle {
	font-size: 28px;
	font-weight: 600;
	margin: 0;
	color: #2c2c2c;
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
	color: #2c2c2c;
}

.oldPrice {
	font-size: 18px;
	color: #9ca3af;
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
	color: #6b7280;
}

.articleValue {
	font-size: 14px;
	color: #2c2c2c;
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
	color: white;
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
	color: #2c2c2c;
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
	color: white;
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
	background: white;
	border-radius: 16px;
}

.sectionTitle {
	font-size: 24px;
	font-weight: 600;
	color: #2c2c2c;
	text-align: left;
	margin: 12px 0 0 0;
}

.sectionSubtitle {
	font-size: 14px;
	color: #333333;
	margin: 0 0 24px 0;
}

.characteristicsTable {
	display: flex;
	flex-direction: column;
}

.characteristicRow {
	display: grid;
	grid-template-columns: 200px 1fr;
	gap: 32px;
	align-items: baseline;
}

.charLabel {
	color: #6b7280;
	font-size: 15px;
}

.charValue {
	color: #2c2c2c;
	font-size: 15px;
	font-weight: 400;
}

/* Additional Info Section */
.additionalSection {
	background: white;
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
	color: #6b7280;
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
	color: #6b7280;
	font-size: 15px;
}

.infoValue {
	color: #2c2c2c;
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

	.productContainer {
		padding: 24px;
	}

	.productTitle {
		font-size: 22px;
	}

	.currentPrice {
		font-size: 20px;
	}

	.characteristicsSection,
	.additionalSection {
		padding: 24px;
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
	
	.characteristicRow,
	.additionalRow {
		grid-template-columns: 1fr;
		gap: 8px;
	}

	
	.mainImageWrapper {
		width: 166px;
		height: 198px;
	}
	
	.thumbnail {
		width: 50px;
		height: 60px;
	}

}
</style>
