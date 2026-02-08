<template>
	<Tooltip @close="$emit('close')" :width="tooltipWidth">
		<!-- Size Filter Tooltip -->
		<div v-if="filterType === 'size'">
			<h3 :class="$style.tooltipTitle">Выберите размер</h3>
			<div :class="$style.sizeGrid">
				<button
					v-for="size in sizes"
					:key="size"
					:class="[$style.sizeOption, { [$style.selected]: selectedValues.includes(size) }]"
					type="button"
					@click="toggleValue(size)"
				>
					{{ size }}
				</button>
			</div>
		</div>

		<!-- Quantity Filter Tooltip -->
		<div v-else-if="filterType === 'quantity'">
			<h3 :class="$style.tooltipTitle">Количество</h3>
			<div :class="$style.quantityOptions">
				<button
					v-for="option in quantityOptions"
					:key="option.value"
					:class="[$style.quantityOption, { [$style.selected]: selectedValues.includes(option.value) }]"
					type="button"
					@click="toggleValue(option.value)"
				>
					{{ option.label }}
				</button>
			</div>
		</div>

		<!-- Price Filter Tooltip -->
		<div v-else-if="filterType === 'price'">
			<h3 :class="$style.tooltipTitle">Диапазон цен</h3>
			<div :class="$style.priceInputs">
				<div :class="$style.priceInput">
					<label>От</label>
					<input v-model="priceRange.min" type="number" placeholder="0" @input="updatePriceFilter" />
				</div>
				<div :class="$style.priceInput">
					<label>До</label>
					<input v-model="priceRange.max" type="number" placeholder="50000" @input="updatePriceFilter" />
				</div>
			</div>
			<div :class="$style.priceActions">
				<button :class="$style.applyBtn" type="button" @click="applyPriceFilter">Применить</button>
			</div>
		</div>

		<!-- Sex Filter Tooltip -->
		<div v-else-if="filterType === 'sex'">
			<h3 :class="$style.tooltipTitle">Пол</h3>
			<div :class="$style.sexOptions">
				<button
					v-for="option in sexOptions"
					:key="option.value"
					:class="[$style.sexOption, { [$style.selected]: selectedValues.includes(option.value) }]"
					type="button"
					@click="toggleValue(option.value)"
				>
					{{ option.label }}
				</button>
			</div>
		</div>

		<!-- Color Filter Tooltip -->
		<div v-else-if="filterType === 'color'">
			<h3 :class="$style.tooltipTitle">Выберите цвет</h3>
			<div :class="$style.colorOptions">
				<button
					v-for="color in colors"
					:key="color.value"
					:class="[$style.colorOption, { [$style.selected]: selectedValues.includes(color.value) }]"
					type="button"
					@click="toggleValue(color.value)"
				>
					{{ color.label }}
				</button>
			</div>
		</div>
	</Tooltip>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import Tooltip from './Tooltip.vue';

interface Props {
	filterType: 'size' | 'quantity' | 'price' | 'sex' | 'color';
	currentValues?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(['apply', 'close']);

const selectedValues = ref<string[]>(props.currentValues || []);
const priceRange = reactive({
	min: props.currentValues?.[0] || '',
	max: props.currentValues?.[1] || ''
});

// Watch for prop changes to update internal state
watch(() => props.currentValues, (newValues) => {
	if (newValues) {
		if (props.filterType === 'price') {
			priceRange.min = newValues[0] || '';
			priceRange.max = newValues[1] || '';
		} else {
			selectedValues.value = [...newValues];
		}
	}
}, { immediate: true });

const tooltipWidth = computed(() => {
	switch (props.filterType) {
		case 'color':
			return '320px';
		case 'price':
			return '300px';
		default:
			return '280px';
	}
});

// Filter options
const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

const quantityOptions = [
	{ value: 'in_stock', label: 'В наличии' },
	{ value: 'pre_order', label: 'Под заказ' },
];

const sexOptions = [
	{ value: 'male', label: 'Мужской' },
	{ value: 'female', label: 'Женский' },
	{ value: 'unisex', label: 'Унисекс' },
];

const colors = [
	{ value: 'black', label: 'Черный', hex: '#000000' },
	{ value: 'white', label: 'Белый', hex: '#FFFFFF' },
	{ value: 'brown', label: 'Коричневый', hex: '#8B4513' },
	{ value: 'beige', label: 'Бежевый', hex: '#F5F5DC' },
	{ value: 'gray', label: 'Серый', hex: '#808080' },
	{ value: 'blue', label: 'Синий', hex: '#0000FF' },
	{ value: 'red', label: 'Красный', hex: '#FF0000' },
	{ value: 'green', label: 'Зеленый', hex: '#008000' },
];

const toggleValue = (value: string) => {
	const index = selectedValues.value.indexOf(value);
	if (index > -1) {
		selectedValues.value.splice(index, 1);
	} else {
		selectedValues.value.push(value);
	}
	
	// Apply filter immediately when value changes
	if (selectedValues.value.length > 0) {
		emit('apply', {
			type: props.filterType,
			values: [...selectedValues.value],
		});
	} else {
		// If no values selected, remove the filter
		emit('apply', {
			type: props.filterType,
			values: [],
		});
	}
};

const applyPriceFilter = () => {
	if (priceRange.min || priceRange.max) {
		emit('apply', {
			type: props.filterType,
			values: [priceRange.min, priceRange.max],
		});
	} else {
		// If no price range, remove the filter
		emit('apply', {
			type: props.filterType,
			values: [],
		});
	}
	emit('close');
};

// Watch for price changes and apply immediately
const updatePriceFilter = () => {
	// Debounce price filter updates
	setTimeout(() => {
		applyPriceFilter();
	}, 500);
};
</script>

<style module>
.tooltipTitle {
	margin: 0 0 16px 0;
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
}

/* Size Filter */
.sizeGrid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
	margin-bottom: 16px;
}

.sizeOption {
	padding: 8px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background: white;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 14px;
	color: var(--color-primary);
}

.sizeOption:hover {
	border-color: #9ca3af;
}

.sizeOption.selected {
	background: var(--color-accent);
	color: white;
	border-color: var(--color-accent);
}

/* Quantity Filter */
.quantityOptions {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
}

.quantityOption {
	padding: 10px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background: white;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 14px;
	text-align: left;
	color: var(--color-primary);
}

.quantityOption:hover {
	border-color: #9ca3af;
}

.quantityOption.selected {
	background: var(--color-accent);
	color: white;
	border-color: var(--color-accent);
}

/* Price Filter */
.priceInputs {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.priceInput {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.priceInput label {
	font-size: 14px;
	color: #6b7280;
}

.priceInput input {
	padding: 8px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	background: white;
	color: var(--color-primary);
	width: 100%;
	box-sizing: border-box;
}

.priceInput input:focus {
	outline: none;
	border-color: var(--color-accent);
}

.priceInput input::placeholder {
	color: #9ca3af;
}

/* Sex Filter */
.sexOptions {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
}

.sexOption {
	padding: 10px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background: white;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 14px;
	text-align: left;
	color: var(--color-primary);
}

.sexOption:hover {
	border-color: #9ca3af;
}

.sexOption.selected {
	background: var(--color-accent);
	color: white;
	border-color: var(--color-accent);
}

/* Color Filter */
.colorOptions {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 16px;
	max-height: 200px;
	overflow-y: auto;
}

.colorOption {
	padding: 10px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	background: white;
	cursor: pointer;
	transition: all 0.2s;
	font-size: 14px;
	text-align: left;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: var(--color-primary);
}

.colorOption:hover {
	border-color: #9ca3af;
}

.colorOption.selected {
	background: var(--color-accent);
	color: white;
	border-color: var(--color-accent);
}

.colorOption.selected::after {
	content: '✓';
	font-weight: bold;
}

/* Price filter actions (only price filter needs apply button) */
.priceActions {
	display: flex;
	justify-content: flex-end;
}

.applyBtn {
	background: var(--color-dark);
	color: white;
	border: none;
	border-radius: 6px;
	padding: 8px 16px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: background 0.2s;
}

.applyBtn:hover {
	background: var(--color-main);
}
</style>
