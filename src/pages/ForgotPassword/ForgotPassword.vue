<template>
	<div :class="$style.page">
		<Header />

		<main :class="$style.main">
			<div :class="$style.container">
				<div :class="$style.card">
					<h1 :class="$style.title">
						{{ t('forgotPassword.title') }}
					</h1>
					<p :class="$style.subtitle">
						{{ t('forgotPassword.subtitle') }}
					</p>

					<template v-if="!submitted">
						<form @submit.prevent="handleSubmit">
							<div :class="$style.formGroup">
								<label :class="$style.formLabel">
									{{ t('auth.email') }}
								</label>
								<Input
									v-model="email"
									type="email"
									:placeholder="t('auth.email')"
									:variant="emailError ? 'error' : 'default'"
									:error="Boolean(emailError)"
									:class="$style.formInput"
								/>
								<div
									v-if="emailError"
									:class="$style.errorText"
								>
									{{ emailError }}
								</div>
							</div>

							<div v-if="serverError" :class="$style.serverError">
								{{ serverError }}
							</div>

							<Button
								type="accent"
								type-attr="submit"
								variant="filled"
								size="large"
								:disabled="isLoading"
								:class="$style.submitButton"
							>
								{{
									isLoading
										? t('common.loading')
										: t('forgotPassword.send')
								}}
							</Button>
						</form>
					</template>

					<template v-else>
						<div :class="$style.successBlock">
							<p :class="$style.successText">
								{{ t('forgotPassword.successText') }}
							</p>
						</div>
					</template>

					<button :class="$style.backLink" @click="goBack">
						← {{ t('common.back') }}
					</button>
				</div>
			</div>
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useI18n } from 'vue-i18n';
	import { Header, Footer } from '@widgets';
	import Input from '@shared/ui/Input.vue';
	import Button from '@shared/ui/Button.vue';
	import { forgotPassword } from '@shared/api/auth.api';

	const { t } = useI18n();
	const router = useRouter();

	const email = ref('');
	const emailError = ref('');
	const serverError = ref('');
	const isLoading = ref(false);
	const submitted = ref(false);

	const validate = (): boolean => {
		emailError.value = '';
		if (!email.value) {
			emailError.value = t('validation.emailRequired');
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.value)) {
			emailError.value = t('validation.emailInvalid');
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		isLoading.value = true;
		serverError.value = '';

		try {
			const response = await forgotPassword(email.value);
			if (response.success) {
				submitted.value = true;
			} else {
				serverError.value =
					response.error ?? t('forgotPassword.sendError');
			}
		} catch {
			serverError.value = t('forgotPassword.sendError');
		} finally {
			isLoading.value = false;
		}
	};

	const goBack = () => {
		router.back();
	};
</script>

<style module>
	@import '@shared/ui/theme.module.css';

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--background-default);
	}

	@media (max-width: 480px) {
		.page {
			padding-bottom: 46px;
		}
	}

	.main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 16px;
	}

	.container {
		width: 100%;
		max-width: 440px;
	}

	.card {
		background: var(--background-default);
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		padding: 40px 32px;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.title {
		font-size: 24px;
		font-weight: 600;
		color: var(--color-primary);
		margin: 0 0 8px;
		text-align: left;
	}

	.subtitle {
		font-size: 15px;
		color: var(--color-secondary);
		margin: 0 0 28px;
		text-align: left;
		line-height: 1.5;
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

	.serverError {
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

	.successBlock {
		padding: 20px 0;
	}

	.successText {
		font-size: 15px;
		color: var(--color-primary);
		line-height: 1.6;
		text-align: left;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 8px;
		padding: 16px;
	}

	.backLink {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 14px;
		color: var(--color-secondary);
		padding: 0;
		margin-top: 20px;
		text-align: left;
		transition: color 0.2s;
	}

	.backLink:hover {
		color: var(--color-primary);
	}

	@media (max-width: 480px) {
		.card {
			padding: 28px 20px;
			border-radius: 12px;
			box-shadow: none;
		}

		.title {
			font-size: 20px;
		}
	}
</style>
