import { apiClient } from './client';
import type { ApiResponse } from './client';

export interface Requisites {
	country: string;
	name: string;
	bik: string;
	account: string;
	fullName: string;
}

export interface UserSettings {
	notifications: boolean;
	email: boolean;
	marketing: boolean;
	analytics: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
	notifications: true,
	email: true,
	marketing: false,
	analytics: true,
};

export const deleteAccount = async (): Promise<ApiResponse<void>> => {
	return apiClient.delete<void>('/users/me');
};

export const saveRequisites = async (
	data: Requisites,
): Promise<ApiResponse<Requisites>> => {
	return apiClient.post<Requisites>('/users/me/requisites', data);
};

export const saveSettings = async (
	data: UserSettings,
): Promise<ApiResponse<UserSettings>> => {
	return apiClient.patch<UserSettings>('/users/me/settings', data);
};

export const getSettings = async (): Promise<ApiResponse<UserSettings>> => {
	return apiClient.get<UserSettings>('/users/me/settings');
};
