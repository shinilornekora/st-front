<template>
	<div :class="$style.stepper">
		<button
			:class="$style.btn"
			@click="dec"
			:disabled="disabled || value <= min"
			aria-label="Уменьшить"
		>
			−
		</button>
		<input
			type="number"
			:value="value"
			@input="onInput"
			:min="min"
			:max="max"
			:class="$style.input"
			:disabled="disabled"
			aria-label="Количество"
		/>
		<button
			:class="$style.btn"
			@click="inc"
			:disabled="disabled || value >= max"
			aria-label="Увеличить"
		>
			+
		</button>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import theme from './theme.module.css';
	const props = defineProps<{
		modelValue: number;
		min?: number;
		max?: number;
		disabled?: boolean;
	}>();
	const emit = defineEmits(['update:modelValue']);
	const min = props.min ?? 1;
	const max = props.max ?? 999;
	const value = computed(() =>
		Number.isFinite(props.modelValue) ? props.modelValue : min,
	);
	const dec = () => {
		if (!props.disabled && value.value > min)
			emit('update:modelValue', value.value - 1);
	};
	const inc = () => {
		if (!props.disabled && value.value < max)
			emit('update:modelValue', value.value + 1);
	};
	const onInput = (e: Event) => {
		const v = Math.max(
			min,
			Math.min(Number((e.target as HTMLInputElement).value), max),
		);
		emit('update:modelValue', v);
	};
</script>

<style module>
	@import './theme.module.css';
	.stepper {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.input {
		width: 40px;
		text-align: center;
		font-size: 15px;
		border: 1px solid var(--color-secondary);
		border-radius: 3px;
	}
	.btn {
		width: 28px;
		height: 28px;
		border: none;
		background: var(--color-hover);
		color: var(--color-primary);
		font-size: 20px;
		cursor: pointer;
		border-radius: 50%;
		transition: background 0.14s;
	}
	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
