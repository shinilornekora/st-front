<template>
	<button
		:class="$style.burger"
		@click="$emit('click')"
		aria-label="Открыть меню"
		type="button"
	>
		<span
			v-for="i in 3"
			:key="i"
			:class="$style.line"
			aria-hidden="true"
		></span>
	</button>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
</script>
<style module>
	@import './theme.module.css';
	.burger {
		width: 36px;
		height: 36px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
	}
	.line {
		display: block;
		width: 26px;
		height: 3px;
		background: var(--color-primary);
		border-radius: 2px;
		transition: 0.2s;
	}
</style>
