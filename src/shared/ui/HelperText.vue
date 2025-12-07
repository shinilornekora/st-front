<template>
	<p
		:class="[
			$style.helper,
			error ? $style.error : '',
			warning ? $style.warn : '',
		]"
	>
		<slot />
	</p>
</template>

<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{ error?: boolean; warning?: boolean }>();
</script>

<style module>
	@import './theme.module.css';
	.helper {
		font-size: 12px;
		color: var(--color-secondary);
		margin: 3px 0 0;
	}
	.error {
		color: var(--color-error-main);
	}
	.warn {
		color: var(--color-warn-main);
	}
</style>
