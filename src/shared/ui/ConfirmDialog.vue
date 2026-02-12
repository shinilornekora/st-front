<template>
	<div :class="$style.overlay" role="dialog" aria-modal="true">
		<div :class="[$style.dialog, type ? $style[type] : '']">
			<div :class="$style.text"><slot /></div>
			<footer :class="$style.actions">
				<button :class="$style.btn" @click="$emit('confirm')">
					{{ t('common.yes') }}
				</button>
				<button :class="$style.btn" @click="$emit('cancel')">
					{{ t('common.no') }}
				</button>
			</footer>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { useI18n } from 'vue-i18n';

	const { t } = useI18n();

	defineProps<{
		type?: 'main' | 'accent' | 'success' | 'warning' | 'error';
	}>();

	defineEmits<{
		confirm: [];
		cancel: [];
	}>();
</script>
<style module>
	@import './theme.module.css';
	.overlay {
		position: fixed;
		inset: 0;
		background: #0006;
		z-index: 10002;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dialog {
		background: var(--background-default);
		padding: 26px 18px 17px;
		border-radius: 11px;
		box-shadow: 0 2px 24px #0003;
		min-width: 224px;
		max-width: 88vw;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.text {
		font-size: 15px;
	}
	.actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}
	.btn {
		border: none;
		background: var(--color-main);
		color: var(--background-default);
		border-radius: 6px;
		padding: 4px 19px;
		font-size: 15px;
		cursor: pointer;
	}
	.accent .btn {
		background: var(--color-accent);
	}
	.success .btn {
		background: var(--color-success-main);
	}
	.warning .btn {
		background: var(--color-warn-main);
	}
	.error .btn {
		background: var(--color-error-main);
	}
</style>
