<template>
	<article
		:class="[$style.card, $style[type]]"
		tabindex="0"
		aria-label="Карточка товара"
	>
		<div :class="$style.imageWrapper">
			<img :src="image" :alt="title" :class="$style.img" v-if="image" />
		</div>
		<div :class="$style.body">
			<div :class="$style.footer">
				<h5 :class="$style.title">{{ title }}</h5>
				<div :class="$style.priceWrapper">
					<span :class="$style.price">{{ formatPrice(price) }}</span>
				</div>
			</div>
			<button
				:class="$style.cartBtn"
				@click="$emit('add-to-cart')"
				aria-label="Добавить в корзину"
			>
				<img src="../../assets/shopping_cart.svg" alt="" :class="$style.cartIcon" />
			</button>
		</div>
	</article>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	
	const props = defineProps<{
		image?: string;
		title: string;
		price: number;
		oldPrice?: number;
		discount?: number;
		rating?: number;
		seller?: string;
		type?: 'grid' | 'list';
	}>();
	
	const emit = defineEmits(['add-to-cart']);
	
	const formatPrice = (price: number) => {
		return `${price.toLocaleString('ru-RU')} ₽`;
	};
</script>
<style module>
	@import './theme.module.css';
	
	.card {
		background: transparent;
		display: flex;
		flex-direction: column;
		cursor: pointer;
		height: 100%;
		gap: 12px;
		height: 378px;
    	width: 234px;
	}
	
	.card.list {
		flex-direction: row;
		align-items: center;
	}
	
	.imageWrapper {
		width: 100%;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background: #f3f4f6;
		position: relative;
		border-radius: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.card:hover .imageWrapper {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	}
	
	.card.list .imageWrapper {
		width: 200px;
		aspect-ratio: 1 / 1;
		flex-shrink: 0;
	}
	
	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s;
	}
	
	.card:hover .img {
		transform: scale(1.05);
	}
	
	.body {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex: 1;
	}
	
	.title {
		font-size: 22px;
		font-weight: 600;
		margin: 0;
		color: #2c2c2c;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		line-height: 1.3;
		text-align: left;
	}
	
	.footer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.priceWrapper {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	
	.price {
		font-size: 16px;
		font-weight: 600;
		color: #333333;
	}
	
	.cartBtn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		flex-shrink: 0;
		padding: 0;
	}
	
	.cartIcon {
		width: 24px;
		height: 24px;
		color: var(--color-accent);
	}
	
	.cartBtn:hover {
		transform: scale(1.1);
	}
	
	.cartBtn:hover .cartIcon {
		filter: brightness(1.2);
	}
	
	.cartBtn:active {
		transform: scale(0.95);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.card {
			gap: 8px;
		}
		
		.imageWrapper {
			border-radius: 16px;
		}
		
		.title {
			font-size: 14px;
		}
		
		.price {
			font-size: 14px;
		}
		
		.cartBtn {
			width: 32px;
			height: 32px;
		}
		
		.cartIcon {
			width: 20px;
			height: 20px;
		}
	}
</style>
