<template>
	<div :class="$style.page">
		<Header :user-role="'partner'" @search="handleSearch" />

		<main :class="$style.main">
			<div :class="$style.container">
				<!-- Tabs Navigation -->
				<div :class="$style.tabsWrapper">
					<div :class="$style.tabs">
						<button
							:class="[
								$style.tab,
								{
									[$style.tabActive]:
										activeTab === 'analytics',
								},
							]"
							@click="activeTab = 'analytics'"
						>
							{{ t('b2b.analytics') }}
						</button>
						<button
							:class="[
								$style.tab,
								{
									[$style.tabActive]:
										activeTab === 'products',
								},
							]"
							@click="activeTab = 'products'"
						>
							{{ t('b2b.productsList') }}
						</button>
					</div>
				</div>

				<!-- Tab Content -->
				<div :class="$style.content">
					<!-- Analytics Tab -->
					<div
						v-if="activeTab === 'analytics'"
						:class="$style.tabContent"
					>
						<div v-if="isLoading" :class="$style.loading">
							{{ t('b2b.loading') }}
						</div>
						<div v-else-if="revenueData && productsSoldData">
							<!-- Stats Cards -->
							<div :class="$style.statsGrid">
								<!-- Revenue Card -->
								<RevenueChart
									:chart-data="revenueData"
									:products-data="productsData"
									:selected-product-ids="selectedProductIds"
									:period="revenuePeriod"
									:product-colors="productColors"
									@update:period="revenuePeriod = $event"
									@load-data="loadRevenueAnalytics"
								/>

								<!-- Products Sold Card -->
								<ProductsSoldChart
									:chart-data="productsSoldData"
									:products-data="productsData"
									:selected-product-ids="selectedProductIds"
									:period="productsPeriod"
									:product-colors="productColors"
									@update:period="productsPeriod = $event"
									@load-data="loadProductsAnalytics"
								/>
							</div>

							<!-- Products Table -->
							<div :class="$style.tableSection">
								<table :class="$style.table">
									<thead>
										<tr>
											<th :class="$style.th">
												{{ t('b2b.productName') }}
											</th>
											<th :class="$style.th">
												{{ t('b2b.price') }}
											</th>
											<th :class="$style.th">
												{{ t('b2b.sold') }}
											</th>
											<th :class="$style.th">
												{{ t('b2b.revenue') }}
											</th>
											<th :class="$style.th">
												{{ t('b2b.dynamics') }}
											</th>
											<th :class="$style.th">
												{{ t('b2b.stock') }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="product in productsData"
											:key="product.id"
											:class="[
												$style.tr,
												{
													[$style.trSelected]:
														selectedProductIds.includes(
															product.id,
														),
												},
											]"
											@click="toggleProduct(product.id)"
										>
											<td :class="$style.td">
												<div
													:class="$style.productCell"
												>
													<div
														:class="
															$style.productImage
														"
													></div>
													<div
														:class="
															$style.productInfo
														"
													>
														<div
															:class="
																$style.productName
															"
														>
															{{ product.name }}
														</div>
														<div
															:class="
																$style.productArticle
															"
														>
															({{
																t(
																	'b2b.articleShort',
																)
															}}
															{{
																product.article
															}})
														</div>
													</div>
												</div>
											</td>
											<td :class="$style.td">
												{{
													product.price.toLocaleString(
														'ru-RU',
													)
												}}
												₽
											</td>
											<td :class="$style.td">
												{{ product.sold }}
												{{
													t('b2b.sold').split(' ')[1]
												}}
											</td>
											<td :class="$style.td">
												{{
													product.revenue.toLocaleString(
														'ru-RU',
													)
												}}
												₽
											</td>
											<td :class="$style.td">
												<span
													:class="$style.dynamics"
													>{{
														product.dynamics
													}}</span
												>
											</td>
											<td :class="$style.td">
												{{ product.stock }}
												{{
													t('b2b.sold').split(' ')[1]
												}}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<!-- Products Tab -->
					<div
						v-if="activeTab === 'products'"
						:class="$style.tabContent"
					>
						<div v-if="isLoadingProducts" :class="$style.loading">
							{{ t('b2b.loading') }}
						</div>
						<div
							v-else-if="products.length > 0"
							:class="$style.productsListWrapper"
						>
							<!-- Products Table -->
							<div :class="$style.productsTableSection">
								<table :class="$style.productsTable">
									<thead>
										<tr>
											<th :class="$style.productsTableTh">
												{{ t('cart.article') }}
											</th>
											<th :class="$style.productsTableTh">
												{{ t('b2b.productName') }}
											</th>
											<th :class="$style.productsTableTh">
												{{ t('filters.price') }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="product in filteredProducts"
											:key="product.id"
											:class="[
												$style.productsTableTr,
												{
													[$style.productsTableTrSelected]:
														selectedProductId ===
														product.id,
												},
											]"
											@click="selectProduct(product.id)"
										>
											<td :class="$style.productsTableTd">
												({{ t('b2b.articleShort') }}
												{{ product.article }})
											</td>
											<td :class="$style.productsTableTd">
												{{ product.name }}
											</td>
											<td :class="$style.productsTableTd">
												{{
													product.price.toLocaleString(
														'ru-RU',
														{
															minimumFractionDigits: 0,
														},
													)
												}}
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							<!-- Action Controls -->
							<div
								ref="actionControlsRef"
								:class="[
									$style.actionControls,
									{
										[$style.actionControlsDragging]:
											isDragging,
										[$style.actionControlsHolding]:
											isHolding,
									},
								]"
								:style="actionControlsStyle"
								@mousedown="handleMouseDown"
								@touchstart="handleTouchStart"
							>
								<!-- Hold Progress Indicator -->
								<div
									v-if="isHolding"
									:class="$style.holdProgress"
								></div>
								<button
									:class="$style.actionBtn"
									:aria-label="t('b2b.addProduct')"
									@click="handleAddClick"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<rect
											x="3"
											y="3"
											width="18"
											height="18"
											rx="2"
										/>
										<line x1="12" y1="8" x2="12" y2="16" />
										<line x1="8" y1="12" x2="16" y2="12" />
									</svg>
								</button>
								<button
									:class="[
										$style.actionBtn,
										{
											[$style.actionBtnDisabled]:
												!selectedProductId,
										},
									]"
									:disabled="!selectedProductId"
									:aria-label="t('b2b.editProduct')"
									@click="handleEditClick"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
										/>
										<path
											d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
										/>
									</svg>
								</button>
								<button
									:class="[
										$style.actionBtn,
										{
											[$style.actionBtnDisabled]:
												!selectedProductId,
										},
									]"
									:disabled="!selectedProductId"
									:aria-label="t('b2b.deleteProduct')"
									@click="handleDeleteClick"
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<polyline points="3 6 5 6 21 6" />
										<path
											d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<Footer :user-role="'partner'" />

		<!-- Add/Edit Product Modal -->
		<AddProductModal
			:is-open="isAddModalOpen"
			:edit-data="editingProduct"
			@close="handleModalClose"
			@save="handleModalSave"
		/>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
	import { useStore } from 'effector-vue/composition';
	import { useI18n } from 'vue-i18n';
	import { useRoute } from 'vue-router';
	import { Header, Footer } from '../../widgets';
	import { getAnalyticsDashboard, getSellerProducts } from '@shared/api';
	import type { AnalyticsDashboard, ProductListItem } from '@shared/api';
	import {
		$previewFormData,
		clearPreviewFormData,
	} from '@entities/product/product.store';
	import AddProductModal from './AddProductModal.vue';
	import RevenueChart from './RevenueChart.vue';
	import ProductsSoldChart from './ProductsSoldChart.vue';
	import $style from './B2B.module.css';

	const { t } = useI18n();
	const route = useRoute();
	const previewFormData = useStore($previewFormData);
	const activeTab = ref<'analytics' | 'products'>('analytics');

	// Dragging state
	const STORAGE_KEY = 'b2b-action-controls-position';
	const actionControlsRef = ref<HTMLElement | null>(null);
	const isDragging = ref(false);
	const isHolding = ref(false);
	const wasDragging = ref(false);
	const dragStartTimer = ref<number | null>(null);
	const dragPosition = ref({ x: 0, y: 0 });
	const dragOffset = ref({ x: 0, y: 0 });
	const hasCustomPosition = ref(false);

	// Load saved position from localStorage
	const loadSavedPosition = () => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const position = JSON.parse(saved);
				dragPosition.value = position;
				hasCustomPosition.value = true;
			}
		} catch (error) {
			console.error('Failed to load saved position:', error);
		}
	};

	// Save position to localStorage
	const savePosition = () => {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify(dragPosition.value),
			);
		} catch (error) {
			console.error('Failed to save position:', error);
		}
	};

	// Period selectors
	const revenuePeriod = ref('month');
	const productsPeriod = ref('month');

	// Analytics data - separated for independent reactivity
	const revenueData = ref<AnalyticsDashboard['revenue'] | null>(null);
	const productsSoldData = ref<AnalyticsDashboard['productsSold'] | null>(
		null,
	);
	const productsData = ref<AnalyticsDashboard['products']>([]);
	const isLoading = ref(false);

	// Products data
	const products = ref<ProductListItem[]>([]);
	const isLoadingProducts = ref(false);
	const selectedProductId = ref<number | null>(null);
	const searchQuery = ref('');

	// Filtered products based on search query
	const filteredProducts = computed(() => {
		if (!searchQuery.value.trim()) {
			return products.value;
		}

		const query = searchQuery.value.toLowerCase().trim();
		return products.value.filter((product) => {
			return (
				product.name.toLowerCase().includes(query) ||
				product.article.toLowerCase().includes(query) ||
				product.price.toString().includes(query)
			);
		});
	});

	// Handle search from header
	const handleSearch = (query: string) => {
		searchQuery.value = query;
	};

	// Selected products for filtering charts (multiple selection)
	const selectedProductIds = ref<number[]>([]);

	// Modal state
	const isAddModalOpen = ref(false);
	const editingProduct = ref<any>(null);

	// Colors for different product lines
	const productColors = [
		'#5fdbd1',
		'#f59e0b',
		'#8b5cf6',
		'#ec4899',
		'#10b981',
		'#3b82f6',
	];

	// Load revenue analytics data
	const loadRevenueAnalytics = async () => {
		isLoading.value = true;
		try {
			const response = await getAnalyticsDashboard({
				period: revenuePeriod.value as 'month' | 'quarter' | 'year',
				__mock: true,
			});

			if (response.success && response.data) {
				revenueData.value = response.data.revenue;
			}
		} catch (error) {
			console.error('Failed to load revenue analytics:', error);
		} finally {
			isLoading.value = false;
		}
	};

	// Load products sold analytics data
	const loadProductsAnalytics = async () => {
		isLoading.value = true;
		try {
			const response = await getAnalyticsDashboard({
				period: productsPeriod.value as 'month' | 'quarter' | 'year',
				__mock: true,
			});

			if (response.success && response.data) {
				productsSoldData.value = response.data.productsSold;
			}
		} catch (error) {
			console.error('Failed to load products analytics:', error);
		} finally {
			isLoading.value = false;
		}
	};

	// Load all analytics data initially
	const loadAnalytics = async () => {
		isLoading.value = true;
		try {
			const response = await getAnalyticsDashboard({
				period: revenuePeriod.value as 'month' | 'quarter' | 'year',
				__mock: true,
			});

			if (response.success && response.data) {
				revenueData.value = response.data.revenue;
				productsSoldData.value = response.data.productsSold;
				productsData.value = response.data.products;
			}
		} catch (error) {
			console.error('Failed to load analytics:', error);
		} finally {
			isLoading.value = false;
		}
	};

	// Load products data
	const loadProducts = async () => {
		isLoadingProducts.value = true;
		try {
			const response = await getSellerProducts({ __mock: true });

			if (response.success && response.data) {
				products.value = response.data;
			}
		} catch (error) {
			console.error('Failed to load products:', error);
		} finally {
			isLoadingProducts.value = false;
		}
	};

	// Select product
	const selectProduct = (productId: number) => {
		if (selectedProductId.value === productId) {
			// Deselect if clicking the same product
			selectedProductId.value = null;
		} else {
			selectedProductId.value = productId;
		}
	};

	// Action handlers with drag prevention
	const handleAddClick = (e: MouseEvent) => {
		if (wasDragging.value) {
			e.preventDefault();
			e.stopPropagation();
			wasDragging.value = false;
			return;
		}
		handleAdd();
	};

	const handleEditClick = (e: MouseEvent) => {
		if (wasDragging.value) {
			e.preventDefault();
			e.stopPropagation();
			wasDragging.value = false;
			return;
		}
		handleEdit();
	};

	const handleDeleteClick = (e: MouseEvent) => {
		if (wasDragging.value) {
			e.preventDefault();
			e.stopPropagation();
			wasDragging.value = false;
			return;
		}
		handleDelete();
	};

	const handleAdd = () => {
		// Check if we have saved form data from preview
		if (previewFormData.value) {
			// Restore form data
			editingProduct.value = previewFormData.value.editData || null;
			isAddModalOpen.value = true;

			// Clear the saved form data
			clearPreviewFormData();
		} else {
			editingProduct.value = null;
			isAddModalOpen.value = true;
		}
	};

	const handleModalClose = () => {
		isAddModalOpen.value = false;
		editingProduct.value = null;
	};

	const handleModalSave = (data: any) => {
		console.log('Product data saved:', data);

		if (editingProduct.value) {
			// Редактирование существующего товара
			const index = products.value.findIndex(
				(p) => p.id === editingProduct.value?.id,
			);
			if (index !== -1 && products.value[index]) {
				const currentProduct = products.value[index];
				products.value[index] = {
					id: currentProduct.id,
					name: data.name || currentProduct.name,
					article: data.article || currentProduct.article,
					price: parseFloat(data.price) || currentProduct.price,
				};
				console.log('Product updated:', products.value[index]);
			}
		} else {
			// Создаем новый товар для добавления в таблицу
			const newProduct: ProductListItem = {
				id: products.value.length + 1,
				name: data.name || 'Новый товар',
				article: data.article || 'ART-' + (products.value.length + 1),
				price: parseFloat(data.price) || 0,
			};

			// Добавляем товар в начало списка
			products.value = [newProduct, ...products.value];

			console.log('Product added to list:', newProduct);
		}
	};

	const handleEdit = () => {
		if (!selectedProductId.value) return;

		// Находим выбранный товар
		const product = products.value.find(
			(p) => p.id === selectedProductId.value,
		);
		if (product) {
			editingProduct.value = { ...product };
			isAddModalOpen.value = true;
		}
	};

	const handleDelete = () => {
		if (!selectedProductId.value) return;
		console.log('Delete product clicked:', selectedProductId.value);

		// Удаляем товар из списка
		products.value = products.value.filter(
			(p) => p.id !== selectedProductId.value,
		);
		selectedProductId.value = null;
	};

	// Dragging functionality
	const handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();

		// Show holding indicator
		isHolding.value = true;

		// Start timer for 2 seconds
		dragStartTimer.value = window.setTimeout(() => {
			startDragging(e.clientX, e.clientY);
		}, 2000);

		// Add listeners to cancel timer if mouse is released early
		document.addEventListener('mouseup', cancelDragTimer);
		document.addEventListener('mousemove', cancelDragTimer);
	};

	const handleTouchStart = (e: TouchEvent) => {
		e.preventDefault();

		const touch = e.touches[0];
		if (!touch) return;

		// Show holding indicator
		isHolding.value = true;

		// Start timer for 2 seconds
		dragStartTimer.value = window.setTimeout(() => {
			startDragging(touch.clientX, touch.clientY);
		}, 2000);

		// Add listeners to cancel timer if touch is released early
		document.addEventListener('touchend', cancelDragTimer);
		document.addEventListener('touchmove', cancelDragTimer);
	};

	const cancelDragTimer = () => {
		if (dragStartTimer.value) {
			clearTimeout(dragStartTimer.value);
			dragStartTimer.value = null;
		}

		// Hide holding indicator
		isHolding.value = false;

		document.removeEventListener('mouseup', cancelDragTimer);
		document.removeEventListener('mousemove', cancelDragTimer);
		document.removeEventListener('touchend', cancelDragTimer);
		document.removeEventListener('touchmove', cancelDragTimer);
	};

	const startDragging = (clientX: number, clientY: number) => {
		if (!actionControlsRef.value) return;

		// Hide holding indicator and start dragging
		isHolding.value = false;
		isDragging.value = true;
		wasDragging.value = true;
		hasCustomPosition.value = true;

		const rect = actionControlsRef.value.getBoundingClientRect();

		// Calculate offset from click position to element position
		dragOffset.value = {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};

		// Set initial position
		dragPosition.value = {
			x: rect.left,
			y: rect.top,
		};

		// Add move and end listeners
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging.value) return;

		e.preventDefault();

		dragPosition.value = {
			x: e.clientX - dragOffset.value.x,
			y: e.clientY - dragOffset.value.y,
		};
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (!isDragging.value) return;

		e.preventDefault();

		const touch = e.touches[0];
		if (!touch) return;

		dragPosition.value = {
			x: touch.clientX - dragOffset.value.x,
			y: touch.clientY - dragOffset.value.y,
		};
	};

	const handleMouseUp = () => {
		stopDragging();
	};

	const handleTouchEnd = () => {
		stopDragging();
	};

	const stopDragging = () => {
		isDragging.value = false;

		// Save position to localStorage
		savePosition();

		// Reset wasDragging flag after a short delay to allow click prevention
		setTimeout(() => {
			wasDragging.value = false;
		}, 100);

		// Remove listeners
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	};

	// Computed style for action controls
	const actionControlsStyle = computed(() => {
		if (!hasCustomPosition.value) {
			return undefined;
		}

		return {
			position: 'fixed' as const,
			left: `${dragPosition.value.x}px`,
			top: `${dragPosition.value.y}px`,
			right: 'auto',
			bottom: 'auto',
		};
	});

	// Toggle product selection
	const toggleProduct = (productId: number) => {
		const index = selectedProductIds.value.indexOf(productId);
		if (index > -1) {
			// Remove if already selected - create new array to trigger reactivity
			selectedProductIds.value = selectedProductIds.value.filter(
				(id) => id !== productId,
			);
		} else {
			// Add if not selected - create new array to trigger reactivity
			selectedProductIds.value = [...selectedProductIds.value, productId];
		}
	};

	// Watch tab changes to load data
	watch(activeTab, (newTab) => {
		if (newTab === 'products' && products.value.length === 0) {
			loadProducts();
		}
	});

	onMounted(() => {
		loadAnalytics();

		// Load saved action controls position
		loadSavedPosition();

		// Check if tab query parameter is set
		if (route.query.tab === 'products') {
			activeTab.value = 'products';
			// Load products if navigating directly to products tab
			if (products.value.length === 0) {
				loadProducts();
			}
		}

		// Check if we're returning from preview with saved form data
		if (previewFormData.value) {
			// Switch to products tab and open modal
			activeTab.value = 'products';

			// Wait for products to load if needed
			if (products.value.length === 0) {
				loadProducts().then(() => {
					// Open modal with restored data
					editingProduct.value =
						previewFormData.value.editData || null;
					isAddModalOpen.value = true;
				});
			} else {
				// Open modal immediately
				editingProduct.value = previewFormData.value.editData || null;
				isAddModalOpen.value = true;
			}
		}
	});

	onUnmounted(() => {
		// Clean up any active timers and listeners
		if (dragStartTimer.value) {
			clearTimeout(dragStartTimer.value);
		}

		document.removeEventListener('mouseup', cancelDragTimer);
		document.removeEventListener('mousemove', cancelDragTimer);
		document.removeEventListener('touchend', cancelDragTimer);
		document.removeEventListener('touchmove', cancelDragTimer);
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
	});
</script>
