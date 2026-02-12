<template>
	<table :class="[$style.table, $style[type]]" role="table">
		<thead>
			<tr>
				<th
					v-for="(h, idx) in headers"
					:key="h.key"
					:aria-sort="ariaSort(idx)"
					@click="sort(idx)"
				>
					{{ h.label }}
					<span v-if="sortKey === idx">{{
						sortAsc ? '▲' : '▼'
					}}</span>
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-if="!items.length">
				<td :colspan="headers.length" :class="$style.empty">
					{{ emptyText }}
				</td>
			</tr>
			<tr v-for="row in sorted" :key="row.id">
				<td v-for="h in headers" :key="h.key">{{ row[h.key] }}</td>
			</tr>
		</tbody>
	</table>
</template>
<script setup lang="ts">
	import { ref, computed } from 'vue';
	import theme from './theme.module.css';
	type Row = Record<string, any> & { id: string | number };
	defineProps<{
		headers: { key: string; label: string }[];
		items: Row[];
		emptyText?: string;
		type?: 'main' | 'accent' | 'error' | 'success';
	}>();
	const sortKey = ref(-1);
	const sortAsc = ref(true);
	function sort(idx: number) {
		sortAsc.value = sortKey.value === idx ? !sortAsc.value : true;
		sortKey.value = idx;
	}
	const sorted = computed(() => {
		if (sortKey.value < 0) return props.items;
		const k = props.headers[sortKey.value].key;
		return [...props.items].sort(
			(a, b) => (a[k] > b[k] ? 1 : -1) * (sortAsc.value ? 1 : -1),
		);
	});
	const ariaSort = (idx: number): string =>
		sortKey.value !== idx
			? 'none'
			: sortAsc.value
				? 'ascending'
				: 'descending';
</script>
<style module>
	@import './theme.module.css';
	.table {
		width: 100%;
		border-collapse: collapse;
		min-width: 280px;
		box-shadow: 0 1px 7px #0001;
		background: var(--background-default);
		border-radius: 6px 6px 0 0;
		overflow: hidden;
	}
	th,
	td {
		padding: 8px 13px;
		text-align: left;
	}
	th {
		user-select: none;
		cursor: pointer;
		background: var(--color-hover);
	}
	th:focus {
		outline: 2px solid var(--color-main);
	}
	tbody tr:nth-child(odd) {
		background: var(--color-hover);
	}
	td.empty {
		color: var(--color-secondary);
		text-align: center;
	}
	.main th {
		background: var(--color-main);
		color: var(--background-default);
	}
	.accent th {
		background: var(--color-accent);
		color: var(--color-primary);
	}
	.error th {
		background: var(--color-error-main);
		color: var(--background-default);
	}
	.success th {
		background: var(--color-success-main);
		color: var(--background-default);
	}
</style>
