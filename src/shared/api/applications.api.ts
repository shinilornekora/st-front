/**
 * Applications API
 * API для работы с заявками продавцов
 */

import { apiClient, type ApiResponse } from './client';

// Types
export interface Application {
	id: number;
	name: string;
	phone: string;
	email: string;
	status: 'pending' | 'approved' | 'rejected';
}

export interface UpdateApplicationStatusRequest {
	id: number;
	status: 'approved' | 'rejected';
}

/**
 * Получить список заявок
 * GET /api/admin/applications
 */
export const getApplications = async (): Promise<
	ApiResponse<Application[]>
> => {
	return apiClient.get<Application[]>('/admin/applications');
};

/**
 * Обновить статус заявки
 * PATCH /api/admin/applications/{id}/status
 */
export const updateApplicationStatus = async (
	params: UpdateApplicationStatusRequest,
): Promise<ApiResponse<{ message: string }>> => {
	return apiClient.patch<{ message: string }>(
		`/admin/applications/${params.id}/status`,
		{ status: params.status },
	);
};
