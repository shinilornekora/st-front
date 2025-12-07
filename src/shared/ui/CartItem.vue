<template>
	<article
		:class="[$style.item, $style[type]]"
		tabindex="0"
		aria-label="Позиция в корзине"
	>
		<img v-if="image" :src="image" :alt="title" :class="$style.img" />
		<div :class="$style.info">
			<h4 :class="$style.title">{{ title }}</h4>
			<slot name="variations" />
			<div :class="$style.price">
				{{ price }}₽ x {{ qty }} =
				<b>{{ (price * qty).toFixed(2) }}₽</b>
			</div>
		</div>
		<button
			:class="$style.remove"
			@click="$emit('remove')"
			aria-label="Удалить из корзины"
		>
			×
		</button>
	</article>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		image?: string;
		title: string;
		price: number;
		qty: number;
		type?: 'selected' | 'error' | 'disabled';
	}>();
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
	}
	.price {
		font-size: 14px;
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
