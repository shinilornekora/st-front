<template>
	<span :class="$style.error">
		<slot />
	</span>
</template>

<script setup lang="ts">
	import theme from './theme.module.css';
</script>

<style module>
	@import './theme.module.css';
	.error {
		color: var(--color-error-main);
		font-size: 13px;
		margin-top: 2px;
		display: inline-block;
	}
</style>
