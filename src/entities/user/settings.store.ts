import { createStore, createEvent, createEffect, sample, combine } from 'effector';
import {
	DEFAULT_USER_SETTINGS,
	getSettings,
	saveSettings,
	type UserSettings,
} from '@shared/api/user.api';
import { initUserFx, resetUser, setUser } from './user.store';

export const setUserSettings = createEvent<UserSettings>();
export const resetUserSettings = createEvent();

export const loadUserSettingsFx = createEffect<void, UserSettings>(async () => {
	const response = await getSettings();
	if (!response.success || !response.data) {
		throw new Error(response.error ?? 'Failed to load user settings');
	}
	return response.data;
});

export const saveUserSettingsFx = createEffect<UserSettings, UserSettings>(
	async (settings) => {
		const response = await saveSettings(settings);
		if (!response.success || !response.data) {
			throw new Error(response.error ?? 'Failed to save user settings');
		}
		return response.data;
	},
);

export const $userSettings = createStore<UserSettings>(DEFAULT_USER_SETTINGS)
	.on(setUserSettings, (_, settings) => settings)
	.on(loadUserSettingsFx.doneData, (_, settings) => settings)
	.on(saveUserSettingsFx.doneData, (_, settings) => settings)
	.on(resetUserSettings, () => DEFAULT_USER_SETTINGS);

export const $userSettingsLoading = combine(
	loadUserSettingsFx.pending,
	saveUserSettingsFx.pending,
	(loadPending, savePending) => loadPending || savePending,
);

sample({
	clock: initUserFx.doneData,
	filter: (user) => Boolean(user),
	target: loadUserSettingsFx,
});

sample({
	clock: setUser,
	filter: (user) => Boolean(user),
	target: loadUserSettingsFx,
});

sample({
	clock: setUser,
	filter: (user) => user === null,
	target: resetUserSettings,
});

sample({
	clock: initUserFx.doneData,
	filter: (user) => user === null,
	target: resetUserSettings,
});

sample({
	clock: resetUser,
	target: resetUserSettings,
});
