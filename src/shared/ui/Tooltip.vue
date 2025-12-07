<template>
	<span
		:class="$style.wrap"
		@mouseenter="show = true"
		@mouseleave="show = false"
	>
		<slot />
		<span v-if="show" :class="$style.tooltip" role="tooltip">{{
			text
		}}</span>
	</span>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const show = ref(false);
	defineProps<{ text: string }>();
</script>

<style module>
	@import './theme.module.css';
	.wrap {
		position: relative;
		display: inline-block;
	}
	.tooltip {
		position: absolute;
		left: 50%;
		bottom: 120%;
		transform: translateX(-50%);
		padding: 6px 14px;
		color: #fff;
		background: var(--color-dark);
		border-radius: 5px;
		font-size: 13px;
		white-space: nowrap;
		z-index: 20;
		box-shadow: 0 1px 8px #0002;
	}
</style>
