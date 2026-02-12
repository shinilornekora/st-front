<template>
	<section :class="[$style.card, type && $style[type]]" role="region">
		<div :class="$style.heartContainer">
			<IconButton
				size="24"
				aria-label="Toggle favorite"
				@click="toggleHeart"
			>
				<img
					:src="isFavorite ? darkHeartIcon : heartIcon"
					alt="Heart icon"
					:class="$style.heartIcon"
				/>
			</IconButton>
		</div>
		<slot />
	</section>
</template>
<script setup lang="ts">
	import { ref } from 'vue';
	import IconButton from './IconButton.vue';
	import heartIcon from '@assets/heart_icon.svg';
	import darkHeartIcon from '@assets/dark_heart_icon.svg';

	defineProps<{
		type?:
			| 'main'
			| 'secondary'
			| 'accent'
			| 'success'
			| 'warning'
			| 'error';
	}>();

	const isFavorite = ref(false);
	const toggleHeart = () => {
		isFavorite.value = !isFavorite.value;
	};
</script>
<style module>
	@import './theme.module.css';
	.card {
		background: var(--background-default);
		border-radius: 14px;
		box-shadow: 0 2px 12px #0001;
		padding: 18px 22px;
		transition: 0.15s;
		position: relative;
	}
	.heartContainer {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 1;
	}
	.heartIcon {
		width: 18px;
		height: 16px;
	}
	.main {
		border: 2px solid var(--color-main);
	}
	.secondary {
		border: 2px solid var(--color-secondary);
	}
	.accent {
		border: 2px solid var(--color-accent);
	}
	.success {
		border: 2px solid var(--color-success-main);
	}
	.warning {
		border: 2px solid var(--color-warn-main);
	}
	.error {
		border: 2px solid var(--color-error-main);
	}
</style>
