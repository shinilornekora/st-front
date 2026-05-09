import { createStore, createEvent, createEffect } from 'effector';
import type { User } from './user.types';
import { apiClient } from '@shared/api/client';
import { loginUser, updateProfile } from '@shared/api/auth.api';
import type { UpdateProfileRequest } from '@shared/api/auth.api';
import { setAuthenticationStatus } from '@shared/utils/auth';

// События
export const setUser = createEvent<User | null>();
export const resetUser = createEvent();

// Эффект авторизации — вызывает реальный POST /api/auth/login
export const loginFx = createEffect<{ email: string; password: string }, User>(
	async ({ email, password }) => {
		const response = await loginUser({ login: email, password });
		if (!response.success || !response.data) {
			throw new Error(response.error ?? 'Login failed');
		}
		return response.data;
	},
);

// Эффект обновления профиля — вызывает реальный PATCH /api/auth/me
export const updateProfileFx = createEffect<UpdateProfileRequest, User>(
	async (fields) => {
		const response = await updateProfile(fields);
		if (!response.success || !response.data) {
			throw new Error(response.error ?? 'Failed to update profile');
		}
		return response.data;
	},
);

// Эффект для инициализации пользователя из backend-driven session
export const initUserFx = createEffect<void, User | null>(async () => {
	try {
		const response = await apiClient.restoreSession();

		if (!response.success || !response.data) {
			setAuthenticationStatus(false);
			return null;
		}

		localStorage.setItem('user', JSON.stringify(response.data));
		setAuthenticationStatus(true);
		return response.data;
	} catch (error) {
		console.error('Error initializing user:', error);
		setAuthenticationStatus(false);
		return null;
	}
});

// Store
export const $user = createStore<User | null>(null)
	.on(setUser, (_, user) => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
			setAuthenticationStatus(true);
		} else {
			setAuthenticationStatus(false);
		}
		return user;
	})
	.on(resetUser, () => {
		setAuthenticationStatus(false);
		return null;
	})
	.on(loginFx.doneData, (_, user) => {
		localStorage.setItem('user', JSON.stringify(user));
		setAuthenticationStatus(true);
		return user;
	})
	.on(updateProfileFx.doneData, (_, user) => {
		localStorage.setItem('user', JSON.stringify(user));
		return user;
	})
	.on(initUserFx.doneData, (_, user) => user);
