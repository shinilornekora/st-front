<template>
	<input
		:type="type"
		:placeholder="placeholder"
		:value="modelValue"
		@input="
			$emit(
				'update:modelValue',
				($event.target as HTMLInputElement)?.value,
			)
		"
		:class="$style.uiInput"
		:disabled="disabled"
		:aria-invalid="Boolean(error)"
		:aria-required="required"
		autocomplete="off"
	/>
</template>

<script setup lang="ts">
	defineProps<{
		modelValue: string;
		type?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
	}>();
</script>

<style module>
	@import './theme.module.css';
	.uiInput {
		padding: 8px 12px;
		background: #fff;
		border: 1px solid var(--color-secondary);
		border-radius: 4px;
		font-size: 16px;
		color: var(--color-primary);
		outline: none;
		transition: border-color 0.16s;
	}
	.uiInput:focus {
		border-color: var(--color-focus);
	}
	.uiInput[aria-invalid='true'] {
		border-color: var(--color-error-main);
	}
	.uiInput:disabled {
		background: var(--color-disabled-primary);
		color: var(--color-disabled-secondary);
	}
</style>
