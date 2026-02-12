<template>
	<section :class="[$style.filter, type && $style[type]]" role="region">
		<header v-if="$slots.header" :class="$style.header">
			<slot name="header" />
		</header>
		<main :class="$style.body"><slot /></main>
	</section>
</template>
<script setup lang="ts">
	defineProps<{
		type?: 'main' | 'accent' | 'error' | 'success' | 'warning';
	}>();
</script>
<style module>
	@import '@shared/ui/theme.module.css';
	.filter {
		background: var(--color-hover);
		border-radius: 8px;
		padding: 10px 16px;
		box-shadow: 0 0 8px #0001;
	}
	.header {
		font-weight: 500;
		font-size: 14px;
		color: var(--color-primary);
		margin-bottom: 6px;
	}
	.body {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	.main {
		border-left: 3px solid var(--color-main);
	}
	.accent {
		border-left: 3px solid var(--color-accent);
	}
	.error {
		border-left: 3px solid var(--color-error-main);
	}
	.success {
		border-left: 3px solid var(--color-success-main);
	}
	.warning {
		border-left: 3px solid var(--color-warn-main);
	}
</style>
