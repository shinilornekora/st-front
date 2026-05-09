import { json, noContent } from '../lib/http.mjs';

export const handleAuthRoute = ({ req, res, method, pathname, body, state }) => {
	if (method === 'POST' && pathname === '/api/auth/login') {
		const login = body?.login;
		const password = body?.password;
		const user = state.users.find(
			(entry) => entry.email === login && entry.password === password,
		);

		if (!user) {
			json(res, 401, { error: 'Invalid credentials' });
			return true;
		}

		state.setActiveUserId(user.id);
		const accessToken = state.createToken(user.id);
		state.activeTokens.set(accessToken, user.id);
		json(res, 200, {
			user: state.sanitizeUser(user),
			accessToken,
			message: 'Login successful',
		});
		return true;
	}

	if (method === 'POST' && pathname === '/api/auth/register') {
		json(res, 200, { message: 'Registration request accepted' });
		return true;
	}

	if (method === 'POST' && pathname === '/api/auth/logout') {
		noContent(res);
		return true;
	}

	if (method === 'POST' && pathname === '/api/auth/refresh') {
		const user = state.getCurrentUser();
		const accessToken = state.createToken(user.id);
		state.activeTokens.set(accessToken, user.id);
		json(res, 200, { accessToken });
		return true;
	}

	if (method === 'GET' && pathname === '/api/auth/me') {
		const token = req.headers.authorization?.replace('Bearer ', '');
		const tokenUserId = token ? state.activeTokens.get(token) : undefined;
		const user =
			state.users.find((entry) => entry.id === tokenUserId) ??
			state.getCurrentUser();
		json(res, 200, { user: state.sanitizeUser(user) });
		return true;
	}

	if (method === 'PATCH' && pathname === '/api/auth/me') {
		const user = state.getCurrentUser();
		if (typeof body?.fullName === 'string') user.fullName = body.fullName;
		if (typeof body?.phone === 'string') user.phone = body.phone;
		if (typeof body?.email === 'string') user.email = body.email;
		json(res, 200, state.sanitizeUser(user));
		return true;
	}

	if (method === 'POST' && pathname === '/api/auth/forgot-password') {
		json(res, 200, { message: 'Password reset link sent' });
		return true;
	}

	return false;
};
