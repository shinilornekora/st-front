<template>
	<!-- Success Alert Popup with Backdrop -->
	<transition name="fade">
		<div
			v-if="modelValue"
			:class="$style.alertBackdrop"
			@click="handleClose"
		>
			<div :class="$style.successAlert" @click.stop>
				<img :src="successCheckIcon" alt="" :class="$style.alertIcon" />
				<div :class="$style.alertContent">
					<div :class="$style.alertTitle">{{ title }}</div>
					<div :class="$style.alertText">
						<slot>
							<p>{{ $t('profile.applicationPendingText') }}</p>
							<p>{{ $t('profile.applicationPendingText2') }}</p>
							<p>{{ $t('profile.applicationPendingText3') }}</p>
						</slot>
					</div>
				</div>
				<button
					:class="$style.alertClose"
					@click="handleClose"
					:aria-label="t('modal.close')"
				>
					<img :src="crossIcon" alt="" :class="$style.closeIcon" />
				</button>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { useI18n } from 'vue-i18n';
	import successCheckIcon from '@assets/success_check.svg';
	import crossIcon from '@assets/cross.svg';

	const { t } = useI18n();

	defineProps<{
		modelValue: boolean;
		title?: string;
	}>();

	const emit = defineEmits<{
		(e: 'update:modelValue', value: boolean): void;
	}>();

	const handleClose = () => {
		emit('update:modelValue', false);
	};
</script>

<style module>
	@import './theme.module.css';

	.alertBackdrop {
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

	.successAlert {
		width: 90%;
		max-width: 400px;
		min-height: 84px;
		background: var(--background-default);
		border: 1px solid var(--color-success-light);
		border-radius: 16px;
		display: flex;
		align-items: flex-start;
		padding: 16px;
		gap: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
		position: relative;
		animation: slideIn 0.3s ease-out;
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

	.alertIcon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		margin-top: 0;
	}

	.alertContent {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: left;
	}

	.alertTitle {
		font-size: 16px;
		font-weight: 600;
		color: var(--color-primary);
		line-height: 1.2;
		text-align: left;
	}

	.alertText {
		font-size: 12px;
		font-weight: 400;
		color: var(--color-secondary);
		line-height: 1.4;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.alertText :global(p) {
		margin: 0;
		font-size: 12px;
		font-weight: 400;
		color: var(--color-secondary);
		line-height: 1.4;
		text-align: left;
	}

	.alertClose {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: opacity 0.2s;
		position: absolute;
		top: 16px;
		right: 16px;
	}

	.alertClose:hover {
		opacity: 0.7;
	}

	.closeIcon {
		width: 16px;
		height: 16px;
	}

	/* Transition for backdrop */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
