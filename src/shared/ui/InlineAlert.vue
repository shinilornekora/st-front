<template>
	<div :class="[$style.alert, $style[type]]" :role="role">
		<slot name="icon">
			<span :class="$style.icon"></span>
		</slot>
		<span :class="$style.text"><slot /></span>
	</div>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	const props = defineProps<{
		type?: 'info' | 'success' | 'warning' | 'error';
	}>();
	const role = props.type === 'error' ? 'alert' : 'status';
</script>
<style module>
	@import './theme.module.css';
	.alert {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 9px 13px;
		margin: 8px 0;
		border-radius: 6px;
		font-size: 14px;
		background: var(--color-hover);
	}
	.info {
		border-left: 5px solid var(--color-main);
	}
	.success {
		border-left: 5px solid var(--color-success-main);
	}
	.warning {
		border-left: 5px solid var(--color-warn-main);
	}
	.error {
		border-left: 5px solid var(--color-error-main);
		background: var(--color-error-light);
	}
	.icon {
		width: 18px;
		height: 20px;
		background: var(--color-secondary);
		border-radius: 3px;
		margin-right: 3px;
		display: inline-block;
	}
	.text {
		flex: 1;
	}
</style>
