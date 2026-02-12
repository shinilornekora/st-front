<template>
	<transition name="fade">
		<div v-if="modelValue" :class="$style.modalBackdrop" @click="close">
			<div :class="$style.requisitesModal" @click.stop>
				<!-- Main Requisites View -->
				<template v-if="!showAddForm">
					<div :class="$style.modalHeader">
						<h2 :class="$style.modalTitle">
							{{ t('modal.requisites') }}
						</h2>
						<button
							:class="$style.modalClose"
							:aria-label="t('modal.close')"
							@click="close"
						>
							<img
								:src="crossIcon"
								alt=""
								:class="$style.closeIcon"
							/>
						</button>
					</div>

					<div :class="$style.modalContent">
						<button
							:class="$style.addButton"
							@click="handleAddRequisites"
						>
							<img
								:src="docsIcon"
								alt=""
								:class="$style.addIcon"
							/>
							<span>{{ t('modal.addRequisites') }}</span>
						</button>
					</div>
				</template>

				<!-- Add Requisites Form -->
				<template v-else>
					<div :class="$style.modalHeader">
						<button
							:class="$style.backButton"
							:aria-label="t('modal.back')"
							@click="handleBack"
						>
							<img
								:src="arrowLeftIcon"
								alt=""
								:class="$style.backIcon"
							/>
						</button>
						<h2 :class="$style.modalTitle">
							{{ t('modal.addRequisites') }}
						</h2>
						<button
							:class="$style.modalClose"
							:aria-label="t('modal.close')"
							@click="close"
						>
							<img
								:src="crossIcon"
								alt=""
								:class="$style.closeIcon"
							/>
						</button>
					</div>

					<div :class="$style.formContent">
						<form @submit.prevent="handleSubmit">
							<div :class="$style.formGroup">
								<label :class="$style.formLabel">{{
									t('modal.selectCountry')
								}}</label>
								<Select
									v-model="formData.country"
									placeholder="Value"
									:options="countryOptions"
									:class="$style.formSelect"
								/>
							</div>

							<div :class="$style.formGroup">
								<label :class="$style.formLabel">{{
									t('modal.requisitesName')
								}}</label>
								<Input
									v-model="formData.name"
									placeholder="Value"
									:class="$style.formInput"
								/>
							</div>

							<div :class="$style.formGroup">
								<label :class="$style.formLabel">{{
									t('modal.bik')
								}}</label>
								<Input
									v-model="formData.bik"
									placeholder="Value"
									:class="$style.formInput"
								/>
							</div>

							<div :class="$style.formGroup">
								<label :class="$style.formLabel">{{
									t('modal.accountNumber')
								}}</label>
								<Input
									v-model="formData.account"
									placeholder="Value"
									:class="$style.formInput"
								/>
							</div>

							<div :class="$style.formGroup">
								<label :class="$style.formLabel">{{
									t('modal.fullName')
								}}</label>
								<Input
									v-model="formData.fullName"
									placeholder="Value"
									:class="$style.formInput"
								/>
							</div>

							<Button
								type="accent"
								type-attr="submit"
								variant="filled"
								size="large"
								:class="$style.submitButton"
							>
								{{ t('common.save') }}
							</Button>
						</form>
					</div>
				</template>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { ref, watch, computed } from 'vue';
	import { useI18n } from 'vue-i18n';
	import crossIcon from '@assets/cross.svg';
	import docsIcon from '@assets/docs.svg';
	import arrowLeftIcon from '@assets/arrow_left_long.svg';
	import { Input, Select, Button } from './index';

	const { t } = useI18n();

	interface Props {
		modelValue: boolean;
	}

	interface RequisitesFormData {
		country: string;
		name: string;
		bik: string;
		account: string;
		fullName: string;
	}

	const props = defineProps<Props>();
	const emit = defineEmits([
		'update:modelValue',
		'add-requisites',
		'save-requisites',
	]);

	const showAddForm = ref(false);
	const formData = ref<RequisitesFormData>({
		country: '',
		name: '',
		bik: '',
		account: '',
		fullName: '',
	});

	const countryOptions = computed(() => [
		{ value: 'ru', label: t('modal.russia') },
		{ value: 'by', label: t('modal.belarus') },
		{ value: 'kz', label: t('modal.kazakhstan') },
		{ value: 'tr', label: t('modal.turkey') },
	]);

	// Reset form when modal closes
	watch(
		() => props.modelValue,
		(newValue) => {
			if (!newValue) {
				showAddForm.value = false;
				resetForm();
			}
		},
	);

	const close = () => {
		emit('update:modelValue', false);
	};

	const handleAddRequisites = () => {
		showAddForm.value = true;
	};

	const handleBack = () => {
		showAddForm.value = false;
		resetForm();
	};

	const handleSubmit = () => {
		emit('save-requisites', { ...formData.value });
		showAddForm.value = false;
		resetForm();
		close();
	};

	const resetForm = () => {
		formData.value = {
			country: '',
			name: '',
			bik: '',
			account: '',
			fullName: '',
		};
	};
</script>

<style module>
	@import './theme.module.css';

	.modalBackdrop {
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

	.requisitesModal {
		width: 90%;
		max-width: 600px;
		background: var(--background-default);
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		animation: slideIn 0.3s ease-out;
		display: flex;
		flex-direction: column;
		max-height: 90vh;
		overflow: hidden;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modalHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 1px solid var(--background-secondary);
		flex-shrink: 0;
		gap: 12px;
	}

	.modalTitle {
		font-size: 20px;
		font-weight: 600;
		color: var(--color-primary);
		margin: 0;
		flex: 1;
		text-align: left;
	}

	.modalClose {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s;
		flex-shrink: 0;
	}

	.modalClose:hover {
		opacity: 0.7;
	}

	.closeIcon {
		width: 20px;
		height: 20px;
	}

	.modalContent {
		padding: 24px;
	}

	.addButton {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 24px;
		background: var(--background-secondary);
		border: 1px solid var(--background-secondary);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 16px;
		font-weight: 500;
		color: var(--color-primary);
	}

	.addButton:hover {
		background: var(--color-hover);
		border-color: var(--color-accent);
	}

	.addIcon {
		width: 20px;
		height: 20px;
		color: var(--color-accent);
	}
	/* Form Styles */
	.backButton {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.2s;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.backButton:hover {
		opacity: 0.7;
	}

	.backIcon {
		width: 24px;
		height: 24px;
	}

	.formContent {
		padding: 24px;
		overflow-y: auto;
		max-height: calc(90vh - 80px);
	}

	.formGroup {
		margin-bottom: 20px;
	}

	.formLabel {
		display: block;
		font-size: 14px;
		font-weight: 500;
		color: var(--color-primary);
		text-align: left;
		margin-bottom: 8px;
	}

	.formInput,
	.formSelect {
		width: 100%;
	}

	.submitButton {
		width: 100%;
		margin-top: 8px;
	}

	/* Transition */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	@media (max-width: 768px) {
		.requisitesModal {
			width: 95%;
		}

		.modalHeader {
			padding: 20px;
		}

		.modalTitle {
			font-size: 18px;
		}

		.modalContent,
		.formContent {
			padding: 20px;
		}
	}
</style>
