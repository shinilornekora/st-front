<template>
	<div
		:class="[$style.carousel, $style[type]]"
		tabindex="0"
		aria-label="Галерея"
	>
		<button
			:class="$style.arrow"
			@click="prev"
			aria-label="Предыдущий"
			:disabled="index <= 0"
		>
			‹
		</button>
		<img :src="images[index]" :alt="`item-${index}`" :class="$style.img" />
		<button
			:class="$style.arrow"
			@click="next"
			aria-label="Следующий"
			:disabled="index >= images.length - 1"
		>
			›
		</button>
	</div>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	defineProps<{
		images: string[];
		type?: 'main' | 'accent' | 'error' | 'success';
	}>();
	const index = ref(0);
	function next() {
		if (index.value < images.length - 1) index.value++;
	}
	function prev() {
		if (index.value > 0) index.value--;
	}
</script>
<style module>
	@import './theme.module.css';
	.carousel {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.img {
		width: 160px;
		height: 110px;
		object-fit: cover;
		border-radius: 7px;
		border: 2px solid var(--color-hover);
		background: var(--color-hover);
	}
	.arrow {
		background: var(--color-secondary);
		color: var(--background-default);
		padding: 7px 11px;
		border: none;
		border-radius: 18px;
		cursor: pointer;
		font-size: 23px;
	}
	.main .img {
		border-color: var(--color-main);
	}
	.accent .img {
		border-color: var(--color-accent);
	}
	.error .img {
		border-color: var(--color-error-main);
	}
	.success .img {
		border-color: var(--color-success-main);
	}
	.arrow:disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>
