<template>
	<form
		:class="[$style.form, $style[type]]"
		@submit.prevent="$emit('submit', value)"
		role="search"
	>
		<input
			:class="$style.input"
			v-model="value"
			:placeholder="placeholder"
			aria-label="Поиск"
		/>
		<button :class="$style.btn" type="submit" aria-label="Найти">
			<slot name="icon">🔍</slot>
		</button>
	</form>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	defineProps<{ placeholder?: string; type?: 'main' | 'accent' }>();
	const value = ref('');
</script>
<style module>
	@import './theme.module.css';
	.form {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--color-hover);
		border-radius: 6px;
		padding: 3px 9px;
	}
	.main {
		background: var(--color-main);
	}
	.accent {
		background: var(--color-accent);
	}
	.input {
		border: none;
		background: none;
		outline: none;
		font-size: 16px;
		padding: 4px 5px 4px 0;
		flex: 1;
		color: var(--color-primary);
	}
	.btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 20px;
		color: var(--color-secondary);
	}
</style>
