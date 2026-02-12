import { mockLogin, mockRegister } from './mockClient/auth.mock';
import type { User } from '@entities/user/user.types';
import { i18n } from '@shared/i18n';

export interface LoginRequest {
	login: string;
	password: string;
	__mock?: boolean;
}

export interface RegisterRequest {
	name: string;
	phone: string;
	email: string;
	password: string;
	role: 'CUSTOMER' | 'SELLER';
	__mock?: boolean;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

/**
 * API: Авторизация пользователя
 * Если __mock=true, использует mock client
 * Иначе отправляет реальный запрос на сервер
 */
export const loginUser = async (
	data: LoginRequest,
): Promise<ApiResponse<User>> => {
	if (data.__mock) {
		// Mock режим
		return mockLogin(data.login, data.password);
	}

	// Реальный API запрос
	try {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				login: data.login,
				password: data.password,
			}),
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || i18n.global.t('errors.authError'),
			};
		}

		return {
			success: true,
			data: result.user,
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: i18n.global.t('errors.networkError'),
		};
	}
};

/**
 * API: Регистрация нового пользователя
 * Если __mock=true, использует mock client
 * Иначе отправляет реальный запрос на сервер
 */
export const registerUser = async (
	data: RegisterRequest,
): Promise<ApiResponse<{ message: string }>> => {
	if (data.__mock) {
		// Mock режим
		return mockRegister(data);
	}

	// Реальный API запрос
	try {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: data.name,
				phone: data.phone,
				email: data.email,
				password: data.password,
				role: data.role,
			}),
		});

		const result = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: result.error || i18n.global.t('errors.registerError'),
			};
		}

		return {
			success: true,
			data: { message: result.message },
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: i18n.global.t('errors.networkError'),
		};
	}
};
