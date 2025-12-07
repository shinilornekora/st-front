<template>
	<section :class="[$style.card, $style[type]]" role="region">
		<slot />
	</section>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		type?:
			| 'main'
			| 'secondary'
			| 'accent'
			| 'success'
			| 'warning'
			| 'error';
	}>();
</script>
<style module>
	@import './theme.module.css';
	.card {
		background: #fff;
		border-radius: 14px;
		box-shadow: 0 2px 12px #0001;
		padding: 18px 22px;
		transition: 0.15s;
	}
	.main {
		border: 2px solid var(--color-main);
	}
	.secondary {
		border: 2px solid var(--color-secondary);
	}
	.accent {
		border: 2px solid var(--color-accent);
	}
	.success {
		border: 2px solid var(--color-success-main);
	}
	.warning {
		border: 2px solid var(--color-warn-main);
	}
	.error {
		border: 2px solid var(--color-error-main);
	}
</style>
