<template>
	<label :class="$style.switchWrap">
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			:aria-checked="modelValue"
			:aria-required="required"
			:class="$style.switch"
			@change="
				$emit(
					'update:modelValue',
					($event.target as HTMLInputElement)?.checked,
				)
			"
		/>
		<span :class="$style.slider" />
		<span v-if="label" :class="$style.label">{{ label }}</span>
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
	.switchWrap {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.switch {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: relative;
		width: 38px;
		height: 22px;
		background: var(--color-secondary);
		border-radius: 12px;
		transition: background 0.2s;
		cursor: pointer;
		display: inline-block;
	}
	.switch:checked + .slider {
		background: var(--color-accent);
	}
	.slider:before {
		content: '';
		position: absolute;
		left: 3px;
		top: 3px;
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: var(--background-default);
		transition: 0.2s;
	}
	.switch:checked + .slider:before {
		transform: translateX(16px);
	}
	.label {
		font-size: 14px;
		color: var(--color-primary);
	}
</style>
