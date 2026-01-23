<template>
	<section :class="$style.recommendationsSection">
		<h2 :class="$style.sectionTitle">{{ title }}</h2>
		
		<div :class="$style.recommendations">
			<ProductCard
				v-for="product in products"
				:key="product.id"
				:image="product.images && product.images.length > 0 ? product.images[0] : ''"
				:title="product.name"
				:price="product.price"
				:oldPrice="product.oldPrice"
				:recommendation="true"
				@click="$emit('product-click', product)"
				@add-to-cart="$emit('add-to-cart', product)"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue';

interface Product {
	id: number;
	name: string;
	price: number;
	oldPrice?: number;
	images?: string[];
}

defineProps<{
	title: string;
	products: Product[];
}>();

defineEmits<{
	'product-click': [product: Product];
	'add-to-cart': [product: Product];
}>();
</script>

<style module>
@import './theme.module.css';

.recommendationsSection {
	background: white;
	padding: 32px;
	border-radius: 16px;
}

.sectionTitle {
	font-size: 24px;
	font-weight: 600;
	color: #2c2c2c;
	text-align: left;
	margin: 0;
}

.recommendations {
	gap: 35px;
	display: flex;
	margin-top: 24px;
	flex-direction: row;
	overflow-x: auto;
	overflow-y: hidden;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.recommendations::-webkit-scrollbar {
	display: none;
}

/* Responsive */
@media (max-width: 768px) {
	.recommendationsSection {
		padding: 0;
	}
	
	.recommendations {
		gap: 12px;
	}
}
</style>
