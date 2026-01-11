<template>
	<div :class="[$style.inputWrapper, { [$style.hasPrefix]: prefix, [$style.hasSuffix]: suffix || showPasswordToggle }]">
		<span v-if="prefix" :class="$style.prefix">{{ prefix }}</span>
		<slot name="prefix"></slot>
		
		<input
			:type="computedType"
			:placeholder="placeholder"
			:value="modelValue"
			@input="
				$emit(
					'update:modelValue',
					($event.target as HTMLInputElement)?.value,
				)
			"
			:class="[
				$style.uiInput,
				$style[`uiInput--${variant}`],
				{ [$style['uiInput--error']]: error },
				{ [$style['uiInput--disabled']]: disabled }
			]"
			:disabled="disabled"
			:aria-invalid="Boolean(error)"
			:aria-required="required"
			autocomplete="off"
		/>
		
		<button
			v-if="showPasswordToggle"
			type="button"
			:class="$style.suffix"
			@click="togglePasswordVisibility"
			tabindex="-1"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path v-if="passwordVisible" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
				<circle v-if="passwordVisible" cx="12" cy="12" r="3"></circle>
				<path v-if="!passwordVisible" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
				<line v-if="!passwordVisible" x1="1" y1="1" x2="23" y2="23"></line>
			</svg>
		</button>
		
		<span v-else-if="suffix" :class="$style.suffix">{{ suffix }}</span>
		<slot name="suffix"></slot>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	
	const props = defineProps<{
		modelValue: string;
		type?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		required?: boolean;
		variant?: 'default' | 'accent' | 'error' | 'disabled';
		prefix?: string;
		suffix?: string;
		showPasswordToggle?: boolean;
	}>();
	
	const passwordVisible = ref(false);
	
	const computedType = computed(() => {
		if (props.type === 'password' && props.showPasswordToggle) {
			return passwordVisible.value ? 'text' : 'password';
		}
		return props.type || 'text';
	});
	
	const togglePasswordVisibility = () => {
		passwordVisible.value = !passwordVisible.value;
	};
</script>

<style module>
	@import './theme.module.css';
	
	.inputWrapper {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 100%;
	}
	
	.uiInput {
		width: 100%;
		padding: 12px 16px;
		background: #fff;
		border: 2px solid var(--color-secondary);
		border-radius: 24px;
		font-size: 16px;
		color: var(--color-primary);
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s,
			background 0.2s;
		box-sizing: border-box;
	}
	
	.hasPrefix .uiInput {
		padding-left: 48px;
	}
	
	.hasSuffix .uiInput {
		padding-right: 48px;
	}
	
	.prefix,
	.suffix {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent);
		font-size: 16px;
		pointer-events: none;
		z-index: 1;
	}
	
	.prefix {
		left: 16px;
	}
	
	.suffix {
		right: 16px;
		pointer-events: auto;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		color: var(--color-accent);
		transition: color 0.2s;
	}
	
	.suffix:hover {
		color: var(--color-focus);
	}
	
	/* Default variant */
	.uiInput--default {
		border-color: var(--color-secondary);
	}
	
	.uiInput--default:hover:not(:disabled) {
		border-color: #9ca3af;
	}
	
	.uiInput--default:focus {
		border-color: var(--color-secondary);
		box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
	}
	
	/* Accent variant */
	.uiInput--accent {
		border-color: var(--color-accent);
	}
	
	.uiInput--accent:hover:not(:disabled) {
		border-color: var(--color-focus);
	}
	
	.uiInput--accent:focus {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(95, 219, 209, 0.2);
	}
	
	/* Error variant */
	.uiInput--error,
	.uiInput[aria-invalid='true'] {
		border-color: var(--color-error-main);
	}
	
	.uiInput--error:hover:not(:disabled),
	.uiInput[aria-invalid='true']:hover:not(:disabled) {
		border-color: var(--color-error-dark);
	}
	
	.uiInput--error:focus,
	.uiInput[aria-invalid='true']:focus {
		border-color: var(--color-error-main);
		box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
	}
	
	/* Disabled variant */
	.uiInput--disabled,
	.uiInput:disabled {
		background: var(--color-disabled-secondary);
		color: var(--color-disabled-ghost);
		border-color: var(--color-disabled-secondary);
		cursor: not-allowed;
		opacity: 0.6;
	}
	
	.uiInput:disabled + .suffix {
		color: var(--color-disabled-ghost);
		cursor: not-allowed;
	}
	
	/* Placeholder styling */
	.uiInput::placeholder {
		color: #9ca3af;
		opacity: 1;
	}
	
	.uiInput:disabled::placeholder {
		color: var(--color-disabled-ghost);
	}
</style>
