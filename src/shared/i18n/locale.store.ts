import { createStore, createEvent } from 'effector';
import { setLocale as setI18nLocale } from './index';

export type Locale = 'ru' | 'en';

// Get saved locale from localStorage or default to Russian
const savedLocale = (localStorage.getItem('locale') as Locale) || 'ru';

// Events
export const setLocale = createEvent<Locale>();

// Store
export const $locale = createStore<Locale>(savedLocale).on(setLocale, (_, locale) => {
  setI18nLocale(locale);
  return locale;
});
