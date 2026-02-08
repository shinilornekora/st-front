<template>
	<div
		:class="$style.dropdown"
		tabindex="0"
		@blur="open = false"
		@keydown.esc="open = false"
	>
		<button
			:class="$style.toggle"
			@click="open = !open"
			:aria-expanded="open"
		>
			<slot name="button">Menu</slot>
		</button>
		<div v-if="open" :class="$style.menu" role="menu">
			<slot name="menu" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const open = ref(false);
</script>

<style module>
	@import './theme.module.css';
	.dropdown {
		position: relative;
		display: inline-block;
	}
	.toggle {
		background: var(--color-main);
		color: var(--background-default);
		border: none;
		padding: 7px 14px;
		cursor: pointer;
		border-radius: 4px;
	}
	.menu {
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 130px;
		z-index: 10;
		background: var(--background-default);
		border: 1px solid var(--color-secondary);
		border-radius: 3px;
		box-shadow: 0 2px 8px #0002;
		padding: 5px 0;
	}
</style>
