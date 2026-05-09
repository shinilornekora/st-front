import { createStore, createEvent, createEffect } from 'effector';
import type { SellerApplication } from './sellerApplication.types';
import { submitSellerApplication } from '@shared/api/sellerApplication.api';
import type { SubmitSellerApplicationRequest } from '@shared/api/sellerApplication.api';

export const setApplications = createEvent<SellerApplication[]>();
export const addApplication = createEvent<SellerApplication>();

export const getApplicationsFx = createEffect<void, SellerApplication[]>(
	async () => [],
);

export const addApplicationFx = createEffect<
	SubmitSellerApplicationRequest,
	SellerApplication
>(async (data) => {
	const response = await submitSellerApplication(data);
	if (!response.success || !response.data) {
		throw new Error(response.error ?? 'Failed to submit seller application');
	}
	return response.data;
});

export const $applications = createStore<SellerApplication[]>([])
	.on(setApplications, (_, list) => list)
	.on(addApplication, (state, app) => [...state, app])
	.on(getApplicationsFx.doneData, (_, list) => list)
	.on(addApplicationFx.doneData, (state, app) => [...state, app]);
