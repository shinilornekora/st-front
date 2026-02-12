<template>
	<label :class="$style.radioWrapper">
		<input
			type="radio"
			:name="name"
			:checked="modelValue === value"
			:disabled="disabled"
			:aria-checked="modelValue === value"
			:aria-required="required"
			:class="$style.radio"
			@change="$emit('update:modelValue', value)"
		/>
		<span :class="$style.label">{{ label }}</span>
	</label>
</template>

<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		modelValue: string | number;
		value: string | number;
		label?: string;
		name?: string;
		disabled?: boolean;
		required?: boolean;
	}>();

	defineEmits<{
		'update:modelValue': [value: string | number];
	}>();
</script>

<style module>
	@import './theme.module.css';
	.radioWrapper {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.radio {
		width: 18px;
		height: 18px;
		accent-color: var(--color-accent);
		border-radius: 50%;
	}
	.label {
		font-size: 14px;
		color: var(--color-primary);
	}
</style>
