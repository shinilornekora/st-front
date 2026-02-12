<template>
	<div :class="$style.tabs" role="tablist">
		<button
			v-for="tab in tabs"
			:key="tab.value"
			:class="[$style.tab, active === tab.value && $style.active]"
			role="tab"
			:aria-selected="active === tab.value"
			:tabindex="active === tab.value ? 0 : -1"
			@click="$emit('update:active', tab.value)"
		>
			{{ tab.label }}
		</button>
	</div>
</template>

<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{ tabs: { label: string; value: string }[]; active: string }>();

	defineEmits<{
		'update:active': [value: string];
	}>();
</script>

<style module>
	@import './theme.module.css';
	.tabs {
		display: flex;
		gap: 8px;
		border-bottom: 1px solid var(--color-secondary);
	}
	.tab {
		background: none;
		border: none;
		padding: 5px 16px;
		font-size: 15px;
		color: var(--color-secondary);
		cursor: pointer;
		border-radius: 6px 6px 0 0;
		outline: none;
		transition: color 0.12s;
	}
	.tab.active {
		color: var(--color-main);
		background: var(--color-hover);
		border: 1px solid var(--color-main);
		border-bottom: none;
	}
</style>
