import vue from 'eslint-plugin-vue';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'node_modules',
			'dist',
			'dist-ssr',
			'*.local',
			'storybook-static',
		],
	},
	// Base config for all files
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				browser: true,
				es2022: true,
				node: true,
			},
		},
	},
	// TypeScript files
	{
		files: ['**/*.{ts,mts,cts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': ts,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
		},
	},
	// Vue files - use recommended config
	...vue.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				parser: tsParser,
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'warn',
		},
	},
	// Prettier integration - must be last to override other formatting rules
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}'],
		plugins: {
			prettier,
		},
		rules: {
			...prettierConfig.rules,
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					useTabs: true,
					tabWidth: 4,
				},
			],
		},
	},
];
