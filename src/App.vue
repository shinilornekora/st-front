<script setup lang="ts">
	// точка входа для приложения — минимум логики, только slot/page outlet
	import { useStore } from 'effector-vue/composition';
	import DevTools from '@shared/ui/DevTools.vue';
	import { StatusLine } from '@shared/ui';
	import { $toast } from '@shared/ui/toast.store';
	
	const toast = useStore($toast);
</script>

<template>
	<router-view :key="$route.fullPath" />
	<DevTools />
	<StatusLine :show="toast.show" :message="toast.message" :type="toast.type" />
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
