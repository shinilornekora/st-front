<template>
	<span :class="$style.wrap">
		<button
			v-if="showEdit"
			:class="[$style.btn, $style.edit, $style[type]]"
			@click="$emit('edit')"
			aria-label="Редактировать"
		>
			✏️
		</button>
		<button
			v-if="showDelete"
			:class="[$style.btn, $style.delete, $style[type]]"
			@click="$emit('delete')"
			aria-label="Удалить"
		>
			🗑️
		</button>
	</span>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		showEdit?: boolean;
		showDelete?: boolean;
		type?: 'main' | 'accent' | 'success' | 'error' | 'warning';
	}>();
</script>
<style module>
	@import './theme.module.css';
	.wrap {
		display: inline-flex;
		gap: 7px;
	}
	.btn {
		background: none;
		border: none;
		font-size: 17px;
		cursor: pointer;
		padding: 2px;
	}
	.edit {
		color: var(--color-main);
	}
	.delete {
		color: var(--color-error-main);
	}
	.success {
		color: var(--color-success-main);
	}
	.warning {
		color: var(--color-warn-main);
	}
</style>
