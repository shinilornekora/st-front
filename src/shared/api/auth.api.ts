import type { User } from '@entities/user/user.types';
import {
	accessTokenStore,
	apiClient,
	type ApiResponse,
	type LoginResponse,
} from './client';

export interface UpdateProfileRequest {
	fullName?: string;
	phone?: string;
	email?: string;
}

export interface LoginRequest {
	login: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	phone: string;
	email: string;
	password: string;
	role: 'CUSTOMER' | 'SELLER';
}

/**
 * API: Авторизация пользователя
 * POST /api/auth/login
 */
export const loginUser = async (
	data: LoginRequest,
): Promise<ApiResponse<User>> => {
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
 * POST /api/auth/register
 */
export const registerUser = async (
	data: RegisterRequest,
): Promise<ApiResponse<{ message: string }>> => {
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
 * POST /api/auth/logout
 */
export const logoutUser = async (): Promise<ApiResponse<void>> => {
	const response = await apiClient.post<void>('/auth/logout');
	apiClient.clearSession();

	return response;
};

/**
 * API: Обновление профиля пользователя
 * PATCH /api/auth/me
 */
export const updateProfile = async (
	data: UpdateProfileRequest,
): Promise<ApiResponse<User>> => {
	return apiClient.patch<User>('/auth/me', data);
};
