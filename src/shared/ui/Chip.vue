<template>
	<span
		:class="[$style.chip, { [$style.removable]: removable }]"
		role="status"
	>
		<slot />
		<button
			v-if="removable"
			:class="$style.close"
			:aria-label="t('common.delete')"
			@click="$emit('remove')"
		>
			×
		</button>
	</span>
</template>
<script setup lang="ts">
	import { useI18n } from 'vue-i18n';

	const { t } = useI18n();
	defineProps<{ removable?: boolean }>();

	defineEmits<{
		remove: [];
	}>();
</script>
<style module>
	@import './theme.module.css';
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 2px 11px;
		border-radius: 18px;
		font-size: 13px;
		background: var(--color-hover);
		color: var(--color-primary);
		margin: 2px 2px;
	}
	.removable .close {
		margin-left: 4px;
		background: none;
		border: none;
		font-size: 16px;
		cursor: pointer;
		line-height: 1;
		color: var(--color-secondary);
	}
</style>
