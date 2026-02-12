<template>
	<span :class="[$style.badge, type && $style[type]]" role="status">
		<slot />
	</span>
</template>
<script setup lang="ts">
	defineProps<{ type?: 'success' | 'warning' | 'error' | 'info' }>();
</script>
<style module>
	@import './theme.module.css';
	.badge {
		display: inline-block;
		padding: 2px 9px;
		border-radius: 12px;
		font-size: 12px;
		min-width: 22px;
		text-align: center;
		background: var(--color-hover);
		color: var(--color-primary);
	}
	.success {
		background: var(--color-success-main);
		color: var(--background-default);
	}
	.warning {
		background: var(--color-warn-main);
		color: var(--background-default);
	}
	.error {
		background: var(--color-error-main);
		color: var(--background-default);
	}
	.info {
		background: var(--color-main);
		color: var(--background-default);
	}
</style>
