import { createStore, createEvent } from 'effector';
import { $userSettings } from '@entities/user/settings.store';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = createEvent<
	string | { message: string; type?: ToastType }
>();
export const hideToast = createEvent();

export const $toast = createStore<{
	show: boolean;
	message: string;
	type: ToastType;
}>({
	show: false,
	message: '',
	type: 'success',
})
	.on(showToast, (_, payload) => {
		const nextToast =
			typeof payload === 'string'
				? {
						show: true,
						message: payload,
						type: 'success' as ToastType,
					}
				: {
						show: true,
						message: payload.message,
						type: payload.type || 'success',
					};

		// Notifications setting controls non-critical in-app notices.
		if (nextToast.type !== 'error' && !$userSettings.getState().notifications) {
			return {
				show: false,
				message: '',
				type: nextToast.type,
			};
		}

		return {
			show: true,
			message: nextToast.message,
			type: nextToast.type,
		};
	})
	.on(hideToast, (state) => ({ ...state, show: false }));
