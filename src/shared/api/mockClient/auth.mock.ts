import { mockClient } from './client';
import type { User } from '@entities/user/user.types';

const MOCK_USERS = {
  'seller@example.com': {
    password: 'seller123',
    user: {
      id: 1,
      email: 'seller@example.com',
      role: 'SELLER' as const,
      fullName: 'Иван Продавцов',
      phone: '+79001234567',
      specificFields: {
        id: 1,
        userId: 1,
        name: 'Магазин Обуви',
        logo: undefined,
        phone: '+79001234567',
        email: 'seller@example.com',
        inn: '1234567890',
        billingAccount: '40817810099910004312',
        extraFields: []
      }
    }
  },
  'customer@example.com': {
    password: 'customer123',
    user: {
      id: 2,
      email: 'customer@example.com',
      role: 'CUSTOMER' as const,
      fullName: 'Мария Покупателева',
      phone: '+79009876543',
      specificFields: {
        favoriteProducts: [1, 5, 10]
      }
    }
  },
  'admin@example.com': {
    password: 'admin123',
    user: {
      id: 3,
      email: 'admin@example.com',
      role: 'ADMIN' as const,
      fullName: 'Администратор Системы',
      phone: '+79005555555',
      specificFields: {
        isRestrictedAdmin: false,
        visibleSellers: undefined
      }
    }
  }
};

export const mockLogin = async (login: string, password: string) => {
  return mockClient.post<User, { login: string; password: string }>(
    (credentials) => {
      const userEntry = MOCK_USERS[credentials.login as keyof typeof MOCK_USERS];

      if (!userEntry) {
        throw new Error('Пользователь с таким email не найден');
      }

      if (userEntry.password !== credentials.password) {
        throw new Error('Неверный пароль');
      }

      return userEntry.user;
    },
    { login, password },
    { delay: 500 }
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
        throw new Error('Пользователь с таким email уже существует');
      }

      if (registerData.role === 'SELLER') {
        return {
          message: 'Ваша заявка отправлена на рассмотрение администратору'
        };
      }

      return {
        message: 'Регистрация прошла успешно! Теперь вы можете войти в систему'
      };
    },
    data,
    { delay: 800 }
  );
};
