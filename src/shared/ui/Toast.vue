<template>
	<div :class="$style.toasts" role="status" aria-live="polite">
		<div
			v-for="item in toasts"
			:key="item.id"
			:class="[$style.toast, $style[item.type]]"
		>
			{{ item.text }}
			<button
				:class="$style.close"
				@click="remove(item.id)"
				aria-label="Скрыть"
			>
				×
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const props = defineProps<{
		initial?: { id: number; text: string; type?: string }[];
	}>();
	const toasts = ref(props.initial || []);
	function remove(id: number) {
		toasts.value = toasts.value.filter((t) => t.id !== id);
	}
</script>
<style module>
	@import './theme.module.css';
	.toasts {
		position: fixed;
		top: 24px;
		right: 22px;
		z-index: 1024;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 220px;
		align-items: flex-end;
	}
	.toast {
		background: var(--color-disabled-primary);
		border-left: 7px solid var(--color-main);
		box-shadow: 0 2px 12px #0001;
		border-radius: 8px;
		padding: 11px 34px 11px 17px;
		position: relative;
		min-width: 180px;
		max-width: 300px;
	}
	.toast.error {
		border-color: var(--color-error-main);
	}
	.toast.success {
		border-color: var(--color-success-main);
	}
	.toast.warning {
		border-color: var(--color-warn-main);
	}
	.close {
		position: absolute;
		top: 6px;
		right: 9px;
		color: var(--color-secondary);
		font-size: 17px;
		background: transparent;
		border: none;
		cursor: pointer;
	}
</style>
