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
			<h3 :class="$style.title">{{ title }}</h3>
			<div :class="$style.footer">
				<div :class="$style.priceWrapper">
					<span :class="$style.price">{{ formatPrice(price) }}</span>
					<s v-if="oldPrice" :class="$style.oldPrice">{{ formatPrice(oldPrice) }}</s>
				</div>
				<button
					:class="$style.cartBtn"
					@click="$emit('add-to-cart')"
					aria-label="Добавить в корзину"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M9 2L7 6H3l3 14h12l3-14h-4l-2-4H9z"/>
						<circle cx="9" cy="20" r="1"/>
						<circle cx="15" cy="20" r="1"/>
					</svg>
				</button>
			</div>
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
		background: #fff;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: pointer;
		height: 100%;
	}
	
	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}
	
	.title {
		font-size: 16px;
		font-weight: 600;
		margin: 0;
		color: #2c2c2c;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.4;
		min-height: 2.8em;
	}
	
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
	}
	
	.priceWrapper {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	
	.price {
		font-size: 18px;
		font-weight: 700;
		color: #2c2c2c;
	}
	
	.oldPrice {
		font-size: 14px;
		color: #9ca3af;
		text-decoration: line-through;
	}
	
	.cartBtn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		background: var(--color-accent);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		flex-shrink: 0;
	}
	
	.cartBtn:hover {
		background: var(--color-focus);
		transform: scale(1.1);
	}
	
	.cartBtn:active {
		transform: scale(0.95);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.body {
			padding: 12px;
			gap: 8px;
		}
		
		.title {
			font-size: 14px;
			min-height: 2.6em;
		}
		
		.price {
			font-size: 16px;
		}
		
		.oldPrice {
			font-size: 13px;
		}
		
		.cartBtn {
			width: 36px;
			height: 36px;
		}
		
		.cartBtn svg {
			width: 18px;
			height: 18px;
		}
	}
</style>
