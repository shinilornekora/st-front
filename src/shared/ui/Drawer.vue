<template>
	<div
		v-if="open"
		:class="$style.backdrop"
		@click.self="close"
		role="dialog"
		aria-modal="true"
	>
		<aside :class="$style.drawer">
			<button
				:class="$style.close"
				@click="close"
				:aria-label="t('common.close')"
			>
				×
			</button>
			<slot />
		</aside>
	</div>
</template>
<script setup lang="ts">
	import { useI18n } from 'vue-i18n';
	import theme from './theme.module.css';

	const { t } = useI18n();
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
		background: #0004;
		z-index: 300;
	}
	.drawer {
		position: fixed;
		right: 0;
		top: 0;
		height: 100%;
		width: 415px;
		max-width: 96vw;
		background: var(--background-default);
		box-shadow: -3px 0 14px #0002;
		overflow: auto;
		padding: 30px 16px 22px;
		border-radius: 12px 0 0 12px;
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
