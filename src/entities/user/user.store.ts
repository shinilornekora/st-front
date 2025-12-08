import { createStore, createEvent, createEffect } from 'effector';
import type { User } from './user.types';

// События
export const setUser = createEvent<User | null>();
export const resetUser = createEvent();

// Эффекты (моки)
export const loginFx = createEffect<{ email: string; password: string }, User>(async ({ email }) => {
	// mock user
	return {
		id: 1,
		email,
		role: 'CUSTOMER',
		fullName: 'Demo Customer',
		phone: '+71234567890',
		specificFields: { favoriteProducts: [100, 101] },
	};
});
export const updateProfileFx = createEffect<Partial<User>, User>(async (fields) => {
	// В норме: api, сейчас mock
	return {
		id: 1,
		email: fields.email ?? 'demo@mail.com',
		role: 'CUSTOMER',
		fullName: fields.fullName ?? 'Demo Customer',
		phone: fields.phone ?? '+71234567890',
		specificFields: fields.specificFields ?? { favoriteProducts: [100] },
	};
});

// Store
export const $user = createStore<User | null>(null)
	.on(setUser, (_, user) => user)
	.on(resetUser, () => null)
	.on(loginFx.doneData, (_, user) => user)
	.on(updateProfileFx.doneData, (_, user) => user);
