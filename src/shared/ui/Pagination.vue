<template>
	<nav :class="$style.pagination" aria-label="Pagination">
		<button
			:class="[$style.paginationBtn, $style.paginationArrow]"
			@click="goToPreviousPage"
			:disabled="currentPage === 1"
			aria-label="Previous page"
		>
			<img src="../../assets/arrow_left.svg" alt="" :class="$style.arrowIcon" />
			{{ previousText }}
		</button>
		
		<button
			v-for="page in paginationPages"
			:key="page"
			:class="[$style.paginationBtn, { [$style.active]: page === currentPage }]"
			@click="goToPage(page)"
			:aria-label="`Page ${page}`"
			:aria-current="page === currentPage ? 'page' : undefined"
		>
			{{ page }}
		</button>
		
		<span v-if="showEllipsis" :class="$style.ellipsis">...</span>
		
		<button
			v-if="totalPages > maxVisiblePages && currentPage < totalPages - 2"
			:class="$style.paginationBtn"
			@click="goToPage(totalPages)"
			:aria-label="`Page ${totalPages}`"
		>
			{{ totalPages }}
		</button>
		
		<button
			:class="[$style.paginationBtn, $style.paginationArrow]"
			@click="goToNextPage"
			:disabled="currentPage === totalPages"
			aria-label="Next page"
		>
			{{ nextText }}
			<img src="../../assets/arrow_right.svg" alt="" :class="$style.arrowIcon" />
		</button>
	</nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
	currentPage: number;
	totalPages: number;
	maxVisiblePages?: number;
	previousText?: string;
	nextText?: string;
	scrollToTop?: boolean;
}>(), {
	maxVisiblePages: 5,
	previousText: 'Previous',
	nextText: 'Next',
	scrollToTop: true,
});

const emit = defineEmits<{
	'page-change': [page: number];
}>();

const paginationPages = computed(() => {
	const pages: number[] = [];
	
	if (props.totalPages <= props.maxVisiblePages) {
		// Show all pages if maxVisiblePages or fewer
		for (let i = 1; i <= props.totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);
		
		// Calculate how many pages to show around current page
		const pagesToShow = props.maxVisiblePages - 2; // Reserve space for first and last page
		const halfPagesToShow = Math.floor(pagesToShow / 2);
		
		let startPage = Math.max(2, props.currentPage - halfPagesToShow);
		let endPage = Math.min(props.totalPages - 1, startPage + pagesToShow - 1);
		
		// Adjust if we're near the end
		if (endPage - startPage < pagesToShow - 1) {
			startPage = Math.max(2, endPage - pagesToShow + 1);
		}
		
		// Add pages around current page
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		
		// Always show last page
		if (props.totalPages > 1) {
			pages.push(props.totalPages);
		}
	}
	
	return [...new Set(pages)].sort((a, b) => a - b);
});

const showEllipsis = computed(() => {
	return props.totalPages > props.maxVisiblePages && 
		   props.currentPage < props.totalPages - Math.floor(props.maxVisiblePages / 2);
});

const goToPage = (page: number) => {
	emit('page-change', page);
	if (props.scrollToTop) {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
};

const goToPreviousPage = () => {
	if (props.currentPage > 1) {
		goToPage(props.currentPage - 1);
	}
};

const goToNextPage = () => {
	if (props.currentPage < props.totalPages) {
		goToPage(props.currentPage + 1);
	}
};
</script>

<style module>
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	padding: 0 clamp(8px, 2vw, 16px);
	margin-top: 32px;
}

.paginationBtn {
	min-width: 40px;
	height: 40px;
	padding: 8px 12px;
	border: none;
	background: transparent;
	color: #2c2c2c;
	font-size: 14px;
	font-weight: 500;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
}

.paginationBtn:hover:not(:disabled):not(.active) {
	background: #f3f4f6;
}

.paginationBtn:disabled {
	color: #d1d5db;
	cursor: not-allowed;
}

.paginationBtn.active {
	background: var(--color-main);
	color: white;
	font-weight: 600;
}

.paginationArrow {
	color: #6b7280;
	font-size: 14px;
}

.paginationArrow:hover:not(:disabled) {
	color: #2c2c2c;
	background: #f3f4f6;
}

.arrowIcon {
	width: 16px;
	height: 16px;
	flex-shrink: 0;
}

.paginationBtn:disabled .arrowIcon {
	opacity: 0.3;
}

.ellipsis {
	padding: 0 8px;
	color: #6b7280;
	font-size: 14px;
	display: flex;
	align-items: center;
}

@media (max-width: 768px) {
	.pagination {
		gap: 4px;
		margin-top: 24px;
	}
	
	.paginationBtn {
		min-width: 36px;
		height: 36px;
		padding: 6px 10px;
		font-size: 12px;
	}
	
	.arrowIcon {
		width: 14px;
		height: 14px;
	}
}
</style>
