/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@assets': path.resolve(dirname, 'src/assets'),
			'@components': path.resolve(dirname, 'src/shared/ui'),
			'@pages': path.resolve(dirname, 'src/pages'),
			'@entities': path.resolve(dirname, 'src/entities'),
			'@features': path.resolve(dirname, 'src/features'),
			'@widgets': path.resolve(dirname, 'src/widgets'),
			'@shared': path.resolve(dirname, 'src/shared'),
			'@app': path.resolve(dirname, 'src/app'),
		},
	},
});
