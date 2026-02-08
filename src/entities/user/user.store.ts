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

// Эффект для инициализации пользователя из localStorage
export const initUserFx = createEffect<void, User | null>(async () => {
	try {
		// Проверяем cookie аутентификации
		const hasAuthCookie = document.cookie.split(';').some(cookie =>
			cookie.trim().startsWith('gtrh=1')
		);
		
		if (!hasAuthCookie) {
			return null;
		}
		
		// Пытаемся восстановить данные пользователя из localStorage
		const userDataStr = localStorage.getItem('user');
		if (userDataStr) {
			const userData = JSON.parse(userDataStr);
			return userData;
		}
		
		// Если данных нет в localStorage, но есть cookie, возвращаем mock пользователя
		// В реальном приложении здесь был бы запрос к API для получения данных пользователя
		return {
			id: 1,
			email: 'demo@mail.com',
			role: 'CUSTOMER',
			fullName: 'Demo Customer',
			phone: '+71234567890',
			specificFields: { favoriteProducts: [100, 101] },
		};
	} catch (error) {
		console.error('Error initializing user:', error);
		return null;
	}
});

// Store
export const $user = createStore<User | null>(null)
	.on(setUser, (_, user) => {
		// Сохраняем пользователя в localStorage при установке
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
		return user;
	})
	.on(resetUser, () => {
		localStorage.removeItem('user');
		return null;
	})
	.on(loginFx.doneData, (_, user) => {
		localStorage.setItem('user', JSON.stringify(user));
		return user;
	})
	.on(updateProfileFx.doneData, (_, user) => {
		localStorage.setItem('user', JSON.stringify(user));
		return user;
	})
	.on(initUserFx.doneData, (_, user) => user);
