module.exports = {
	rules: {
		quotes: ['error', 'single'],
		indent: ['error', 'tab'],
		'prettier/prettier': ['error', {
			singleQuote: true,
			useTabs: true,
			tabWidth: 4
		}],
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaversion: 2022,
		sourceType: 'module',
	},
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended',
	],
	plugins: [
		'vue',
		'@typescript-eslint',
		'prettier',
	],
};
