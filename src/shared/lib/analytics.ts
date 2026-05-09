import { $userSettings } from '@entities/user/settings.store';

type AnalyticsPayload = Record<string, unknown>;

declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

const canTrack = (): boolean => {
	const settings = $userSettings.getState();
	return settings.analytics;
};

export const trackEvent = (
	eventName: string,
	payload: AnalyticsPayload = {},
): void => {
	if (!canTrack()) return;
	if (typeof window === 'undefined') return;

	if (Array.isArray(window.dataLayer)) {
		window.dataLayer.push({ event: eventName, ...payload });
		return;
	}

	if (import.meta.env.DEV) {
		console.info('[analytics]', eventName, payload);
	}
};
