<template>
	<aside :class="[$style.full, type && $style[type]]" aria-busy="true" role="alert">
		<span :class="$style.inner">
			<slot><span :class="$style.spinner" /></slot>
		</span>
	</aside>
</template>
<script setup lang="ts">
	defineProps<{
		type?: 'main' | 'accent' | 'success' | 'warning' | 'error';
	}>();
</script>
<style module>
	@import './theme.module.css';
	.full {
		position: fixed;
		inset: 0;
		background: #fffedda0;
		z-index: 40002;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.inner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.spinner {
		display: inline-block;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 5px solid var(--color-hover);
		border-top: 5px solid var(--color-main);
		animation: spin 1s linear infinite;
	}
	.accent .spinner {
		border-top: 5px solid var(--color-accent);
	}
	.success .spinner {
		border-top: 5px solid var(--color-success-main);
	}
	.warning .spinner {
		border-top: 5px solid var(--color-warn-main);
	}
	.error .spinner {
		border-top: 5px solid var(--color-error-main);
	}
	@keyframes spin {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
