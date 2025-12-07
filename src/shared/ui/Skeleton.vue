<template>
	<span
		:class="[$style.skeleton, $style[type], $style[size]]"
		:style="{ width, height }"
	></span>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	withDefaults(
		defineProps<{
			type?: 'text' | 'circle' | 'rect';
			size?: 's' | 'm' | 'l';
			width?: string;
			height?: string;
		}>(),
		{
			type: 'text',
			size: 'm',
		},
	);
</script>
<style module>
	@import './theme.module.css';
	.skeleton {
		display: inline-block;
		vertical-align: middle;
		background: var(--color-hover);
		border-radius: 4px;
		animation: pulse 1.4s ease-in-out infinite;
	}
	.skeleton.text {
		height: 1em;
		border-radius: 4px;
	}
	.skeleton.circle {
		border-radius: 50%;
	}
	.skeleton.rect {
		border-radius: 5px;
	}
	.skeleton.s {
		min-width: 35px;
		height: 12px;
	}
	.skeleton.m {
		min-width: 75px;
		height: 20px;
	}
	.skeleton.l {
		min-width: 100px;
		height: 32px;
	}
	@keyframes pulse {
		0% {
			opacity: 0.67;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.67;
		}
	}
</style>
