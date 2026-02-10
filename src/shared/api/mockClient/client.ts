/**
 * Mock API Client
 * Используется только когда __mock=1
 */

import { i18n } from '@shared/i18n';

export interface MockResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MockConfig {
  delay?: number;
  shouldFail?: boolean;
  errorMessage?: string;
}

// Глобальные настройки mock API (управляются через DevTools)
export interface MockSettings {
  enabled: boolean;
  delay: number;
}

// Получение настроек из localStorage или значения по умолчанию
const getMockSettings = (): MockSettings => {
  try {
    const stored = localStorage.getItem('__dev_mock_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse mock settings:', e);
  }
  return { enabled: true, delay: 0 };
};

class MockApiClient {
  private async simulateNetworkDelay(customDelay?: number): Promise<void> {
    const settings = getMockSettings();
    const delay = customDelay ?? settings.delay;
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  async request<T>(
    handler: () => T | Promise<T>,
    config: MockConfig = {}
  ): Promise<MockResponse<T>> {
    try {
      await this.simulateNetworkDelay(config.delay);

      if (config.shouldFail) {
        return {
          success: false,
          error: config.errorMessage || i18n.global.t('errors.requestError')
        };
      }

      const data = await handler();

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : i18n.global.t('errors.unknownError')
      };
    }
  }

  async get<T>(
    handler: () => T | Promise<T>,
    config?: MockConfig
  ): Promise<MockResponse<T>> {
    return this.request(handler, config);
  }

  async post<T, D = any>(
    handler: (data: D) => T | Promise<T>,
    data: D,
    config?: MockConfig
  ): Promise<MockResponse<T>> {
    return this.request(() => handler(data), config);
  }

  async put<T, D = any>(
    handler: (data: D) => T | Promise<T>,
    data: D,
    config?: MockConfig
  ): Promise<MockResponse<T>> {
    return this.request(() => handler(data), config);
  }

  async delete<T>(
    handler: () => T | Promise<T>,
    config?: MockConfig
  ): Promise<MockResponse<T>> {
    return this.request(handler, config);
  }

  async patch<T, D = any>(
    handler: (data: D) => T | Promise<T>,
    data: D,
    config?: MockConfig
  ): Promise<MockResponse<T>> {
    return this.request(() => handler(data), config);
  }
}

export const mockClient = new MockApiClient();
