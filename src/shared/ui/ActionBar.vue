<template>
	<nav :class="[$style.bar, $style[type]]" aria-label="Панель действий">
		<button
			v-if="showAdd"
			:class="$style.btn"
			@click="$emit('add')"
			aria-label="Добавить"
		>
			➕
		</button>
		<button
			v-if="showEdit"
			:class="$style.btn"
			@click="$emit('edit')"
			aria-label="Редактировать"
		>
			✏️
		</button>
		<button
			v-if="showDelete"
			:class="$style.btn"
			@click="$emit('delete')"
			aria-label="Удалить"
		>
			🗑️
		</button>
		<slot />
	</nav>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		showAdd?: boolean;
		showEdit?: boolean;
		showDelete?: boolean;
		type?: 'main' | 'accent' | 'success' | 'error' | 'warning';
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
