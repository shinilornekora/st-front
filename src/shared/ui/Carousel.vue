<template>
	<div
		:class="[$style.carousel, $style[type]]"
		tabindex="0"
		:aria-label="t('ui.gallery')"
	>
		<button
			:class="$style.arrow"
			:aria-label="t('ui.previous')"
			:disabled="index <= 0"
			@click="prev"
		>
			‹
		</button>
		<img :src="images[index]" :alt="`item-${index}`" :class="$style.img" />
		<button
			:class="$style.arrow"
			:aria-label="t('ui.next')"
			:disabled="index >= images.length - 1"
			@click="next"
		>
			›
		</button>
	</div>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import { useI18n } from 'vue-i18n';
	import theme from './theme.module.css';

	const { t } = useI18n();

	const props = defineProps<{
		images: string[];
		type?: 'main' | 'accent' | 'error' | 'success';
	}>();
	const index = ref(0);
	function next() {
		if (index.value < props.images.length - 1) index.value++;
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
