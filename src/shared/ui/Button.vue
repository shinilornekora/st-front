<template>
	<button
		:type="typeAttr"
		:class="[
			$style.btn,
			$style[`btn--${type}`],
			$style[`btn--${type}--${variant}`],
			$style[`btn--${size}`],
			{ [$style.primary]: primary },
			$attrs.class,
		]"
		@click="onClick"
		:disabled="disabled"
	>
		<slot>{{ label }}</slot>
	</button>
</template>

<script setup lang="ts">
	import { useAttrs } from 'vue';
	
	const props = defineProps({
		typeAttr: {
			type: String as () => 'button' | 'submit' | 'reset',
			default: 'button',
		},
		type: {
			type: String as () =>
				| 'main'
				| 'accent'
				| 'secondary'
				| 'error'
				| 'success'
				| 'warning'
				| 'ghost'
				| 'primary',
			default: 'main',
		},
		variant: {
			type: String as () => 'filled' | 'outlined' | 'text',
			default: 'filled',
		},
		disabled: Boolean,
		primary: Boolean,
		size: { type: String as () => 's' | 'm' | 'l' | 'small' | 'medium' | 'large', default: 'm' },
		label: String,
	});
	const emit = defineEmits(['click']);
	const $attrs = useAttrs();
	const onClick = (event: MouseEvent) => {
		if (!props.disabled) emit('click', event);
	};
</script>

<style module>
	@import './theme.module.css';
	.btn {
		padding: 8px 16px;
		border-radius: 8px;
		border: 2px solid transparent;
		cursor: pointer;
		font-size: 16px;
		transition:
			background 0.2s,
			border-color 0.2s,
			box-shadow 0.15s,
			transform 0.1s;
		font-weight: 500;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
	.btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
	.primary {
		font-weight: 700;
	}

	/* Main - Filled */
	.btn--main--filled {
		background: var(--color-main);
		color: var(--color-disabled-primary);
		border-color: var(--color-main);
	}
	.btn--main--filled:hover:not(:disabled) {
		background: var(--color-dark);
		border-color: var(--color-dark);
	}

	/* Main - Outlined */
	.btn--main--outlined {
		background: transparent;
		color: var(--color-main);
		border-color: var(--color-main);
		box-shadow: none;
	}
	.btn--main--outlined:hover:not(:disabled) {
		background: var(--color-hover);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* Main - Text */
	.btn--main--text {
		background: transparent;
		color: var(--color-main);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--main--text:hover:not(:disabled) {
		background: var(--color-hover);
	}

	/* Primary (alias for main) */
	.btn--primary--filled {
		background: var(--color-main);
		color: var(--color-disabled-primary);
		border-color: var(--color-main);
	}
	.btn--primary--filled:hover:not(:disabled) {
		background: var(--color-dark);
		border-color: var(--color-dark);
	}
	.btn--primary--outlined {
		background: transparent;
		color: var(--color-main);
		border-color: var(--color-main);
		box-shadow: none;
	}
	.btn--primary--outlined:hover:not(:disabled) {
		background: var(--color-hover);
	}
	.btn--primary--text {
		background: transparent;
		color: var(--color-main);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--primary--text:hover:not(:disabled) {
		background: var(--color-hover);
	}

	/* Accent - Filled */
	.btn--accent--filled {
		background: var(--color-accent);
		color: var(--color-primary);
		border-color: var(--color-accent);
	}
	.btn--accent--filled:hover:not(:disabled) {
		background: var(--color-focus);
		border-color: var(--color-focus);
	}

	/* Accent - Outlined */
	.btn--accent--outlined {
		background: transparent;
		color: var(--color-accent);
		border-color: var(--color-accent);
		box-shadow: none;
	}
	.btn--accent--outlined:hover:not(:disabled) {
		background: var(--color-hover);
	}

	/* Accent - Text */
	.btn--accent--text {
		background: transparent;
		color: var(--color-accent);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--accent--text:hover:not(:disabled) {
		background: var(--color-hover);
	}

	/* Secondary - Filled */
	.btn--secondary--filled {
		background: var(--color-secondary);
		color: var(--color-disabled-primary);
		border-color: var(--color-secondary);
	}
	.btn--secondary--filled:hover:not(:disabled) {
		background: #5a6169;
		border-color: #5a6169;
	}

	/* Secondary - Outlined */
	.btn--secondary--outlined {
		background: transparent;
		color: var(--color-secondary);
		border-color: var(--color-secondary);
		box-shadow: none;
	}
	.btn--secondary--outlined:hover:not(:disabled) {
		background: #f3f4f6;
	}

	/* Secondary - Text */
	.btn--secondary--text {
		background: transparent;
		color: var(--color-secondary);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--secondary--text:hover:not(:disabled) {
		background: #f3f4f6;
	}

	/* Ghost */
	.btn--ghost--filled,
	.btn--ghost--outlined,
	.btn--ghost--text {
		background: transparent;
		color: var(--color-primary);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--ghost--filled:hover:not(:disabled),
	.btn--ghost--outlined:hover:not(:disabled),
	.btn--ghost--text:hover:not(:disabled) {
		background: var(--color-hover);
	}

	/* Error - Filled */
	.btn--error--filled {
		background: var(--color-error-main);
		color: #fff;
		border-color: var(--color-error-main);
	}
	.btn--error--filled:hover:not(:disabled) {
		background: var(--color-error-dark);
		border-color: var(--color-error-dark);
	}

	/* Error - Outlined */
	.btn--error--outlined {
		background: transparent;
		color: var(--color-error-main);
		border-color: var(--color-error-main);
		box-shadow: none;
	}
	.btn--error--outlined:hover:not(:disabled) {
		background: #fef2f2;
	}

	/* Error - Text */
	.btn--error--text {
		background: transparent;
		color: var(--color-error-main);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--error--text:hover:not(:disabled) {
		background: #fef2f2;
	}

	/* Success - Filled */
	.btn--success--filled {
		background: var(--color-success-main);
		color: #fff;
		border-color: var(--color-success-main);
	}
	.btn--success--filled:hover:not(:disabled) {
		background: var(--color-success-dark);
		border-color: var(--color-success-dark);
	}

	/* Success - Outlined */
	.btn--success--outlined {
		background: transparent;
		color: var(--color-success-main);
		border-color: var(--color-success-main);
		box-shadow: none;
	}
	.btn--success--outlined:hover:not(:disabled) {
		background: #f0fdf4;
	}

	/* Success - Text */
	.btn--success--text {
		background: transparent;
		color: var(--color-success-main);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--success--text:hover:not(:disabled) {
		background: #f0fdf4;
	}

	/* Warning - Filled */
	.btn--warning--filled {
		background: var(--color-warn-main);
		color: #fff;
		border-color: var(--color-warn-main);
	}
	.btn--warning--filled:hover:not(:disabled) {
		background: var(--color-warn-dark);
		border-color: var(--color-warn-dark);
	}

	/* Warning - Outlined */
	.btn--warning--outlined {
		background: transparent;
		color: var(--color-warn-main);
		border-color: var(--color-warn-main);
		box-shadow: none;
	}
	.btn--warning--outlined:hover:not(:disabled) {
		background: #fff7ed;
	}

	/* Warning - Text */
	.btn--warning--text {
		background: transparent;
		color: var(--color-warn-main);
		border-color: transparent;
		box-shadow: none;
	}
	.btn--warning--text:hover:not(:disabled) {
		background: #fff7ed;
	}
	.btn--s,
	.btn--small {
		font-size: 13px;
		padding: 4px 10px;
		border-radius: 5px;
	}
	.btn--m,
	.btn--medium {
		font-size: 16px;
		padding: 8px 16px;
	}
	.btn--l,
	.btn--large {
		font-size: 19px;
		padding: 14px 25px;
		border-radius: 6px;
	}
	.btn:disabled,
	.btn[aria-disabled='true'] {
		background: var(--color-disabled-secondary);
		color: var(--color-disabled-ghost);
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
