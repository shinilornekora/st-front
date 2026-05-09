<template>
	<div :class="$style.page">
		<Header />
		<main :class="$style.main">
			<h1>{{ t('notifications.title') }}</h1>
			<p v-if="!userSettings.notifications" :class="$style.disabledState">
				{{ t('notifications.disabled') }}
			</p>
			<ul v-else :class="$style.notificationsList">
				<li
					v-for="notification in mockNotifications"
					:key="notification.id"
					:class="$style.notificationItem"
				>
					<h3 :class="$style.notificationTitle">
						{{ notification.title }}
					</h3>
					<p :class="$style.notificationText">
						{{ notification.message }}
					</p>
				</li>
			</ul>
		</main>
		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue';
	import { useI18n } from 'vue-i18n';
	import { useStore } from 'effector-vue/composition';
	import { Header, Footer } from '@widgets/index';
	import { $userSettings } from '@entities/user/settings.store';

	const { t } = useI18n();
	const userSettings = useStore($userSettings);
	const mockNotifications = computed(() => [
		{
			id: 1,
			title: t('notifications.mock.orderTitle'),
			message: t('notifications.mock.orderMessage'),
		},
		{
			id: 2,
			title: t('notifications.mock.priceTitle'),
			message: t('notifications.mock.priceMessage'),
		},
	]);
</script>

<style module>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--background-default);
	}

	@media (max-width: 480px) {
		.page {
			padding-bottom: 46px; /* Space for mobile footer */
		}
	}

	.main {
		flex: 1;
		padding: 24px 16px;
		text-align: center;
	}

	h1 {
		font-size: 24px;
		margin-bottom: 16px;
	}

	p {
		font-size: 16px;
		color: var(--color-secondary);
	}

	.disabledState {
		max-width: 560px;
		margin: 0 auto;
		text-align: center;
	}

	.notificationsList {
		list-style: none;
		padding: 0;
		margin: 0 auto;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.notificationItem {
		padding: 14px 16px;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		text-align: left;
		background: var(--background-default);
	}

	.notificationTitle {
		margin: 0 0 6px;
		font-size: 15px;
	}

	.notificationText {
		margin: 0;
		font-size: 14px;
	}
</style>
