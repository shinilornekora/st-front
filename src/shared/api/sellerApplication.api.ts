import { apiClient } from './client';
import type { ApiResponse } from './client';
import type { SellerApplication } from '@entities/sellerApplication/sellerApplication.types';

export interface SubmitSellerApplicationRequest {
	name: string;
	phone: string;
	email: string;
	inn?: string;
	billingAccount?: string;
}

export const submitSellerApplication = async (
	data: SubmitSellerApplicationRequest,
): Promise<ApiResponse<SellerApplication>> => {
	return apiClient.post<SellerApplication>('/seller-applications', data);
};
