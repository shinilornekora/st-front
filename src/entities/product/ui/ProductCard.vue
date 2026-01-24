<template>
	<article
		:class="[$style.card, $style[type], recommendation ? $style.recommendation : '']"
		tabindex="0"
		aria-label="Карточка товара"
		@click="handleCardClick"
	>
		<div :class="$style.imageWrapper">
			<img :src="image" :alt="title" :class="$style.img" v-if="image" />
			<div :class="$style.heartContainer">
				<button
					:class="$style.heartBtn"
					@click.stop="toggleHeart"
					aria-label="Toggle favorite"
				>
					<img
						:src="isFavorite ? darkHeartIcon : heartIcon"
						alt="Heart icon"
						:class="[$style.heartIcon, isFavorite ? $style.active : '']"
					/>
				</button>
			</div>
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
				@click.stop="$emit('add-to-cart')"
				aria-label="Добавить в корзину"
			>
				<img src="@assets/shopping_cart.svg" alt="" :class="$style.cartIcon" />
			</button>
		</div>
	</article>
</template>
<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue';
	import theme from '@shared/ui/theme.module.css';
	import heartIcon from '@assets/heart_icon.svg';
	import darkHeartIcon from '@assets/dark_heart_icon.svg';
	import { isUserAuthenticated } from '@shared/utils/auth';
	import { isProductFavorite, toggleFavorite } from '@shared/utils/favorites';
	
	const props = defineProps<{
		id?: number;
		image?: string;
		title: string;
		price: number;
		oldPrice?: number;
		discount?: number;
		rating?: number;
		seller?: string;
		type?: 'grid' | 'list';
		recommendation?: boolean;
	}>();
	
	const emit = defineEmits(['add-to-cart', 'click', 'favourite']);
	
	const isFavorite = ref(false);
	
	// Check if product is favorite on mount
	onMounted(() => {
		if (props.id && !isUserAuthenticated()) {
			isFavorite.value = isProductFavorite(props.id);
		}
	});
	
	// Watch for id changes
	watch(() => props.id, (newId) => {
		if (newId && !isUserAuthenticated()) {
			isFavorite.value = isProductFavorite(newId);
		}
	});
	
	const toggleHeart = () => {
		if (!props.id) return;
		
		if (!isUserAuthenticated()) {
			// Use localStorage for non-authenticated users
			isFavorite.value = toggleFavorite(props.id);
		} else {
			// For authenticated users, just toggle the UI state
			// In a real app, this would make an API call
			isFavorite.value = !isFavorite.value;
		}
		
		// Emit the favourite event
		emit('favourite', { id: props.id, isFavorite: isFavorite.value });
	};
	
	const formatPrice = (price: number) => {
		return `${price.toLocaleString('ru-RU')} ₽`;
	};
	
	const handleCardClick = () => {
		emit('click');
	};
</script>
<style module>
	@import '@shared/ui/theme.module.css';
	
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
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.heartContainer {
		position: absolute;
		top: 8px;
		right: 8px;
		z-index: 1;
	}
	
	.heartBtn {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		padding: 0;
		backdrop-filter: blur(4px);
	}
	
	.heartBtn:hover {
		background: rgba(255, 255, 255, 0.95);
		transform: scale(1.1);
	}
	
	.heartBtn:active {
		transform: scale(0.95);
	}
	
	.heartIcon {
		width: 18px;
		height: 16px;
		transition: all 0.2s;
	}
	
	.heartIcon.active {
		width: 32px;
		height: 32px;
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
		gap: 5px;
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
		text-align: left;
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
	
	@media (min-width: 480px and max-width: 1200px) {
		.imageWrapper,
		.img {
			width: 18vw;
			height: 20vw;
			aspect-ratio: auto;
		}

		.card {
			width: 214px;
			height: 369px;
		}
	}

	/* Responsive */
	@media (max-width: 768px) {
		.card {
			gap: 8px;
			height: 278px;
			width: 180px;
		}

		.imageWrapper,
		.img {
			width: 100%;
			height: 196px;
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
	
	/* Recommendation card style */
	.card.recommendation {
		height: auto;
		width: 166px;
		gap: 8px;
	}
	
	.card.recommendation .imageWrapper {
		width: 166px;
		height: 198px;
		border-radius: 8px;
		aspect-ratio: auto;
	}
	
	.card.recommendation .body {
		display: flex;
		flex-direction: row;
		gap: 4px;
	}
	
	.card.recommendation .title {
		font-size: 20px;
		line-height: 1.2;
		-webkit-line-clamp: 2;
		padding-right: 10px;
	}
	
	.card.recommendation .price {
		font-size: 14px;
	}
	
	.card.recommendation .cartBtn {
		width: 28px;
		height: 28px;
	}
	
	.card.recommendation .cartIcon {
		width: 18px;
		height: 18px;
	}
</style>
