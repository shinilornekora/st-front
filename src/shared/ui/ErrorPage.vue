<template>
	<section :class="[$style.page, $style[type]]" role="alert">
		<h1 :class="$style.title"><slot name="title">Ошибка</slot></h1>
		<p :class="$style.desc">
			<slot name="desc">Что-то пошло не так.</slot>
		</p>
		<button v-if="cta" :class="$style.cta" @click="$emit('cta')">
			<slot name="cta">{{ cta }}</slot>
		</button>
	</section>
</template>
<script setup lang="ts">
	import theme from './theme.module.css';
	defineProps<{
		type?:
			| '404'
			| '500'
			| 'network'
			| 'main'
			| 'accent'
			| 'error'
			| 'success'
			| 'warning';
		cta?: string;
	}>();
</script>
<style module>
	@import './theme.module.css';
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		min-height: 75vh;
		justify-content: center;
		padding: 34px 5vw;
		background: var(--color-disabled-primary);
	}
	.title {
		font-size: 39px;
		color: var(--color-error-main);
		font-weight: 900;
		margin: 18px 0 3px;
	}
	.desc {
		font-size: 18px;
		color: var(--color-secondary);
		margin: 0 0 8px;
	}
	.cta {
		margin-top: 13px;
		background: var(--color-accent);
		color: #fff;
		padding: 8px 23px;
		border-radius: 8px;
		border: none;
		font-size: 18px;
		cursor: pointer;
	}
</style>
