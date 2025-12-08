import { createStore, createEvent, createEffect } from 'effector';
import type { SellerApplication } from './sellerApplication.types';

export const setApplications = createEvent<SellerApplication[]>();
export const addApplication = createEvent<SellerApplication>();

export const getApplicationsFx = createEffect<void, SellerApplication[]>(async () => []);
export const addApplicationFx = createEffect<SellerApplication, SellerApplication>(async (app) => app);

export const $applications = createStore<SellerApplication[]>([])
	.on(setApplications, (_, list) => list)
	.on(addApplication, (state, app) => [...state, app])
	.on(getApplicationsFx.doneData, (_, list) => list)
	.on(addApplicationFx.doneData, (state, app) => [...state, app]);
