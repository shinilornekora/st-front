<template>
	<div :class="$style.tooltipContainer" ref="tooltipRef">
		<div :class="$style.tooltip">
			<div :class="$style.tooltipHeader">
				<h4>Активные фильтры</h4>
				<button :class="$style.clearAllBtn" type="button" @click="clearAllFilters">
					Очистить все
				</button>
			</div>
			<div :class="$style.filtersList">
				<div
					v-for="filter in filters"
					:key="filter.id"
					:class="$style.filterItem"
				>
					<span :class="$style.filterLabel">{{ filter.label }}</span>
					<button
						:class="$style.removeBtn"
						type="button"
						@click="removeFilter(filter.id)"
						aria-label="Удалить фильтр"
					>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Filter {
	id: string;
	label: string;
	values: string[];
}

const props = defineProps<{
	filters: Filter[];
}>();

const emit = defineEmits(['removeFilter', 'clearAll']);

const tooltipRef = ref<HTMLElement | null>(null);

const removeFilter = (filterId: string) => {
	emit('removeFilter', filterId);
	// Don't close tooltip when removing individual filters
};

const clearAllFilters = () => {
	emit('clearAll');
};

// Close tooltip when clicking outside
const handleClickOutside = (event: MouseEvent) => {
	if (tooltipRef.value && !tooltipRef.value.contains(event.target as Node)) {
		// Let parent handle closing
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
	right: 0;
	z-index: 1000;
	min-width: 250px;
	max-width: 350px;
}

.tooltip {
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	border: 1px solid #e5e7eb;
	padding: 16px;
}

.tooltipHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.tooltipHeader h4 {
	margin: 0;
	font-size: 14px;
	font-weight: 600;
	color: var(--color-primary);
}

.clearAllBtn {
	background: none;
	border: none;
	color: var(--color-accent);
	font-size: 12px;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	transition: background 0.2s;
}

.clearAllBtn:hover {
	background: var(--color-hover);
}

.filtersList {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.filterItem {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 12px;
	background: #f9fafb;
	border-radius: 6px;
}

.filterLabel {
	font-size: 13px;
	color: var(--color-primary);
	flex: 1;
	/* Remove text truncation to allow full text display in tooltip */
	word-wrap: break-word;
	white-space: normal;
}

.removeBtn {
	background: none;
	border: none;
	color: #6b7280;
	cursor: pointer;
	padding: 2px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
	flex-shrink: 0;
}

.removeBtn:hover {
	background: #e5e7eb;
	color: var(--color-primary);
}

.removeBtn svg {
	width: 12px;
	height: 12px;
}
</style>
