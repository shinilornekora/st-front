<template>
	<textarea
		:value="modelValue"
		:class="[$style.textarea, error && $style.error]"
		:disabled="disabled"
		:required="required"
		:rows="rows"
		:placeholder="placeholder"
		:aria-invalid="Boolean(error)"
		:aria-required="required"
		@input="
			$emit(
				'update:modelValue',
				($event.target as HTMLTextAreaElement)?.value,
			)
		"
	/>
</template>

<script setup lang="ts">
	defineProps<{
		modelValue?: string;
		disabled?: boolean;
		placeholder?: string;
		error?: boolean;
		required?: boolean;
		rows?: number;
	}>();
</script>

<style module>
	@import './theme.module.css';
	.textarea {
		min-height: 80px;
		padding: 8px 12px;
		background: var(--background-default);
		border: 1px solid var(--color-secondary);
		border-radius: 4px;
		font-size: 16px;
		color: var(--color-primary);
		transition: border-color 0.14s;
		outline: none;
		resize: vertical;
	}
	.textarea:focus {
		border-color: var(--color-focus);
	}
	.textarea.error {
		border-color: var(--color-error-main);
	}
</style>
