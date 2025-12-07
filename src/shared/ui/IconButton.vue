<template>
	<button
		:type="type"
		:class="[
			$style.iconButton,
			$style[`iconButton--${size}`],
			accent ? $style['iconButton--accent'] : '',
			$attrs.class,
		]"
		@click="onClick"
		:disabled="disabled"
		:aria-label="ariaLabel || undefined"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
	import { defineProps, defineEmits, useAttrs } from 'vue';
	import theme from './theme.module.css';

	const props = defineProps({
		size: {
			type: String as () => '24' | '32',
			default: '24',
		},
		accent: Boolean,
		type: {
			type: String as () => 'button' | 'submit' | 'reset',
			default: 'button',
		},
		disabled: Boolean,
		ariaLabel: String,
	});
	const emit = defineEmits(['click']);
	const onClick = (e: MouseEvent) => {
		if (!props.disabled) emit('click', e);
	};
	const $attrs = useAttrs();
</script>

<style module>
	@import './theme.module.css';
	.iconButton {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		border-radius: 50%;
		cursor: pointer;
		padding: 0;
		transition: background 0.16s;
		outline: none;
	}
	.iconButton--24 {
		width: 24px;
		height: 24px;
	}
	.iconButton--32 {
		width: 32px;
		height: 32px;
	}
	.iconButton--accent {
		background: var(--color-accent);
		color: var(--color-primary);
	}
	.iconButton:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
