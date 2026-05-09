import { json } from '../lib/http.mjs';

export const handleBusinessRoute = ({ res, method, pathname, body, state }) => {
	if (method === 'POST' && pathname === '/api/seller-applications') {
		const user = state.getCurrentUser();
		const application = {
			id: state.sellerApplications.length + 1,
			userId: user.id,
			status: 'NEW',
			createdAt: state.nowIso(),
			message: 'Application accepted',
		};

		state.sellerApplications.push(application);
		state.adminApplications.push({
			id: state.adminApplications.length + 1,
			name: body?.name ?? user.fullName,
			phone: body?.phone ?? user.phone,
			email: body?.email ?? user.email,
			status: 'pending',
		});

		json(res, 200, application);
		return true;
	}

	if (method === 'POST' && pathname === '/api/discount-requests') {
		const request = {
			id: state.discountRequests.length + 1,
			productId: Number(body?.productId),
			discountAmount: Number(body?.discountAmount),
			status: 'PENDING',
			createdAt: state.nowIso(),
		};
		state.discountRequests.push(request);
		json(res, 200, request);
		return true;
	}

	return false;
};
