<template>
	<span
		:class="[$style.spinner, $style[type]]"
		:aria-label="ariaLabel"
		role="status"
	/>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		type?:
			| 'main'
			| 'secondary'
			| 'accent'
			| 'success'
			| 'warning'
			| 'error';
		ariaLabel?: string;
	}>();
</script>
<style module>
	@import './theme.module.css';
	.spinner {
		display: inline-block;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 4px solid var(--color-hover);
		border-top: 4px solid var(--color-main);
		animation: spin 1s linear infinite;
	}
	.secondary {
		border-top: 4px solid var(--color-secondary);
	}
	.accent {
		border-top: 4px solid var(--color-accent);
	}
	.success {
		border-top: 4px solid var(--color-success-main);
	}
	.warning {
		border-top: 4px solid var(--color-warn-main);
	}
	.error {
		border-top: 4px solid var(--color-error-main);
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
