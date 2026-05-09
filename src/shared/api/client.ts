/**
 * Centralized API client with production-oriented auth flow.
 *
 * Assumptions:
 * - access token is short-lived and kept only in memory
 * - refresh token is stored by backend in httpOnly cookie
 * - backend exposes /api/auth/refresh and /api/auth/me
 */

import { i18n } from '@shared/i18n';
import type { User } from '@entities/user/user.types';

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
	status?: number;
}

export interface LoginResponse {
	user: User;
	accessToken?: string;
	message?: string;
}

export interface RefreshResponse {
	accessToken: string;
}

export interface MeResponse {
	user: User;
}

export interface RequestConfig {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	headers?: Record<string, string>;
	body?: unknown;
	credentials?: RequestCredentials;
	retryOn401?: boolean;
	skipAuth?: boolean;
	signal?: AbortSignal;
}

class AccessTokenStore {
	private accessToken: string | null = null;

	get(): string | null {
		return this.accessToken;
	}

	set(token: string | null): void {
		this.accessToken = token;
	}

	clear(): void {
		this.accessToken = null;
	}

	has(): boolean {
		return Boolean(this.accessToken);
	}
}

export const accessTokenStore = new AccessTokenStore();

class ApiClient {
	private baseURL: string;
	private refreshPromise: Promise<boolean> | null = null;

	constructor(baseURL: string = '') {
		this.baseURL = baseURL;
	}

	private buildHeaders(config: RequestConfig): Record<string, string> {
		const headers: Record<string, string> = {
			...config.headers,
		};

		if (config.body !== undefined && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		const accessToken = accessTokenStore.get();
		if (!config.skipAuth && accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		return headers;
	}

	private async parseResponse<T>(
		response: Response,
	): Promise<ApiResponse<T>> {
		const contentType = response.headers.get('content-type') || '';
		const isJson = contentType.includes('application/json');
		const isNoContent = response.status === 204;

		let payload: unknown = undefined;

		if (!isNoContent) {
			if (isJson) {
				payload = await response.json();
			} else {
				const text = await response.text();
				payload = text || undefined;
			}
		}

		if (!response.ok) {
			const errorPayload =
				typeof payload === 'object' && payload !== null
					? (payload as Record<string, unknown>)
					: null;

			return {
				success: false,
				status: response.status,
				error:
					(typeof errorPayload?.error === 'string' &&
						errorPayload.error) ||
					(typeof errorPayload?.message === 'string' &&
						errorPayload.message) ||
					(typeof payload === 'string' && payload) ||
					i18n.global.t('errors.networkError'),
				message:
					typeof errorPayload?.message === 'string'
						? errorPayload.message
						: undefined,
			};
		}

		return {
			success: true,
			status: response.status,
			data: payload as T,
		};
	}

	private async refreshAccessToken(): Promise<boolean> {
		if (this.refreshPromise) {
			return this.refreshPromise;
		}

		this.refreshPromise = (async () => {
			try {
				const response = await fetch(`${this.baseURL}/auth/refresh`, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				const parsed =
					await this.parseResponse<RefreshResponse>(response);
				if (!parsed.success || !parsed.data?.accessToken) {
					accessTokenStore.clear();
					return false;
				}

				accessTokenStore.set(parsed.data.accessToken);
				return true;
			} catch {
				accessTokenStore.clear();
				return false;
			} finally {
				this.refreshPromise = null;
			}
		})();

		return this.refreshPromise;
	}

	private async request<T>(
		endpoint: string,
		config: RequestConfig = {},
	): Promise<ApiResponse<T>> {
		const url = `${this.baseURL}${endpoint}`;
		const requestConfig: RequestInit = {
			method: config.method || 'GET',
			headers: this.buildHeaders(config),
			credentials: config.credentials || 'include',
			signal: config.signal,
		};

		if (config.body !== undefined) {
			requestConfig.body = JSON.stringify(config.body);
		}

		try {
			const response = await fetch(url, requestConfig);
			const parsed = await this.parseResponse<T>(response);

			if (
				parsed.status === 401 &&
				config.retryOn401 !== false &&
				!config.skipAuth &&
				endpoint !== '/auth/refresh'
			) {
				const refreshed = await this.refreshAccessToken();
				if (refreshed) {
					return this.request<T>(endpoint, {
						...config,
						retryOn401: false,
					});
				}
			}

			return parsed;
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: i18n.global.t('errors.networkError'),
			};
		}
	}

	async get<T>(
		endpoint: string,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...config, method: 'GET' });
	}

	async post<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...config, method: 'POST', body });
	}

	async put<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...config, method: 'PUT', body });
	}

	async patch<T>(
		endpoint: string,
		body?: unknown,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
	}

	async delete<T>(
		endpoint: string,
		config?: RequestConfig,
	): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { ...config, method: 'DELETE' });
	}

	async restoreSession(): Promise<ApiResponse<User>> {
		const refreshed = await this.refreshAccessToken();
		if (!refreshed) {
			return {
				success: false,
				error: 'Session is not available',
			};
		}

		const meResponse = await this.get<MeResponse>('/auth/me');
		if (!meResponse.success || !meResponse.data?.user) {
			return {
				success: false,
				error: meResponse.error || 'Failed to restore user session',
			};
		}

		return {
			success: true,
			data: meResponse.data.user,
		};
	}

	clearSession(): void {
		accessTokenStore.clear();
	}
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
export const apiClient = new ApiClient(API_BASE_URL);
