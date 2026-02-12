<template>
	<label :class="$style.rangeSliderWrap">
		<input
			type="range"
			:min="min"
			:max="max"
			:step="step"
			:value="modelValue"
			:disabled="disabled"
			:aria-valuemin="min"
			:aria-valuemax="max"
			:aria-valuenow="modelValue"
			:class="$style.rangeSlider"
			@input="
				$emit(
					'update:modelValue',
					Number(($event.target as HTMLInputElement)?.value),
				)
			"
		/>
		<span v-if="label" :class="$style.label">{{ label }}</span>
	</label>
</template>

<script setup lang="ts">
	defineProps<{
		modelValue: number;
		min?: number;
		max?: number;
		step?: number;
		label?: string;
		disabled?: boolean;
	}>();
</script>

<style module>
	@import './theme.module.css';
	.rangeSliderWrap {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.rangeSlider {
		width: 120px;
		accent-color: var(--color-accent);
	}
	.label {
		font-size: 14px;
		color: var(--color-secondary);
	}
</style>
