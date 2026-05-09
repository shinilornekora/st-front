<template>
	<div :class="$style.statCard">
		<div :class="$style.statHeader">
			<h3 :class="$style.statTitle">{{ t('b2b.productsSold') }}</h3>
			<select
				v-model="localPeriod"
				:class="$style.periodSelect"
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
			:legend-label="t('b2b.sandals')"
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

	const productsSoldDatasets = computed(() => {
		if (props.productsData.length === 0) return [];

		const totalSold = props.productsData.reduce(
			(sum, p) => sum + p.sold,
			0,
		);
		const aggregateData = props.chartData.chartData.data;

		return props.selectedProductIds
			.map((productId, index) => {
				const product = props.productsData.find(
					(p) => p.id === productId,
				);
				if (!product) return null;

				const share = totalSold > 0 ? product.sold / totalSold : 0;

				return {
					label: product.name,
					data: aggregateData.map((v) => Math.round(v * share)),
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
