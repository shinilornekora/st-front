<template>
	<button
		:type="typeAttr"
		:class="[
			$style.btn,
			$style[`btn--${type}`],
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
	// Не импортируем defineProps/defineEmits вручную, они доступны в <script setup>
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
				| 'warning',
			default: 'main',
		},
		disabled: Boolean,
		primary: Boolean,
		size: { type: String as () => 's' | 'm' | 'l', default: 'm' },
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
		border-radius: 4px;
		border: none;
		cursor: pointer;
		background: var(--color-main);
		color: var(--color-disabled-primary);
		font-size: 16px;
		transition:
			background 0.2s,
			box-shadow 0.15s;
		font-weight: 500;
		box-shadow: 0 1px 5px #0001;
	}
	.primary {
		font-weight: 700;
	}
	.btn--main {
		background: var(--color-main);
		color: var(--color-disabled-primary);
	}
	.btn--accent {
		background: var(--color-accent);
		color: var(--color-primary);
	}
	.btn--secondary {
		background: var(--color-secondary);
		color: var(--color-disabled-primary);
	}
	.btn--error {
		background: var(--color-error-main);
		color: #fff;
	}
	.btn--success {
		background: var(--color-success-main);
		color: #fff;
	}
	.btn--warning {
		background: var(--color-warn-main);
		color: #fff;
	}
	.btn--s {
		font-size: 13px;
		padding: 4px 10px;
		border-radius: 5px;
	}
	.btn--m {
		font-size: 16px;
		padding: 8px 16px;
	}
	.btn--l {
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
