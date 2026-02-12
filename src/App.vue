<script setup lang="ts">
	import { useStore } from 'effector-vue/composition';
	import { DevTools } from '@app/devtools';
	import { StatusLine } from '@shared/ui';
	import { $toast } from '@shared/model';

	const toast = useStore($toast);
</script>

<template>
	<router-view :key="$route.fullPath" />
	<DevTools />
	<StatusLine
		:show="toast.show"
		:message="toast.message"
		:type="toast.type"
	/>
</template>

<style scoped>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.vue:hover {
		filter: drop-shadow(0 0 2em #42b883aa);
	}
</style>
