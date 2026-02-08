<template>
	<div :class="$style.searchContainer" ref="containerRef">
		<form
			ref="formRef"
			:class="[$style.form, $style[type]]"
			@submit.prevent="handleSubmit"
			role="search"
		>
			<input
				:class="$style.input"
				v-model="value"
				:placeholder="placeholder"
				aria-label="Поиск"
				@focus="showPopup = true"
				@keydown.enter.prevent="handleSubmit"
			/>
			
			<!-- Active filters as chips inside search -->
			<div v-if="activeFilters.length > 0" ref="filterChipsRef" :class="$style.filterChips">
				<!-- Show all filters if they fit, otherwise show compressed view -->
				<template v-if="!shouldCompressFilters">
					<button
						v-for="filter in activeFilters"
						:key="filter.id"
						:class="$style.filterChip"
						type="button"
						@click="removeFilter(filter.id)"
					>
						{{ filter.label }}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</template>
				<!-- Compressed view with ellipsis -->
				<div
					v-else
					:class="$style.compressedFilters"
					@mouseenter="handleFiltersMouseEnter"
					@mouseleave="handleFiltersMouseLeave"
				>
					<span :class="$style.filterCount">{{ activeFilters.length }} фильтров</span>
					<div :class="$style.ellipsis">...</div>
				</div>
			</div>
			
			<button
				v-if="value || activeFilters.length > 0"
				:class="$style.clearBtn"
				type="button"
				@click="clearAll"
				aria-label="Очистить"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
			
			<button :class="$style.searchBtn" type="submit" aria-label="Найти">
				<slot name="icon">
					<img src="@assets/search.svg" alt="" :class="$style.searchIcon" />
				</slot>
			</button>
		</form>
		
		<!-- Popup with filters and suggestions -->
		<Transition name="popup">
			<div v-if="showPopup && !hideFilters" :class="$style.popup">
				<!-- Filter labels at top -->
				<div :class="$style.popupSection">
					<div :class="$style.filterLabels">
						<div
							v-for="filter in allFilters"
							:key="filter.id"
							:class="$style.filterLabelWrapper"
							ref="filterLabelRefs"
						>
							<button
								:class="$style.filterLabel"
								type="button"
								@click="openFilterTooltip(filter)"
							>
								{{ filter.label }}
							</button>
							<!-- Filter tooltip -->
							<FilterTooltip
								v-if="activeTooltip === filter.id"
								:filter-type="filter.id"
								:current-values="getCurrentFilterValues(filter.id)"
								@apply="handleFilterApply"
								@close="closeTooltip"
							/>
						</div>
					</div>
				</div>
				
				<!-- Search field suggestions below -->
				<div :class="$style.popupSection">
					<div :class="$style.suggestions">
						<button
							v-for="(suggestion, index) in searchSuggestions"
							:key="index"
							:class="$style.suggestionItem"
							type="button"
							@click="selectSuggestion(suggestion)"
						>
							<span :class="$style.suggestionText">{{ suggestion }}</span>
							<img src="@assets/search.svg" alt="" :class="$style.searchIcon" />
						</button>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Filters tooltip for compressed view -->
		<div
			:class="$style.filtersTooltipContainer"
			@mouseenter="handleTooltipMouseEnter"
			@mouseleave="handleTooltipMouseLeave"
		>
			<FiltersTooltip
				v-if="showFiltersTooltip && shouldCompressFilters"
				:filters="activeFilters"
				@remove-filter="removeFilter"
				@clear-all="clearAllFilters"
			/>
		</div>
	</div>
</template>
<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
	import FilterTooltip from './FilterTooltip.vue';
	import FiltersTooltip from './FiltersTooltip.vue';
	import theme from './theme.module.css';
	
	interface Filter {
		id: 'size' | 'quantity' | 'price' | 'sex' | 'color';
		label: string;
	}
	
	interface AppliedFilter extends Filter {
		values: string[];
	}
	
	const props = withDefaults(defineProps<{
		placeholder?: string;
		type?: 'main' | 'accent';
		hideFilters?: boolean;
		modelValue?: string;
		initialFilters?: AppliedFilter[];
	}>(), {
		type: 'main',
		initialFilters: () => [],
	});
	
	const emit = defineEmits(['submit', 'update:modelValue', 'filterChange']);
	
	const value = computed({
		get: () => props.modelValue || '',
		set: (val) => emit('update:modelValue', val)
	});
	const activeFilters = ref<AppliedFilter[]>(props.initialFilters || []);
	
	// Watch for initialFilters changes and update activeFilters
	watch(() => props.initialFilters, (newFilters) => {
		if (newFilters && newFilters.length > 0) {
			activeFilters.value = [...newFilters];
		}
	}, { deep: true });
	const showPopup = ref(false);
	const activeTooltip = ref<string | null>(null);
	const containerRef = ref<HTMLElement | null>(null);
	const filterLabelRefs = ref<HTMLElement[]>([]);
	const showFiltersTooltip = ref(false);
	const filtersTooltipTimeout = ref<NodeJS.Timeout | null>(null);
	const shouldCompressFilters = ref(false);
	const formRef = ref<HTMLElement | null>(null);
	const filterChipsRef = ref<HTMLElement | null>(null);
	const resizeObserver = ref<ResizeObserver | null>(null);
	
	// All available filters
	const allFilters = ref<Filter[]>([
		{ id: 'size', label: 'Размер' },
		{ id: 'quantity', label: 'Количество' },
		{ id: 'price', label: 'Цена' },
		{ id: 'sex', label: 'М/Ж' },
		{ id: 'color', label: 'Цвет' }
	]);
	
	// Search suggestions
	const searchSuggestions = ref<string[]>([
		'Кроссовки',
		'Ботинки',
		'Туфли',
	]);
	
	const selectSuggestion = (suggestion: string) => {
		value.value = suggestion;
		showPopup.value = false;
		// Immediately trigger search with the selected suggestion
		emit('submit', { query: suggestion, filters: activeFilters.value });
	};
	
	const handleSubmit = () => {
		showPopup.value = false;
		emit('submit', { query: value.value, filters: activeFilters.value });
	};
	
	const openFilterTooltip = (filter: Filter) => {
		// Close any existing tooltip first
		activeTooltip.value = null;
		// Open the new tooltip
		setTimeout(() => {
			activeTooltip.value = filter.id;
		}, 10);
	};
	
	const closeTooltip = () => {
		activeTooltip.value = null;
	};
	
	const handleFilterApply = (filterData: { type: string; values: string[] }) => {
		// Remove existing filter of the same type if it exists
		activeFilters.value = activeFilters.value.filter(f => f.id !== filterData.type);
		
		// Add the new filter only if it has values
		if (filterData.values.length > 0) {
			const filter = allFilters.value.find(f => f.id === filterData.type);
			if (filter) {
				const label = getFilterLabel(filterData.type, filterData.values);
				activeFilters.value.push({
					...filter,
					values: filterData.values,
					label
				});
			}
		}
		
		emit('filterChange', activeFilters.value);
		
		// Once compressed, keep compressed - don't try to expand again
		// This prevents visual glitches when adding filters to compressed state
		if (shouldCompressFilters.value || activeFilters.value.length > 2) {
			shouldCompressFilters.value = true;
		} else {
			// Only check compression if we're not already compressed
			nextTick(() => {
				checkFiltersCompression();
			});
		}
		
		// Don't close tooltip for immediate feedback - let user continue selecting
	};
	
	const getFilterLabel = (type: string, values: string[]): string => {
		const filter = allFilters.value.find(f => f.id === type);
		if (!filter) return '';
		
		switch (type) {
			case 'size':
				return `Размер: ${values.join(', ')}`;
			case 'quantity':
				return values.includes('in_stock') ? 'В наличии' : 'Под заказ';
			case 'price':
				const [min, max] = values;
				if (min && max) return `Цена: ${min}-${max}`;
				if (min) return `Цена: от ${min}`;
				if (max) return `Цена: до ${max}`;
				return 'Цена';
			case 'sex':
				const sexLabels: Record<string, string> = {
					'male': 'Мужской',
					'female': 'Женский',
					'unisex': 'Унисекс'
				};
				return values.map(v => sexLabels[v] || v).join(', ');
			case 'color':
				const colorLabels: Record<string, string> = {
					'black': 'Черный',
					'white': 'Белый',
					'brown': 'Коричневый',
					'beige': 'Бежевый',
					'gray': 'Серый',
					'blue': 'Синий',
					'red': 'Красный',
					'green': 'Зеленый'
				};
				return values.map(v => colorLabels[v] || v).join(', ');
			default:
				return filter.label;
		}
	};
	
	const getCurrentFilterValues = (filterId: string): string[] => {
		const filter = activeFilters.value.find(f => f.id === filterId);
		return filter ? filter.values : [];
	};
	
	const removeFilter = (filterId: string) => {
		activeFilters.value = activeFilters.value.filter(f => f.id !== filterId);
		emit('filterChange', activeFilters.value);
		
		// Only check if we should decompress if we have few filters left
		// This prevents visual glitches when removing filters from compressed state
		if (activeFilters.value.length <= 2) {
			nextTick(() => {
				checkFiltersCompression();
			});
		}
		
		// Close tooltip if no filters left
		if (activeFilters.value.length === 0) {
			showFiltersTooltip.value = false;
		}
	};
	
	const clearAll = () => {
		emit('update:modelValue', '');
		activeFilters.value = [];
		showPopup.value = false;
		emit('filterChange', []);
	};

	const clearAllFilters = () => {
		activeFilters.value = [];
		emit('filterChange', []);
		// Close tooltip when all filters are cleared
		showFiltersTooltip.value = false;
	};

	// Check if filters should be compressed based on available space
	const checkFiltersCompression = () => {
		if (!formRef.value || !filterChipsRef.value || activeFilters.value.length === 0) {
			shouldCompressFilters.value = false;
			return;
		}

		// Get the form width and filter chips width
		const formWidth = formRef.value.offsetWidth;
		const filterChipsWidth = filterChipsRef.value.offsetWidth;
		
		// More aggressive compression - compress if filter chips take more than 40% of the form width
		// Also compress if we have more than 2 filters regardless of width
		const compressionThreshold = formWidth * 0.4;
		const shouldCompressByWidth = filterChipsWidth > compressionThreshold;
		const shouldCompressByCount = activeFilters.value.length > 2;
		
		shouldCompressFilters.value = shouldCompressByWidth || shouldCompressByCount;
	};

	// Handle mouse enter on compressed filters
	const handleFiltersMouseEnter = () => {
		// Clear any existing timeout
		if (filtersTooltipTimeout.value) {
			clearTimeout(filtersTooltipTimeout.value);
			filtersTooltipTimeout.value = null;
		}
		showFiltersTooltip.value = true;
	};

	// Handle mouse leave from compressed filters
	const handleFiltersMouseLeave = () => {
		// Set a timeout before hiding to allow moving to tooltip
		filtersTooltipTimeout.value = setTimeout(() => {
			showFiltersTooltip.value = false;
		}, 200);
	};

	// Handle mouse enter on tooltip
	const handleTooltipMouseEnter = () => {
		// Clear any existing timeout
		if (filtersTooltipTimeout.value) {
			clearTimeout(filtersTooltipTimeout.value);
			filtersTooltipTimeout.value = null;
		}
		showFiltersTooltip.value = true;
	};

	// Handle mouse leave from tooltip
	const handleTooltipMouseLeave = () => {
		// Set a timeout before hiding
		filtersTooltipTimeout.value = setTimeout(() => {
			showFiltersTooltip.value = false;
		}, 100);
	};

	// Set up ResizeObserver to monitor filter chips width
	const setupResizeObserver = () => {
		if (!filterChipsRef.value) return;

		// Clean up existing observer
		if (resizeObserver.value) {
			resizeObserver.value.disconnect();
		}

		// Create new observer
		resizeObserver.value = new ResizeObserver(() => {
			checkFiltersCompression();
		});

		// Observe the filter chips container
		resizeObserver.value.observe(filterChipsRef.value);
		
		// Also observe the form to detect width changes
		if (formRef.value) {
			resizeObserver.value.observe(formRef.value);
		}
	};
	
	// Close popup when clicking outside
	const handleClickOutside = (event: MouseEvent) => {
		if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
			showPopup.value = false;
			activeTooltip.value = null;
		}
	};
	
	onMounted(() => {
		document.addEventListener('click', handleClickOutside);
		
		// Set up resize observer after DOM is ready
		nextTick(() => {
			setupResizeObserver();
			checkFiltersCompression();
		});
	});
	
	onUnmounted(() => {
		document.removeEventListener('click', handleClickOutside);
		
		// Clean up resize observer
		if (resizeObserver.value) {
			resizeObserver.value.disconnect();
		}
	});
</script>
<style module>
	@import './theme.module.css';
	
	.searchContainer {
		position: relative;
		display: flex;
		flex-direction: column;
		max-width: 575px !important;
		max-height: 40px;
		gap: 12px;
	}
	
	.form {
		display: flex;
		align-items: center;
		gap: 8px;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 24px;
		padding: 0px 16px;
		transition: border-color 0.2s, box-shadow 0.2s;
		flex-wrap: nowrap;
		max-width: 575px !important;
		min-height: 40px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		/* Remove overflow: hidden to ensure background is visible */
	}
	
	.form:focus-within {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(95, 219, 209, 0.1);
	}
	
	.main {
		/* Remove background and border color for main type, keep it white */
	}
	
	.accent {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}
	
	.input {
		border: none;
		background: none;
		outline: none;
		font-size: 16px;
		padding: 4px 8px;
		flex: 1;
		min-width: 120px;
		color: var(--color-primary);
	}
	
	.input::placeholder {
		color: #9ca3af;
	}
	
	.filterChips {
		display: flex;
		gap: 6px;
		flex-wrap: nowrap;
		align-items: center;
		flex-shrink: 1;
		min-width: 0;
		overflow: hidden;
	}
	
	.filterChip {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 16px;
		padding: 4px 10px;
		font-size: 13px;
		color: var(--color-primary);
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s;
		white-space: nowrap;
		flex-shrink: 0;
	}
	
	.filterChip:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
	}
	
	.filterChip svg {
		width: 12px;
		height: 12px;
		stroke-width: 2.5;
	}
	
	.clearBtn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		color: #6b7280;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;
		flex-shrink: 0;
	}
	
	.clearBtn:hover {
		color: var(--color-primary);
	}
	
	.searchBtn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		color: #6b7280;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s;
		flex-shrink: 0;
	}
	
	.searchBtn:hover {
		color: var(--color-accent);
	}
	
	.searchIcon {
		width: 16px;
		height: 16px;
	}
	
	/* Popup */
	.popup {
		position: absolute;
		top: calc(100% + 22px);
		left: 0;
		right: 0;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		border: 1px solid #e5e7eb;
	}
	
	.popupSection {
		padding: 16px;
	}
	
	.popupSection:not(:last-child) {
		border-bottom: 1px solid #e5e7eb;
	}
	
	/* Filter labels */
	.filterLabels {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}
	
	.filterLabelWrapper {
		position: relative;
	}
	
	.filterLabel {
		background: #f3f4f6;
		border: none;
		border-radius: 8px;
		padding: 8px 16px;
		font-size: 14px;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}
	
	.filterLabel:hover {
		background: #e5e7eb;
		color: var(--color-primary);
	}
	
	/* Search suggestions */
	.suggestions {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	
	.suggestionItem {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: transparent;
		border: none;
		padding: 12px 8px;
		font-size: 15px;
		color: var(--color-primary);
		cursor: pointer;
		transition: background 0.2s;
		border-radius: 8px;
		text-align: left;
	}
	
	.suggestionItem:hover {
		background: #f9fafb;
	}
	
	.suggestionText {
		flex: 1;
	}
	
	.suggestionItem .searchIcon {
		width: 18px;
		height: 18px;
		color: #9ca3af;
		flex-shrink: 0;
	}
	
	/* Popup transition */
	.popup-enter-active,
	.popup-leave-active {
		transition: all 0.2s ease;
	}
	
	.popup-enter-from {
		opacity: 0;
		transform: translateY(-8px);
	}
	
	.popup-leave-to {
		opacity: 0;
		transform: translateY(-8px);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.form {
			padding: 0px 12px;
		}

		.searchContainer,
		.form {
			max-width: 100% !important;
		}
		
		.input {
			font-size: 14px;
			min-width: 80px;
		}
		
		.filterChip {
			font-size: 12px;
			padding: 3px 8px;
		}
		
		.suggestedChip {
			font-size: 13px;
			padding: 5px 12px;
		}
	}

	/* Compressed filters styles */
	.compressedFilters {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 16px;
		padding: 4px 10px;
		font-size: 13px;
		color: var(--color-primary);
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.compressedFilters:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
	}

	.filterCount {
		font-size: 13px;
		color: var(--color-primary);
	}

	.ellipsis {
		font-weight: bold;
		color: #6b7280;
	}

	/* Filters tooltip container */
	.filtersTooltipContainer {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		z-index: 1000;
	}
</style>
