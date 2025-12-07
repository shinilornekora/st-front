import vue from 'eslint-plugin-vue';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
	{
		ignores: ['node_modules', 'dist'],
	},
	{
		plugins: {
			vue,
			ts,
			prettier,
		},
		languageOptions: {
			parser,
			parserOptions: {
				ecmaversion: 2022,
				sourceType: 'module',
				project: './tsconfig.json',
			},
			env: { browser: true, es2022: true, node: true },
		},
		settings: {},
		rules: {
			quotes: ['error', 'single'],
			indent: ['error', 'tab'],
			'prettier/prettier': ['error', {
				singleQuote: true,
				useTabs: true,
				tabWidth: 4,
			}],
		},
		extends: [
			'plugin:vue/vue3-recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:prettier/recommended',
		],
	},
];
