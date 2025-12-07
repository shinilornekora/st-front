<template>
	<label>
		<span v-if="label" :class="$style.selectLabel">{{ label }}</span>
		<select
			:class="[$style.select, error && $style.error]"
			:multiple="multiple"
			:disabled="disabled"
			:aria-invalid="Boolean(error)"
			:aria-required="required"
			@change="onChange"
		>
			<option
				v-if="placeholder && !multiple"
				value=""
				disabled
				selected
				hidden
			>
				{{ placeholder }}
			</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
				:selected="isSelected(option.value)"
			>
				{{ option.label }}
			</option>
		</select>
	</label>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';

	type Option = { value: string | number; label: string };
	const props = defineProps<{
		options: Option[];
		modelValue?: any;
		multiple?: boolean;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
	}>();
	const emit = defineEmits(['update:modelValue']);
	const isSelected = (val: any) =>
		props.multiple
			? (props.modelValue || []).includes(val)
			: props.modelValue === val;
	const onChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		let value: any = props.multiple
			? Array.from(target.selectedOptions).map((o) => o.value)
			: target.value;
		emit('update:modelValue', value);
	};
</script>

<style module>
	@import './theme.module.css';
	.select {
		min-width: 120px;
		padding: 7px 10px;
		border: 1px solid var(--color-secondary);
		border-radius: 4px;
		background: #fff;
		color: var(--color-primary);
		font-size: 15px;
		outline: none;
	}
	.select.error {
		border-color: var(--color-error-main);
	}
	.select:focus {
		border-color: var(--color-focus);
	}
	.selectLabel {
		display: block;
		font-size: 13px;
		color: var(--color-secondary);
		margin-bottom: 5px;
	}
</style>
