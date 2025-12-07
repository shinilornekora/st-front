<template>
	<article
		:class="[$style.card, $style[type]]"
		tabindex="0"
		aria-label="Карточка товара"
	>
		<img :src="image" :alt="title" :class="$style.img" v-if="image" />
		<div :class="$style.body">
			<h3 :class="$style.title">{{ title }}</h3>
			<div :class="$style.price">
				<span :class="$style.current">{{ price }}₽</span>
				<s v-if="oldPrice" :class="$style.old">{{ oldPrice }}₽</s>
				<span v-if="discount" :class="$style.discount"
					>−{{ discount }}%</span
				>
			</div>
			<div :class="$style.rating">★ {{ rating }}</div>
			<div :class="$style.seller">{{ seller }}</div>
			<div :class="$style.actions">
				<slot name="actions" />
			</div>
		</div>
	</article>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		image?: string;
		title: string;
		price: number;
		oldPrice?: number;
		discount?: number;
		rating?: number;
		seller?: string;
		type?: 'grid' | 'list';
	}>();
</script>
<style module>
	@import './theme.module.css';
	.card {
		background: #fff;
		border-radius: 11px;
		box-shadow: 0 2px 10px #0001;
		padding: 14px 15px;
		display: flex;
		flex-direction: column;
		max-width: 280px;
		min-width: 210px;
		gap: 8px;
	}
	.card.grid {
		width: 240px;
	}
	.card.list {
		flex-direction: row;
		min-width: 320px;
		align-items: center;
	}
	.img {
		width: 100%;
		max-width: 112px;
		height: 92px;
		object-fit: cover;
		border-radius: 8px;
		background: var(--color-hover);
		align-self: center;
	}
	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.title {
		font-size: 15px;
		font-weight: 500;
		margin-bottom: 4px;
	}
	.price {
		font-size: 16px;
		font-weight: bold;
		display: flex;
		gap: 5px;
		align-items: end;
	}
	.current {
		color: var(--color-success-main);
	}
	.old {
		color: var(--color-secondary);
		font-size: 13px;
		text-decoration: line-through;
	}
	.discount {
		color: var(--color-error-main);
		font-size: 13px;
	}
	.rating {
		color: var(--color-accent);
		font-size: 13px;
	}
	.seller {
		color: var(--color-secondary);
		font-size: 12px;
	}
	.actions {
		margin-top: 7px;
		display: flex;
		gap: 5px;
	}
</style>
