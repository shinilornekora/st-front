<template>
	<a
		:href="href"
		:class="[$style.link, { [$style.inline]: inline }, $attrs.class]"
		:tabindex="tabindex"
		:aria-label="ariaLabel || undefined"
		:target="target"
		rel="noopener noreferrer"
		@click="onClick"
		><slot
	/></a>
</template>

<script setup lang="ts">
	import { defineProps, useAttrs } from 'vue';
	import theme from './theme.module.css';

	defineProps<{
		href?: string;
		inline?: boolean;
		tabindex?: number;
		ariaLabel?: string;
		target?: '_blank' | '_self' | '_parent' | '_top';
	}>();
	const $attrs = useAttrs();
	const onClick = ($event: MouseEvent) => {
		// Можно прокинуть кастомное поведение
	};
</script>

<style module>
	@import './theme.module.css';
	.link {
		color: var(--color-main);
		text-decoration: underline;
		font-size: 15px;
		cursor: pointer;
		transition: color 0.14s;
	}
	.link.inline {
		text-decoration: underline dotted;
		vertical-align: baseline;
	}
	.link:focus {
		outline: 2px solid var(--color-focus);
	}
</style>
