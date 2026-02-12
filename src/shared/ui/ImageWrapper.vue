<template>
	<figure
		:class="[$style.wrapper, type && $style[type]]"
		:data-ratio="ratio"
		role="figure"
	>
		<img
			v-if="src && !error"
			:src="src"
			:alt="alt"
			:class="$style.img"
			@error="onError"
		/>
		<div v-else-if="type === 'error'" :class="$style.fallback">
			{{ t('ui.loadingError') }}
		</div>
		<div v-else-if="type === 'loading'" :class="$style.fallback">
			{{ t('common.loading') }}
		</div>
		<slot v-else />
		<figcaption v-if="caption" :class="$style.caption">
			{{ caption }}
		</figcaption>
	</figure>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import { useI18n } from 'vue-i18n';

	const { t } = useI18n();

	defineProps<{
		src?: string;
		alt?: string;
		caption?: string;
		ratio?: '1x1' | '3x4';
		type?: 'default' | 'error' | 'loading';
	}>();
	const error = ref(false);
	function onError() {
		error.value = true;
	}
</script>
<style module>
	@import './theme.module.css';
	.wrapper {
		display: inline-block;
		position: relative;
		overflow: hidden;
	}
	.wrapper[data-ratio='1x1'] {
		aspect-ratio: 1/1;
		width: 120px;
		height: 120px;
	}
	.wrapper[data-ratio='3x4'] {
		aspect-ratio: 3/4;
		width: 90px;
		height: 120px;
	}
	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: var(--color-secondary);
		background: var(--color-disabled-primary);
	}
	.caption {
		font-size: 12px;
		text-align: center;
		color: var(--color-secondary);
		margin-top: 2px;
	}
</style>
