<template>
	<Tooltip :width="tooltipWidth" @close="$emit('close')">
		<!-- Size Filter Tooltip -->
		<div v-if="filterType === 'size'">
			<h3 :class="$style.tooltipTitle">{{ t('filters.selectSize') }}</h3>
			<div :class="$style.sizeGrid">
				<button
					v-for="size in sizes"
					:key="size"
					:class="[
						$style.sizeOption,
						{ [$style.selected]: selectedValues.includes(size) },
					]"
					type="button"
					@click="toggleValue(size)"
				>
					{{ size }}
				</button>
			</div>
		</div>

		<!-- Quantity Filter Tooltip -->
		<div v-else-if="filterType === 'quantity'">
			<h3 :class="$style.tooltipTitle">{{ t('filters.quantity') }}</h3>
			<div :class="$style.quantityOptions">
				<button
					v-for="option in quantityOptions"
					:key="option.value"
					:class="[
						$style.quantityOption,
						{
							[$style.selected]: selectedValues.includes(
								option.value,
							),
						},
					]"
					type="button"
					@click="toggleValue(option.value)"
				>
					{{ option.label }}
				</button>
			</div>
		</div>

		<!-- Price Filter Tooltip -->
		<div v-else-if="filterType === 'price'">
			<h3 :class="$style.tooltipTitle">{{ t('filters.priceRange') }}</h3>
			<div :class="$style.priceInputs">
				<div :class="$style.priceInput">
					<label>{{ t('filters.from') }}</label>
					<input
						v-model="priceRange.min"
						type="number"
						placeholder="0"
						@input="updatePriceFilter"
					/>
				</div>
				<div :class="$style.priceInput">
					<label>{{ t('filters.to') }}</label>
					<input
						v-model="priceRange.max"
						type="number"
						placeholder="50000"
						@input="updatePriceFilter"
					/>
				</div>
			</div>
			<div :class="$style.priceActions">
				<button
					:class="$style.applyBtn"
					type="button"
					@click="applyPriceFilter"
				>
					{{ t('common.apply') }}
				</button>
			</div>
		</div>

		<!-- Sex Filter Tooltip -->
		<div v-else-if="filterType === 'sex'">
			<h3 :class="$style.tooltipTitle">{{ t('filters.sex') }}</h3>
			<div :class="$style.sexOptions">
				<button
					v-for="option in sexOptions"
					:key="option.value"
					:class="[
						$style.sexOption,
						{
							[$style.selected]: selectedValues.includes(
								option.value,
							),
						},
					]"
					type="button"
					@click="toggleValue(option.value)"
				>
					{{ option.label }}
				</button>
			</div>
		</div>

		<!-- Color Filter Tooltip -->
		<div v-else-if="filterType === 'color'">
			<h3 :class="$style.tooltipTitle">{{ t('filters.selectColor') }}</h3>
			<div :class="$style.colorOptions">
				<button
					v-for="color in colors"
					:key="color.value"
					:class="[
						$style.colorOption,
						{
							[$style.selected]: selectedValues.includes(
								color.value,
							),
						},
					]"
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
	import { useI18n } from 'vue-i18n';
	import Tooltip from '@shared/ui/Tooltip.vue';

	const { t } = useI18n();

	interface Props {
		filterType: 'size' | 'quantity' | 'price' | 'sex' | 'color';
		currentValues?: string[];
	}

	const props = defineProps<Props>();
	const emit = defineEmits(['apply', 'close']);

	const selectedValues = ref<string[]>(props.currentValues || []);
	const priceRange = reactive({
		min: props.currentValues?.[0] || '',
		max: props.currentValues?.[1] || '',
	});

	// Watch for prop changes to update internal state
	watch(
		() => props.currentValues,
		(newValues) => {
			if (newValues) {
				if (props.filterType === 'price') {
					priceRange.min = newValues[0] || '';
					priceRange.max = newValues[1] || '';
				} else {
					selectedValues.value = [...newValues];
				}
			}
		},
		{ immediate: true },
	);

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
	const sizes = [
		'35',
		'36',
		'37',
		'38',
		'39',
		'40',
		'41',
		'42',
		'43',
		'44',
		'45',
		'46',
	];

	const quantityOptions = computed(() => [
		{ value: 'in_stock', label: t('filters.inStock') },
		{ value: 'pre_order', label: t('filters.preOrder') },
	]);

	const sexOptions = computed(() => [
		{ value: 'male', label: t('filters.male') },
		{ value: 'female', label: t('filters.female') },
		{ value: 'unisex', label: t('filters.unisex') },
	]);

	const colors = computed(() => [
		{ value: 'black', label: t('filters.colors.black'), hex: '#000000' },
		{ value: 'white', label: t('filters.colors.white'), hex: '#FFFFFF' },
		{ value: 'brown', label: t('filters.colors.brown'), hex: '#8B4513' },
		{ value: 'beige', label: t('filters.colors.beige'), hex: '#F5F5DC' },
		{ value: 'gray', label: t('filters.colors.gray'), hex: '#808080' },
		{ value: 'blue', label: t('filters.colors.blue'), hex: '#0000FF' },
		{ value: 'red', label: t('filters.colors.red'), hex: '#FF0000' },
		{ value: 'green', label: t('filters.colors.green'), hex: '#008000' },
	]);

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
		background: var(--background-default);
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
		color: var(--background-default);
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
		background: var(--background-default);
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
		color: var(--background-default);
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
		background: var(--background-default);
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
		background: var(--background-default);
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
		color: var(--background-default);
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
		background: var(--background-default);
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
		color: var(--background-default);
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
		color: var(--background-default);
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
