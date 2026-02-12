<template>
	<label
		:for="forId"
		:class="[$style.label, size && $style[`label--${size}`]]"
	>
		<slot />
		<span v-if="required" :class="$style.req">*</span>
	</label>
</template>

<script setup lang="ts">

	defineProps<{
		forId?: string;
		required?: boolean;
		size?: 's' | 'm' | 'l';
	}>();
</script>

<style module>
	@import './theme.module.css';
	.label {
		font-size: 15px;
		color: var(--color-primary);
		margin-bottom: 3px;
	}
	.label--s {
		font-size: 13px;
	}
	.label--m {
		font-size: 15px;
	}
	.label--l {
		font-size: 17px;
	}
	.req {
		color: var(--color-error-main);
		margin-left: 3px;
		font-weight: bold;
	}
</style>
