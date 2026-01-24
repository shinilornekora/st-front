<template>
	<article
		:class="[$style.item, $style[type]]"
		tabindex="0"
		aria-label="Позиция в корзине"
	>
		<img v-if="image" :src="image" :alt="title" :class="$style.img" />
		<div :class="$style.info">
			<div :class="$style.topBlock">
				<h4 :class="$style.title">{{ title || 'No title' }}</h4>
				<div v-if="article" :class="$style.article">Артикул: {{ article }}</div>
			</div>
			<div :class="bottomBlock">
				<slot name="variations" />
				<div :class="$style.price">
					{{ formatPrice(price || 0) }} x {{ qty || 0 }} =
					<b>{{ formatPrice((price || 0) * (qty || 0)) }}</b>
				</div>
				<div :class="$style.actions">
					<button :class="$style.actionBtn" @click="$emit('favourite')" aria-label="Добавить в избранное">
						<img src="@assets/favourite.svg" alt="Favourite" :class="$style.actionIcon" />
					</button>
					<button :class="$style.actionBtn" @click="$emit('share')" aria-label="Поделиться">
						<img src="@assets/share.svg" alt="Share" :class="$style.actionIcon" />
					</button>
					<button
						:class="$style.remove"
						@click="$emit('remove')"
						aria-label="Удалить из корзины"
					>
						<img src="@assets/trash.svg" alt="Remove" :class="$style.actionIcon" />
					</button>
				</div>
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
					<img src="@assets/minus_circle.svg" alt="Decrease quantity" :class="$style.quantityIcon" />
				</button>
				<span :class="$style.quantity">{{ qty || 0 }}</span>
				<button
					:class="$style.quantityBtn"
					@click="increaseQuantity"
					aria-label="Увеличить количество"
				>
					<img src="@assets/plus_circle.svg" alt="Increase quantity" :class="$style.quantityIcon" />
				</button>
			</div>
		</div>
	</article>
</template>
<script setup lang="ts">
	import theme from '@shared/ui/theme.module.css';
	
	const props = defineProps<{
		id: number;
		image?: string;
		title: string;
		price: number;
		qty: number;
		article?: string;
		type?: 'selected' | 'error' | 'disabled';
	}>();
	
	const emit = defineEmits(['remove', 'update-quantity', 'favourite', 'share']);
	
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
	@import '@shared/ui/theme.module.css';
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
		width: 160px;
		height: 166px;
		object-fit: cover;
		border-radius: 6px;
	}
	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: left;
		height: 100%;
		justify-content: space-between;
	}
	.title {
		font-weight: 700;
		font-size: 20px;
		color: #333333;
		margin: 0;
	}
	.article {
		font-size: 12px;
		color: #6b7280;
		margin-top: 2px;
	}
	.price {
		font-size: 16px;
		color: #333333;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		height: 100%;
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
		cursor: pointer;
		padding: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.removeIcon {
		width: 20px;
		height: 20px;
	}
	.actions {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}
	.actionBtn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background-color 0.2s;
	}
	.actionBtn:hover {
		background-color: #f3f4f6;
	}
	.actionIcon {
		width: 28px;
		height: 28px;
	}
</style>
