<template>
	<div :class="$style.searchContainer" ref="containerRef">
		<form
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
			<div v-if="activeFilters.length > 0" :class="$style.filterChips">
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
	</div>
</template>
<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue';
	import FilterTooltip from './FilterTooltip.vue';
	import theme from './theme.module.css';
	
	interface Filter {
		id: 'size' | 'quantity' | 'price' | 'sex' | 'color';
		label: string;
	}
	
	interface AppliedFilter extends Filter {
		values: string[];
	}
	
	const props = defineProps<{
		placeholder?: string;
		type?: 'main' | 'accent';
		hideFilters?: boolean;
		modelValue?: string;
	}>();
	
	const emit = defineEmits(['submit', 'update:modelValue', 'filterChange']);
	
	const value = computed({
		get: () => props.modelValue || '',
		set: (val) => emit('update:modelValue', val)
	});
	const activeFilters = ref<AppliedFilter[]>([]);
	const showPopup = ref(false);
	const activeTooltip = ref<string | null>(null);
	const containerRef = ref<HTMLElement | null>(null);
	const filterLabelRefs = ref<HTMLElement[]>([]);
	
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
		handleSubmit();
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
		
		// Add the new filter
		const filter = allFilters.value.find(f => f.id === filterData.type);
		if (filter) {
			const label = getFilterLabel(filterData.type, filterData.values);
			activeFilters.value.push({
				...filter,
				values: filterData.values,
				label
			});
		}
		
		emit('filterChange', activeFilters.value);
		closeTooltip();
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
	
	const removeFilter = (filterId: string) => {
		activeFilters.value = activeFilters.value.filter(f => f.id !== filterId);
		emit('filterChange', activeFilters.value);
	};
	
	const clearAll = () => {
		emit('update:modelValue', '');
		activeFilters.value = [];
		showPopup.value = false;
		emit('filterChange', []);
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
	});
	
	onUnmounted(() => {
		document.removeEventListener('click', handleClickOutside);
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
		padding: 8px 16px;
		transition: border-color 0.2s, box-shadow 0.2s;
		flex-wrap: wrap;
		max-width: 575px !important;
		max-height: 40px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
	
	.form:focus-within {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(95, 219, 209, 0.1);
	}
	
	.main {
		background: var(--color-main);
		border-color: var(--color-main);
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
		flex-wrap: wrap;
		align-items: center;
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
		top: calc(100% + 8px);
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
			padding: 6px 12px;
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
</style>
