import { paraglideVitePlugin } from '@inlang/paraglide-js';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
		// Only compile paraglide in development or when COMPILE_PARAGLIDE=true
		...(process.env.NODE_ENV === 'development' || process.env.COMPILE_PARAGLIDE === 'true'
			? [paraglideVitePlugin({
					project: './project.inlang',
					outdir: './src/lib/paraglide'
				})]
			: [])
	],
	// TODO Retry cloudflare workers
	// define: {
	// 	// Fix for Cloudflare Workers transport issues
	// 	global: 'globalThis'
	// },
	// optimizeDeps: {
	// 	exclude: ['@sveltejs/adapter-cloudflare']
	// },
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'browser',
					browser: {
						enabled: true,
						provider: 'playwright',
						instances: [{ browser: 'chromium' }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
