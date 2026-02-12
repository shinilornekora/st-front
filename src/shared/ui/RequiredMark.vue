<template>
	<span :class="$style.req">*</span>
</template>

<script setup lang="ts">
</script>

<style module>
	@import './theme.module.css';
	.req {
		color: var(--color-error-main);
		margin-left: 3px;
		font-weight: bold;
	}
</style>
