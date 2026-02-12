<template>
	<div :class="$style.statCard">
		<div :class="$style.statHeader">
			<h3 :class="$style.statTitle">{{ t('b2b.productsSold') }}</h3>
			<select
				:class="$style.periodSelect"
				v-model="localPeriod"
				@change="handlePeriodChange"
			>
				<option value="month">{{ t('admin.month') }}</option>
				<option value="quarter">{{ t('admin.quarter') }}</option>
				<option value="year">{{ t('admin.year') }}</option>
			</select>
		</div>
		<div :class="$style.statValue">
			{{ productsSoldTotal }} {{ t('b2b.sold').split(' ')[1] }}
		</div>
		<div :class="$style.statChange">
			{{ productsSoldChange }} {{ t('b2b.comparedToPrevious') }}
		</div>
		<MultiLineChart
			v-if="selectedProductIds.length > 0"
			:key="`products-multi-${localPeriod}-${selectedProductIds.join(',')}`"
			:datasets="productsSoldDatasets"
			:labels="chartData.chartData.labels"
		/>
		<LineChart
			v-else
			:key="`products-single-${localPeriod}`"
			:data="chartData.chartData.data"
			:labels="chartData.chartData.labels"
			:legendLabel="t('b2b.sandals')"
			color="#5fdbd1"
		/>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { LineChart, MultiLineChart } from '@shared/ui';
	import type { AnalyticsDashboard } from '@shared/api';
	import $style from './B2B.module.css';

	interface Props {
		chartData: AnalyticsDashboard['productsSold'];
		productsData: AnalyticsDashboard['products'];
		selectedProductIds: number[];
		period: string;
		productColors: string[];
	}

	const props = defineProps<Props>();
	const emit = defineEmits<{
		'update:period': [value: string];
		'load-data': [];
	}>();

	const { t } = useI18n();
	const localPeriod = ref(props.period);

	const handlePeriodChange = () => {
		emit('update:period', localPeriod.value);
		emit('load-data');
	};

	// Generate mock chart data for a specific product
	const generateProductChartData = (
		productId: number,
		period: string,
	): number[] => {
		let data = [15, 20, 25, 45, 35, 30];

		if (period === 'quarter') {
			data = [35, 50, 60, 70];
		} else if (period === 'year') {
			data = [80, 120, 160, 220, 280, 340];
		}

		return data.map((value) => value + productId * 3);
	};

	const productsSoldDatasets = computed(() => {
		if (props.productsData.length === 0) return [];

		return props.selectedProductIds
			.map((productId, index) => {
				const product = props.productsData.find(
					(p) => p.id === productId,
				);
				if (!product) return null;

				return {
					label: product.name,
					data: generateProductChartData(
						productId,
						localPeriod.value,
					),
					color: props.productColors[
						index % props.productColors.length
					],
				};
			})
			.filter(Boolean) as {
			label: string;
			data: number[];
			color: string;
		}[];
	});

	const productsSoldTotal = computed(() => {
		if (!props.chartData) return 0;

		if (props.selectedProductIds.length === 0) {
			return props.chartData.total;
		}

		return props.selectedProductIds.reduce((sum, productId) => {
			const product = props.productsData.find((p) => p.id === productId);
			return sum + (product?.sold || 0);
		}, 0);
	});

	const productsSoldChange = computed(() => {
		if (!props.chartData) return '+0%';

		if (props.selectedProductIds.length === 0) {
			return props.chartData.change;
		}

		const changes = props.selectedProductIds.map((productId) => {
			const product = props.productsData.find((p) => p.id === productId);
			return parseFloat(product?.dynamics.replace(/[+%]/g, '') || '0');
		});

		const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
		return `${avgChange > 0 ? '+' : ''}${avgChange.toFixed(1)}%`;
	});
</script>
