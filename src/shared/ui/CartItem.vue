<template>
	<article
		:class="[$style.item, $style[type]]"
		tabindex="0"
		aria-label="Позиция в корзине"
	>
		<img v-if="image" :src="image" :alt="title" :class="$style.img" />
		<div :class="$style.info">
			<h4 :class="$style.title">{{ title || 'No title' }}</h4>
			<slot name="variations" />
			<div :class="$style.price">
				{{ formatPrice(price || 0) }} x {{ qty || 0 }} =
				<b>{{ formatPrice((price || 0) * (qty || 0)) }}</b>
			</div>
		</div>
		<div :class="$style.controls">
			<div :class="$style.quantityControl">
				<button
					:class="$style.quantityBtn"
					@click="decreaseQuantity"
					:disabled="qty <= 1"
					aria-label="Уменьшить количество"
				>
					<img src="../../assets/minus_circle.svg" alt="Decrease quantity" :class="$style.quantityIcon" />
				</button>
				<span :class="$style.quantity">{{ qty || 0 }}</span>
				<button
					:class="$style.quantityBtn"
					@click="increaseQuantity"
					aria-label="Увеличить количество"
				>
					<img src="../../assets/plus_circle.svg" alt="Increase quantity" :class="$style.quantityIcon" />
				</button>
			</div>
			<button
				:class="$style.remove"
				@click="$emit('remove')"
				aria-label="Удалить из корзины"
			>
				×
			</button>
		</div>
	</article>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	
	const props = defineProps<{
		id: number;
		image?: string;
		title: string;
		price: number;
		qty: number;
		type?: 'selected' | 'error' | 'disabled';
	}>();
	
	const emit = defineEmits(['remove', 'update-quantity']);
	
	const formatPrice = (price: number) => {
		return `${price.toLocaleString('ru-RU')} ₽`;
	};
	
	const decreaseQuantity = () => {
		if (props.qty > 1) {
			emit('update-quantity', { id: props.id, quantity: props.qty - 1 });
		}
	};
	
	const increaseQuantity = () => {
		emit('update-quantity', { id: props.id, quantity: props.qty + 1 });
	};
</script>
<style module>
	@import './theme.module.css';
	.item {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 8px 18px;
		background: #fff;
		border-radius: 9px;
		box-shadow: 0 1px 8px #0001;
		margin-bottom: 7px;
	}
	.selected {
		outline: 2px solid var(--color-accent);
	}
	.error {
		background: var(--color-error-light);
	}
	.disabled {
		opacity: 0.59;
		filter: grayscale(0.12);
	}
	.img {
		width: 65px;
		height: 54px;
		object-fit: cover;
		border-radius: 6px;
	}
	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.title {
		font-weight: 500;
		font-size: 15px;
		color: #2c2c2c;
	}
	.price {
		font-size: 14px;
		color: #2c2c2c;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.quantityControl {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.quantityBtn {
		width: 24px;
		height: 24px;
		border-radius: 4px;
		border: 1px solid #e5e7eb;
		background: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		transition: all 0.2s;
	}
	.quantityBtn:hover:not(:disabled) {
		background: #f3f4f6;
		border-color: #d1d5db;
	}
	.quantityBtn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.quantity {
		font-size: 14px;
		font-weight: 500;
		min-width: 20px;
		text-align: center;
		color: #2c2c2c;
	}
	.remove {
		background: none;
		border: none;
		color: var(--color-error-main);
		font-size: 22px;
		cursor: pointer;
		font-weight: bold;
		padding: 0 7px;
	}
</style>
