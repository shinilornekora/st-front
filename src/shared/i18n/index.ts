import { createI18n } from 'vue-i18n';
import ru from './locales/ru';
import en from './locales/en';

// Get saved locale from localStorage or default to Russian
const savedLocale = localStorage.getItem('locale') || 'ru';

export const i18n = createI18n({
	legacy: false,
	locale: savedLocale,
	fallbackLocale: 'ru',
	messages: {
		ru,
		en,
	},
});

export const setLocale = (locale: 'ru' | 'en') => {
	i18n.global.locale.value = locale;
	localStorage.setItem('locale', locale);
};

export const getLocale = (): string => {
	return i18n.global.locale.value;
};
