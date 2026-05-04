import { createStore, createEvent, createEffect } from 'effector';
import type { User } from './user.types';
import { apiClient } from '@shared/api/client';
import { setAuthenticationStatus } from '@shared/utils/auth';

// События
export const setUser = createEvent<User | null>();
export const resetUser = createEvent();

// Эффекты (моки)
export const loginFx = createEffect<{ email: string; password: string }, User>(
	async ({ email }) => {
		return {
			id: 1,
			email,
			role: 'CUSTOMER',
			fullName: 'Demo Customer',
			phone: '+71234567890',
			specificFields: { favoriteProducts: [100, 101] },
		};
	},
);

export const updateProfileFx = createEffect<Partial<User>, User>(
	async (fields) => {
		return {
			id: 1,
			email: fields.email ?? 'demo@mail.com',
			role: 'CUSTOMER',
			fullName: fields.fullName ?? 'Demo Customer',
			phone: fields.phone ?? '+71234567890',
			specificFields: fields.specificFields ?? {
				favoriteProducts: [100],
			},
		};
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
