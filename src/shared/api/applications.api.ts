/**
 * Applications API
 * API для работы с заявками продавцов
 */

import { mockClient } from './mockClient/client';
import type { MockResponse } from './mockClient/client';
import { i18n } from '@shared/i18n';

// Types
export interface Application {
	id: number;
	name: string;
	phone: string;
	email: string;
	status: 'pending' | 'approved' | 'rejected';
}

export interface GetApplicationsRequest {
	__mock?: boolean;
}

export interface UpdateApplicationStatusRequest {
	id: number;
	status: 'approved' | 'rejected';
	__mock?: boolean;
}

// Mock data generator
const generateMockApplications = (): Application[] => {
	return [
		{
			id: 1,
			name: 'Stivalli',
			phone: '+7 123 456 78 90',
			email: 'Stivalli@mail.ru',
			status: 'pending',
		},
		{
			id: 2,
			name: 'Fashion House',
			phone: '+7 987 654 32 10',
			email: 'fashion@mail.ru',
			status: 'pending',
		},
		{
			id: 3,
			name: 'Style Co',
			phone: '+7 555 123 45 67',
			email: 'style@mail.ru',
			status: 'pending',
		},
	];
};

/**
 * Получить список заявок
 */
export const getApplications = async (
	params: GetApplicationsRequest = {},
): Promise<MockResponse<Application[]>> => {
	if (params.__mock) {
		return mockClient.get(() => generateMockApplications());
	}

	// Real API call would go here
	try {
		const response = await fetch('/api/admin/applications');
		const data = await response.json();

		return {
			success: response.ok,
			data: response.ok ? data : undefined,
			error: response.ok ? undefined : 'Failed to fetch applications',
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
 * Обновить статус заявки
 */
export const updateApplicationStatus = async (
	params: UpdateApplicationStatusRequest,
): Promise<MockResponse<{ message: string }>> => {
	if (params.__mock) {
		return mockClient.post(
			(data) => ({
				message:
					data.status === 'approved'
						? i18n.global.t('messages.applicationApproved')
						: i18n.global.t('messages.applicationRejected'),
			}),
			params,
		);
	}

	// Real API call would go here
	try {
		const response = await fetch(
			`/api/admin/applications/${params.id}/status`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: params.status }),
			},
		);
		const data = await response.json();

		return {
			success: response.ok,
			data: response.ok ? data : undefined,
			error: response.ok
				? undefined
				: 'Failed to update application status',
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
