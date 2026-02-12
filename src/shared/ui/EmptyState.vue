<template>
	<section :class="[$style.empty, type ? $style[type] : '']" role="status">
		<img v-if="img" :src="img" :alt="alt" :class="$style.img" />
		<div :class="$style.text"><slot /></div>
		<button v-if="cta" :class="$style.cta" @click="$emit('cta')">
			<slot name="cta">{{ cta }}</slot>
		</button>
	</section>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		img?: string;
		alt?: string;
		cta?: string;
		type?: 'main' | 'accent' | 'error' | 'success' | 'warning';
	}>();

	defineEmits<{
		cta: [];
	}>();
</script>
<style module>
	@import './theme.module.css';
	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 23px 0;
		min-height: 160px;
		justify-content: center;
		background: var(--color-hover);
		border-radius: 8px;
		box-shadow: 0 1px 6px #0001;
	}
	.img {
		width: 72px;
		height: 72px;
		object-fit: contain;
		margin-bottom: 8px;
	}
	.text {
		font-size: 15px;
		color: var(--color-secondary);
	}
	.cta {
		margin-top: 11px;
		background: var(--color-main);
		color: var(--background-default);
		padding: 7px 13px;
		border-radius: 3px;
		border: none;
		font-size: 15px;
		cursor: pointer;
	}
	.accent .cta {
		background: var(--color-accent);
	}
	.error .cta {
		background: var(--color-error-main);
	}
	.success .cta {
		background: var(--color-success-main);
	}
	.warning .cta {
		background: var(--color-warn-main);
	}
</style>
