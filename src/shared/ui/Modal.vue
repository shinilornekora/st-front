<template>
	<div
		v-if="open"
		:class="$style.backdrop"
		@click.self="close"
		role="dialog"
		aria-modal="true"
	>
		<div :class="$style.dialog" tabindex="-1">
			<button :class="$style.close" @click="close" aria-label="Закрыть">
				×
			</button>
			<slot />
		</div>
	</div>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	const props = defineProps<{ open: boolean }>();
	const emit = defineEmits(['close']);
	function close() {
		emit('close');
	}
</script>
<style module>
	@import './theme.module.css';
	.backdrop {
		position: fixed;
		inset: 0;
		background: #0006;
		z-index: 300;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dialog {
		background: #fff;
		min-width: 320px;
		max-width: 90vw;
		padding: 30px 20px 22px;
		border-radius: 10px;
		position: relative;
		box-shadow: 0 8px 32px #0005;
	}
	.close {
		position: absolute;
		top: 13px;
		right: 15px;
		font-size: 22px;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-secondary);
	}
</style>
