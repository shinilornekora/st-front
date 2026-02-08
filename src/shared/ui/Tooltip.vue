<template>
	<div :class="$style.tooltipContainer" ref="tooltipRef">
		<div :class="$style.tooltip" :style="{ width: width }">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
	width?: string;
}

const props = withDefaults(defineProps<Props>(), {
	width: '280px',
});

const emit = defineEmits(['close']);

const tooltipRef = ref<HTMLElement | null>(null);

// Close tooltip when clicking outside
const handleClickOutside = (event: MouseEvent) => {
	if (tooltipRef.value && !tooltipRef.value.contains(event.target as Node)) {
		emit('close');
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<style module>
.tooltipContainer {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	z-index: 1000;
}

.tooltip {
	background: var(--background-default);
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	border: 1px solid #e5e7eb;
	padding: 16px;
}
</style>
