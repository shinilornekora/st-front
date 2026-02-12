import { mockClient } from './client';
import type { User } from '@entities/user/user.types';
import { i18n } from '@shared/i18n';

const MOCK_USERS = {
	'seller@example.com': {
		password: 'seller123',
		user: {
			id: 1,
			email: 'seller@example.com',
			role: 'SELLER' as const,
			fullName: i18n.global.t('mockData.mockUsers.seller'),
			phone: '+79001234567',
			specificFields: {
				id: 1,
				userId: 1,
				name: i18n.global.t('mockData.mockShop'),
				logo: undefined,
				phone: '+79001234567',
				email: 'seller@example.com',
				inn: '1234567890',
				billingAccount: '40817810099910004312',
				extraFields: [],
			},
		},
	},
	'customer@example.com': {
		password: 'customer123',
		user: {
			id: 2,
			email: 'customer@example.com',
			role: 'CUSTOMER' as const,
			fullName: i18n.global.t('mockData.mockUsers.customer'),
			phone: '+79009876543',
			specificFields: {
				favoriteProducts: [1, 5, 10],
			},
		},
	},
	'admin@example.com': {
		password: 'admin123',
		user: {
			id: 3,
			email: 'admin@example.com',
			role: 'ADMIN' as const,
			fullName: i18n.global.t('mockData.mockUsers.admin'),
			phone: '+79005555555',
			specificFields: {
				isRestrictedAdmin: false,
				visibleSellers: undefined,
			},
		},
	},
};

export const mockLogin = async (login: string, password: string) => {
	return mockClient.post<User, { login: string; password: string }>(
		(credentials) => {
			const userEntry =
				MOCK_USERS[credentials.login as keyof typeof MOCK_USERS];

			if (!userEntry) {
				throw new Error('User with this email not found'); // errors.userNotFound
			}

			if (userEntry.password !== credentials.password) {
				throw new Error('Wrong password'); // errors.wrongPassword
			}

			return userEntry.user;
		},
		{ login, password },
		{ delay: 500 },
	);
};

export const mockRegister = async (data: {
	name: string;
	phone: string;
	email: string;
	password: string;
	role: 'CUSTOMER' | 'SELLER';
}) => {
	return mockClient.post<{ message: string }, typeof data>(
		(registerData) => {
			if (MOCK_USERS[registerData.email as keyof typeof MOCK_USERS]) {
				throw new Error('User with this email already exists'); // errors.userExists
			}

			if (registerData.role === 'SELLER') {
				return {
					message:
						'Your application has been submitted for administrator review', // messages.applicationSubmitted
				};
			}

			return {
				message: 'Registration successful! You can now log in', // messages.registrationSuccess
			};
		},
		data,
		{ delay: 800 },
	);
};
