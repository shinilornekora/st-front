import { json, noContent } from '../lib/http.mjs';

export const handleUserRoute = ({ res, method, pathname, body, state }) => {
	if (method === 'GET' && pathname === '/api/users/me/settings') {
		const user = state.getCurrentUser();
		const current = state.userSettings.get(user.id) ?? {
			notifications: true,
			email: true,
			marketing: false,
			analytics: true,
		};
		json(res, 200, current);
		return true;
	}

	if (method === 'DELETE' && pathname === '/api/users/me') {
		noContent(res);
		return true;
	}

	if (method === 'POST' && pathname === '/api/users/me/requisites') {
		const user = state.getCurrentUser();
		state.userRequisites.set(user.id, {
			country: body?.country ?? '',
			name: body?.name ?? '',
			bik: body?.bik ?? '',
			account: body?.account ?? '',
			fullName: body?.fullName ?? '',
		});
		json(res, 200, state.userRequisites.get(user.id));
		return true;
	}

	if (method === 'PATCH' && pathname === '/api/users/me/settings') {
		const user = state.getCurrentUser();
		const current = state.userSettings.get(user.id) ?? {
			notifications: true,
			email: true,
			marketing: false,
			analytics: true,
		};
		const merged = { ...current, ...body };
		state.userSettings.set(user.id, merged);
		json(res, 200, merged);
		return true;
	}

	return false;
};
