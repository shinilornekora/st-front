<template>
	<nav
		:class="[$style.bar, type ? $style[type] : '']"
		:aria-label="t('ui.actionPanel')"
	>
		<button
			v-if="showAdd"
			:class="$style.btn"
			:aria-label="t('common.add')"
			@click="$emit('add')"
		>
			➕
		</button>
		<button
			v-if="showEdit"
			:class="$style.btn"
			:aria-label="t('common.edit')"
			@click="$emit('edit')"
		>
			✏️
		</button>
		<button
			v-if="showDelete"
			:class="$style.btn"
			:aria-label="t('common.delete')"
			@click="$emit('delete')"
		>
			🗑️
		</button>
		<slot />
	</nav>
</template>
<script setup lang="ts">
	import { useI18n } from 'vue-i18n';
	import theme from './theme.module.css';

	const { t } = useI18n();
	defineProps<{
		showAdd?: boolean;
		showEdit?: boolean;
		showDelete?: boolean;
		type?: 'main' | 'accent' | 'success' | 'error' | 'warning';
	}>();

	defineEmits<{
		add: [];
		edit: [];
		delete: [];
	}>();
</script>
<style module>
	@import './theme.module.css';
	.bar {
		display: flex;
		gap: 11px;
		align-items: center;
		background: var(--color-hover);
		border-radius: 7px;
		padding: 7px 14px;
	}
	.btn {
		background: none;
		border: none;
		font-size: 17px;
		cursor: pointer;
		color: var(--color-main);
		transition: 0.15s;
	}
	.main .btn {
		color: var(--color-main);
	}
	.accent .btn {
		color: var(--color-accent);
	}
	.success .btn {
		color: var(--color-success-main);
	}
	.error .btn {
		color: var(--color-error-main);
	}
	.warning .btn {
		color: var(--color-warn-main);
	}
</style>
