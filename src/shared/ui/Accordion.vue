<template>
	<section :class="$style.accordion">
		<button
			:id="headerId"
			:class="$style.header"
			:aria-expanded="expanded"
			:aria-controls="panelId"
			type="button"
			@click="expanded = !expanded"
		>
			<slot name="header" />
		</button>
		<div
			v-show="expanded"
			:id="panelId"
			:class="$style.panel"
			:aria-labelledby="headerId"
			role="region"
		>
			<slot name="panel" />
		</div>
	</section>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const expanded = ref(false);
	const headerId = `acc-head-${Math.random().toString(36).slice(2, 7)}`;
	const panelId = `acc-panel-${Math.random().toString(36).slice(2, 7)}`;
</script>

<style module>
	@import './theme.module.css';
	.accordion {
		border: 1px solid var(--color-secondary);
		border-radius: 6px;
		margin-bottom: 8px;
	}
	.header {
		background: var(--color-hover);
		padding: 10px 18px;
		font-size: 15px;
		font-weight: 500;
		border: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
		outline: none;
		border-radius: 6px 6px 0 0;
	}
	.panel {
		padding: 10px 18px;
	}
</style>
