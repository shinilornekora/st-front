<template>
	<transition name="fade">
		<div v-if="modelValue" :class="$style.modalBackdrop" @click="close">
			<div :class="$style.editProfileModal" @click.stop>
				<div :class="$style.modalHeader">
					<h2 :class="$style.modalTitle">
						{{ t('editProfile.title') }}
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
					<form @submit.prevent="handleSave">
						<div :class="$style.formGroup">
							<label :class="$style.formLabel">
								{{ t('editProfile.fullName') }}
							</label>
							<Input
								v-model="form.fullName"
								:placeholder="t('editProfile.fullName')"
								:variant="errors.fullName ? 'error' : 'default'"
								:error="Boolean(errors.fullName)"
								:class="$style.formInput"
							/>
							<div
								v-if="errors.fullName"
								:class="$style.errorText"
							>
								{{ errors.fullName }}
							</div>
						</div>

						<div :class="$style.formGroup">
							<label :class="$style.formLabel">
								{{ t('editProfile.email') }}
							</label>
							<Input
								v-model="form.email"
								type="email"
								:placeholder="t('editProfile.email')"
								:variant="errors.email ? 'error' : 'default'"
								:error="Boolean(errors.email)"
								:class="$style.formInput"
							/>
							<div v-if="errors.email" :class="$style.errorText">
								{{ errors.email }}
							</div>
						</div>

						<div :class="$style.formGroup">
							<label :class="$style.formLabel">
								{{ t('editProfile.phone') }}
							</label>
							<Input
								v-model="form.phone"
								:placeholder="t('editProfile.phone')"
								:variant="errors.phone ? 'error' : 'default'"
								:error="Boolean(errors.phone)"
								:class="$style.formInput"
							/>
							<div v-if="errors.phone" :class="$style.errorText">
								{{ errors.phone }}
							</div>
						</div>

						<div v-if="saveError" :class="$style.saveError">
							{{ saveError }}
						</div>

						<Button
							type="accent"
							type-attr="submit"
							variant="filled"
							size="large"
							:disabled="isSaving"
							:class="$style.submitButton"
						>
							{{
								isSaving
									? t('common.loading')
									: t('common.save')
							}}
						</Button>
					</form>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { ref, watch } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { useStore } from 'effector-vue/composition';
	import { $user, updateProfileFx } from '@entities/user/user.store';
	import { showToast } from '@shared/model';
	import Input from '@shared/ui/Input.vue';
	import Button from '@shared/ui/Button.vue';
	import crossIcon from '@assets/cross.svg';

	const { t } = useI18n();

	interface Props {
		modelValue: boolean;
	}

	const props = defineProps<Props>();
	const emit = defineEmits<{
		'update:modelValue': [value: boolean];
		saved: [];
	}>();

	const user = useStore($user);

	const form = ref({ fullName: '', email: '', phone: '' });
	const errors = ref({ fullName: '', email: '', phone: '' });
	const isSaving = ref(false);
	const saveError = ref('');

	watch(
		() => props.modelValue,
		(open) => {
			if (open && user.value) {
				form.value = {
					fullName: user.value.fullName ?? '',
					email: user.value.email ?? '',
					phone: user.value.phone ?? '',
				};
				errors.value = { fullName: '', email: '', phone: '' };
				saveError.value = '';
			}
		},
	);

	const validate = (): boolean => {
		errors.value = { fullName: '', email: '', phone: '' };
		let valid = true;

		if (form.value.fullName && form.value.fullName.length < 2) {
			errors.value.fullName = t('validation.nameMinLength');
			valid = false;
		}

		if (form.value.email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(form.value.email)) {
				errors.value.email = t('validation.emailInvalid');
				valid = false;
			}
		}

		if (form.value.phone) {
			const phoneRegex = /^[\d\s+\-()]+$/;
			if (
				!phoneRegex.test(form.value.phone) ||
				form.value.phone.replace(/\D/g, '').length < 10
			) {
				errors.value.phone = t('validation.phoneInvalid');
				valid = false;
			}
		}

		return valid;
	};

	const handleSave = async () => {
		if (!validate()) return;

		isSaving.value = true;
		saveError.value = '';

		try {
			await updateProfileFx({
				fullName: form.value.fullName || undefined,
				email: form.value.email || undefined,
				phone: form.value.phone || undefined,
			});
			showToast({
				message: t('editProfile.saveSuccess'),
				type: 'success',
			});
			emit('saved');
			close();
		} catch (err) {
			saveError.value =
				err instanceof Error ? err.message : t('editProfile.saveError');
		} finally {
			isSaving.value = false;
		}
	};

	const close = () => {
		emit('update:modelValue', false);
	};
</script>

<style module>
	@import '@shared/ui/theme.module.css';

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

	.editProfileModal {
		width: 90%;
		max-width: 480px;
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

	.formInput {
		width: 100%;
	}

	.errorText {
		font-size: 12px;
		color: var(--color-error-main);
		margin-top: 4px;
		text-align: left;
	}

	.saveError {
		font-size: 14px;
		color: var(--color-error-main);
		padding: 10px 14px;
		background: #fff5f5;
		border-radius: 8px;
		border: 1px solid #fed7d7;
		margin-bottom: 16px;
		text-align: left;
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
		.editProfileModal {
			width: 95%;
		}

		.modalHeader {
			padding: 20px;
		}

		.modalTitle {
			font-size: 18px;
		}

		.formContent {
			padding: 20px;
		}
	}
</style>
