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

export const deleteAccount = async (): Promise<ApiResponse<void>> => {
	return apiClient.delete<void>('/api/users/me');
};

export const saveRequisites = async (
	data: Requisites,
): Promise<ApiResponse<Requisites>> => {
	return apiClient.post<Requisites>('/api/users/me/requisites', data);
};

export const saveSettings = async (
	data: UserSettings,
): Promise<ApiResponse<UserSettings>> => {
	return apiClient.patch<UserSettings>('/api/users/me/settings', data);
};
