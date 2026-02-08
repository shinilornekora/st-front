<template>
	<div
		:class="$style.root"
		@mouseenter="show = true"
		@mouseleave="show = false"
	>
		<span @click="show = !show"><slot name="trigger" /></span>
		<div v-if="show" :class="$style.popover" role="dialog" tabindex="-1">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const show = ref(false);
</script>

<style module>
	@import './theme.module.css';
	.root {
		display: inline-block;
		position: relative;
	}
	.popover {
		position: absolute;
		left: 0;
		top: calc(100% + 8px);
		background: var(--background-default);
		border: 1px solid var(--color-secondary);
		border-radius: 6px;
		box-shadow: 0 2px 12px #0003;
		min-width: 150px;
		z-index: 100;
		padding: 12px;
	}
</style>
