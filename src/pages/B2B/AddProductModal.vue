<template>
	<div v-if="isOpen" :class="$style.overlay" @click="handleOverlayClick">
		<div :class="$style.modal" @click.stop>
			<div :class="$style.modalContent">
				<!-- Название товара -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.productName') }}</label>
					<Input
						v-model="formData.name"
						:placeholder="t('b2b.form.placeholders.productName')"
						:class="$style.input"
					/>
				</div>

				<!-- Артикул -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.article') }}</label>
					<Input
						v-model="formData.article"
						:placeholder="t('b2b.form.placeholders.article')"
						:class="$style.input"
					/>
				</div>

				<!-- Цена -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.price') }}</label>
					<Input
						v-model="formData.price"
						type="number"
						:placeholder="t('b2b.form.placeholders.price')"
						:class="$style.input"
					/>
				</div>

				<!-- Цена с учетом скидки -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.discountPrice') }}</label>
					<Input
						v-model="formData.discountPrice"
						type="number"
						:placeholder="t('b2b.form.placeholders.discountPrice')"
						:class="$style.input"
					/>
				</div>

				<!-- Размеры -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.sizes') }}</label>
					<div :class="$style.checkboxGroup">
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.sizes.small"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('b2b.form.sizeSmall') }}</span>
						</label>
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.sizes.medium"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('b2b.form.sizeMedium') }}</span>
						</label>
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.sizes.large"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('b2b.form.sizeLarge') }}</span>
						</label>
					</div>
				</div>

				<!-- Цвет -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.color') }}</label>
					<div :class="$style.checkboxGroup">
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.colors.white"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('filters.colorsCapitalized.white') }}</span>
						</label>
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.colors.black"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('filters.colorsCapitalized.black') }}</span>
						</label>
						<label :class="$style.checkboxLabel">
							<input
								v-model="formData.colors.red"
								type="checkbox"
								:class="$style.checkbox"
							/>
							<span :class="$style.checkmark"></span>
							<span>{{ t('filters.colorsCapitalized.red') }}</span>
						</label>
					</div>
				</div>

				<!-- Состав -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.composition') }}</label>
					<Input
						v-model="formData.composition"
						:placeholder="t('b2b.form.placeholders.composition')"
						:class="$style.input"
					/>
				</div>

				<!-- Пол -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.gender') }}</label>
					<Select
						v-model="formData.gender"
						:options="genderOptions"
						:placeholder="t('b2b.form.placeholders.gender')"
						:class="$style.select"
					/>
				</div>

				<!-- Дополнительная информация -->
				<div :class="$style.field">
					<div :class="$style.additionalInfoHeader">
						<label :class="$style.label">
							{{ t('b2b.form.additionalInfo') }}
						</label>
						<button
							type="button"
							:class="$style.addInfoButton"
							@click="addAdditionalInfoRow"
						>
							{{ t('b2b.form.addInfoField') }}
						</button>
					</div>
					<div
						v-for="(row, index) in additionalInfoRows"
						:key="`additional-${index}`"
						:class="$style.additionalInfoRow"
					>
						<Input
							v-model="row.key"
							:placeholder="t('b2b.form.placeholders.additionalInfoKey')"
							:class="$style.input"
						/>
						<Input
							v-model="row.value"
							:placeholder="t('b2b.form.placeholders.additionalInfoValue')"
							:class="$style.input"
						/>
						<button
							type="button"
							:class="$style.removeInfoButton"
							@click="removeAdditionalInfoRow(index)"
						>
							{{ t('common.delete') }}
						</button>
					</div>
				</div>

				<!-- Добавить изображения -->
				<div :class="$style.field">
					<label :class="$style.label">{{ t('b2b.form.images') }}</label>
					<div :class="$style.uploadArea">
						<input
							id="fileUpload"
							type="file"
							multiple
							accept="image/*"
							:class="$style.fileInput"
							@change="handleFileUpload"
						/>
						<label for="fileUpload" :class="$style.uploadLabel">
							<svg
								width="48"
								height="48"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
								/>
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							<div :class="$style.uploadText">
								<div>{{ t('b2b.form.dropFiles') }}</div>
							</div>
						</label>
					</div>
					<div
						v-if="imagePreviews.length > 0"
						:class="$style.uploadedFiles"
					>
						<div :class="$style.uploadedHeader">
							<p :class="$style.uploadedTitle">
								{{
									t('b2b.form.selectedImagesCount', {
										count: imagePreviews.length,
									})
								}}
							</p>
							<button
								type="button"
								:class="$style.clearFilesButton"
								@click="clearUploadedImages"
							>
								{{ t('ui.clear') }}
							</button>
						</div>
						<ul :class="$style.uploadedList">
							<li
								v-for="(preview, index) in imagePreviews"
								:key="`${preview.name}-${index}`"
								:class="$style.uploadedItem"
							>
								<img
									:src="preview.url"
									:alt="preview.name"
									:class="$style.uploadedThumb"
								/>
								<span :class="$style.uploadedName">
									{{ preview.name }}
								</span>
							</li>
						</ul>
					</div>
				</div>

				<!-- Кнопки -->
				<div :class="$style.actions">
					<button :class="$style.saveButton" @click="handleSave">
						{{ t('common.save') }}
					</button>
					<button
						:class="$style.previewButton"
						@click="handlePreview"
					>
						{{ t('b2b.form.preview') }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, watch, onUnmounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { Input, Select } from '@shared/ui';
	import {
		setPreviewProduct,
		setPreviewFormData,
	} from '@entities/product/product.store';

	const router = useRouter();
	const { t } = useI18n();

	const props = defineProps<{
		isOpen: boolean;
		editData?: any;
		initialFormData?: any;
	}>();

	const emit = defineEmits<{
		close: [];
		save: [data: any];
	}>();

	const createEmptyFormData = () => ({
		name: '',
		article: '',
		price: '',
		discountPrice: '',
		sizes: {
			small: false,
			medium: false,
			large: false,
		},
		colors: {
			white: false,
			black: false,
			red: false,
		},
		composition: '',
		gender: '',
		images: [] as File[],
	});
	const formData = reactive(createEmptyFormData());
	const imagePreviews = ref<Array<{ name: string; url: string }>>([]);
	const additionalInfoRows = ref<Array<{ key: string; value: string }>>([
		{ key: '', value: '' },
	]);

	const recordToAdditionalRows = (
		value: unknown,
	): Array<{ key: string; value: string }> => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			return [{ key: '', value: '' }];
		}
		const rows = Object.entries(value)
			.map(([key, rowValue]) => ({
				key: String(key),
				value: String(rowValue),
			}))
			.filter((row) => row.key.trim().length > 0);

		return rows.length > 0 ? rows : [{ key: '', value: '' }];
	};

	const additionalRowsToRecord = (): Record<string, string> => {
		const entries = additionalInfoRows.value
			.map((row) => [row.key.trim(), row.value.trim()] as const)
			.filter(([key, value]) => key.length > 0 && value.length > 0);
		return Object.fromEntries(entries);
	};

	const revokeImagePreviews = () => {
		imagePreviews.value.forEach((preview) => {
			URL.revokeObjectURL(preview.url);
		});
		imagePreviews.value = [];
	};

	const syncImagePreviews = (files: File[]) => {
		revokeImagePreviews();
		imagePreviews.value = files.map((file) => ({
			name: file.name,
			url: URL.createObjectURL(file),
		}));
	};

	const applyFormData = (source: any) => {
		formData.name = source?.name || '';
		formData.article = source?.article || '';
		formData.price = source?.price?.toString() || '';
		formData.discountPrice = source?.discountPrice?.toString() || '';
		formData.composition = source?.composition || '';
		formData.gender = source?.gender || '';
		formData.sizes = source?.sizes
			? { ...source.sizes }
			: { small: false, medium: false, large: false };
		formData.colors = source?.colors
			? { ...source.colors }
			: { white: false, black: false, red: false };
		formData.images = Array.isArray(source?.images)
			? [...source.images]
			: [];
		additionalInfoRows.value = recordToAdditionalRows(source?.additionalInfo);
		syncImagePreviews(formData.images);
	};

	// Watch for edit data / restored preview data changes and populate form
	watch(
		() => [props.initialFormData, props.editData, props.isOpen] as const,
		([initialFormData, editData, isOpen]) => {
			if (!isOpen) return;
			if (initialFormData) {
				applyFormData(initialFormData);
				return;
			}
			if (editData) {
				applyFormData(editData);
				return;
			}
			applyFormData(createEmptyFormData());
		},
		{ immediate: true },
	);

	const genderOptions = [
		{ value: 'male', label: t('filters.male') },
		{ value: 'female', label: t('filters.female') },
		{ value: 'unisex', label: t('filters.unisex') },
	];

	const handleOverlayClick = () => {
		emit('close');
	};

	const handleFileUpload = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			formData.images = Array.from(target.files);
			syncImagePreviews(formData.images);
		}
	};

	const clearUploadedImages = () => {
		formData.images = [];
		syncImagePreviews(formData.images);
	};

	const addAdditionalInfoRow = () => {
		additionalInfoRows.value.push({ key: '', value: '' });
	};

	const removeAdditionalInfoRow = (index: number) => {
		additionalInfoRows.value.splice(index, 1);
		if (additionalInfoRows.value.length === 0) {
			additionalInfoRows.value.push({ key: '', value: '' });
		}
	};

	const handleSave = () => {
		emit('save', {
			...formData,
			additionalInfo: additionalRowsToRecord(),
		});
		emit('close');
	};

	const handlePreview = () => {
		const selectedSizes = Object.entries(formData.sizes)
			.filter(([, isSelected]) => Boolean(isSelected))
			.map(([size]) => size);
		const selectedColors = Object.entries(formData.colors)
			.filter(([, isSelected]) => Boolean(isSelected))
			.map(([color]) => color);
		const colorTags = selectedColors.map((color) => ({
			id: `color-${color}`,
			name: t(`filters.colors.${color}`, color),
		}));

		// Создаем объект товара из данных формы для превью
		const previewProduct = {
			id: props.editData?.id || 999999, // Временный ID для превью
			name: formData.name || t('b2b.form.previewProductName'),
			slug: 'preview',
			description: formData.composition || t('b2b.form.previewProductDescription'),
			price: parseFloat(formData.price) || 0,
			currency: '₽' as const,
			inStock: true,
			category: [],
			tags: colorTags,
			images:
				formData.images.length > 0
					? formData.images.map((file) => URL.createObjectURL(file))
					: ['https://via.placeholder.com/400x600'],
			sizes: selectedSizes,
			stockStatus: 'in_stock' as const,
			gender: (formData.gender || 'unisex') as
				| 'male'
				| 'female'
				| 'unisex',
			seller: { id: 1, name: t('b2b.form.previewSeller') },
			discount:
				formData.discountPrice && formData.price
					? Math.round(
							(1 -
								parseFloat(formData.discountPrice) /
									parseFloat(formData.price)) *
								100,
						)
					: undefined,
			article: formData.article || t('b2b.form.previewArticle'),
			additionalInfo: additionalRowsToRecord(),
		};

		// Сохраняем товар в Effector store
		setPreviewProduct(previewProduct);

		// Сохраняем данные формы для возможности вернуться к редактированию
		setPreviewFormData({
			...formData,
			sizes: { ...formData.sizes },
			colors: { ...formData.colors },
			images: [...formData.images],
			additionalInfo: additionalRowsToRecord(),
			editData: props.editData, // Сохраняем также editData если редактируем
		});

		// Закрываем модалку
		emit('close');

		// Переходим на страницу превью
		router.push('/product/preview');
	};

	onUnmounted(() => {
		revokeImagePreviews();
	});
</script>

<style module>
	@import '@shared/ui/theme.module.css';

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 20px;
	}

	.modal {
		background: var(--background-default);
		border-radius: 16px;
		width: 100%;
		max-width: 600px;
		max-height: 90vh;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.modalContent {
		padding: 32px;
		max-height: 90vh;
		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;
	}

	.field {
		margin-bottom: 24px;
	}

	.label {
		display: block;
		font-size: 16px;
		font-weight: 400;
		color: var(--color-primary);
		margin-bottom: 8px;
		text-align: left;
	}

	.input {
		width: 100%;
	}

	.select {
		width: 100%;
	}

	.additionalInfoHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.additionalInfoRow {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 8px;
		margin-bottom: 8px;
		align-items: center;
	}

	.addInfoButton,
	.removeInfoButton {
		border: none;
		background: transparent;
		color: var(--color-secondary);
		cursor: pointer;
		font-size: 13px;
		text-decoration: underline;
		padding: 0;
	}

	.checkboxGroup {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.checkboxLabel {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		font-size: 14px;
		color: var(--color-primary);
		position: relative;
		padding-left: 32px;
	}

	.checkbox {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkmark {
		position: absolute;
		left: 0;
		height: 20px;
		width: 20px;
		background-color: white;
		border: 2px solid #d1d5db;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.checkboxLabel:hover .checkmark {
		border-color: var(--color-accent);
	}

	.checkbox:checked ~ .checkmark {
		background-color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.checkmark:after {
		content: '';
		position: absolute;
		display: none;
	}

	.checkbox:checked ~ .checkmark:after {
		display: block;
	}

	.checkboxLabel .checkmark:after {
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.uploadArea {
		border: 2px dashed #d1d5db;
		border-radius: 12px;
		padding: 32px;
		transition: border-color 0.2s;
	}

	.uploadArea:hover {
		border-color: var(--color-accent);
	}

	.fileInput {
		display: none;
	}

	.uploadLabel {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		cursor: pointer;
		color: #9ca3af;
	}

	.uploadLabel svg {
		color: #d1d5db;
	}

	.uploadText {
		font-size: 14px;
		line-height: 1.5;
		text-align: left;
	}

	.uploadedFiles {
		margin-top: 16px;
	}

	.uploadedHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.uploadedTitle {
		margin: 0;
		font-size: 14px;
		color: var(--color-primary);
		text-align: left;
	}

	.clearFilesButton {
		border: none;
		background: transparent;
		padding: 0;
		font-size: 13px;
		color: var(--color-secondary);
		cursor: pointer;
		text-decoration: underline;
	}

	.uploadedList {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 10px;
	}

	.uploadedItem {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.uploadedThumb {
		width: 100%;
		height: 94px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.uploadedName {
		font-size: 12px;
		color: var(--color-secondary);
		text-align: left;
		word-break: break-word;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 32px;
	}

	.saveButton {
		width: 100%;
		padding: 14px 24px;
		background: var(--color-accent);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.saveButton:hover {
		background: var(--color-focus);
	}

	.saveButton:active {
		transform: scale(0.98);
	}

	.previewButton {
		width: 100%;
		padding: 0;
		background: transparent;
		color: var(--color-primary);
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		text-decoration: underline;
		transition: color 0.2s;
		text-align: left;
	}

	.previewButton:hover {
		color: var(--color-accent);
	}

	/* Scrollbar styling */
	.modalContent::-webkit-scrollbar {
		width: 8px;
	}

	.modalContent::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 8px;
	}

	.modalContent::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 8px;
	}

	.modalContent::-webkit-scrollbar-thumb:hover {
		background: #9ca3af;
	}

	@media (max-width: 768px) {
		.modalContent {
			padding: 24px;
		}

		.label {
			font-size: 14px;
		}

		.uploadArea {
			padding: 24px;
		}

		.uploadText {
			font-size: 13px;
		}

		.additionalInfoRow {
			grid-template-columns: 1fr;
		}
	}
</style>
