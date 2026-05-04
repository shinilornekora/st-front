import { mockLogin, mockRegister } from './mockClient/auth.mock';
import type { User } from '@entities/user/user.types';
import {
	accessTokenStore,
	apiClient,
	type ApiResponse,
	type LoginResponse,
} from './client';

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
	const response = await apiClient.post<LoginResponse>('/auth/login', {
		login: data.login,
		password: data.password,
	});

	if (response.success && response.data?.user) {
		if (response.data.accessToken) {
			accessTokenStore.set(response.data.accessToken);
		}

		return {
			success: true,
			data: response.data.user,
			message: response.data.message,
		};
	}

	return {
		success: false,
		error: response.error,
		message: response.message,
		status: response.status,
	};
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
	return apiClient.post<{ message: string }>('/auth/register', {
		name: data.name,
		phone: data.phone,
		email: data.email,
		password: data.password,
		role: data.role,
	});
};

/**
 * API: Выход из системы
 */
export const logoutUser = async (): Promise<ApiResponse<void>> => {
	const response = await apiClient.post<void>('/auth/logout');
	apiClient.clearSession();

	return response;
};
