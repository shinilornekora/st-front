<template>
	<label :class="$style.checkboxWrapper">
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			:aria-checked="modelValue"
			:aria-required="required"
			:class="$style.checkbox"
			@change="
				$emit(
					'update:modelValue',
					($event.target as HTMLInputElement)?.checked,
				)
			"
		/>
		<span :class="$style.label">{{ label }}</span>
	</label>
</template>

<script setup lang="ts">
	defineProps<{
		modelValue: boolean;
		label?: string;
		disabled?: boolean;
		required?: boolean;
	}>();
</script>

<style module>
	@import './theme.module.css';
	.checkboxWrapper {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.checkbox {
		width: 18px;
		height: 18px;
		accent-color: var(--color-accent);
	}
	.label {
		font-size: 14px;
		color: var(--color-primary);
	}
</style>
