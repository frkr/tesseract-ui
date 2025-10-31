import { mdsvex } from 'mdsvex';
import adapterVercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.ts';

// TODO Retry cloudflare workers
// Function to detect deployment environment and return appropriate adapter
function getAdapter() {
	// Check for Vercel environment variables
	// if (process.env.VERCEL || process.env.VERCEL_ENV) {
	return adapterVercel();
	// }

	// Use Cloudflare adapter with explicit configuration to avoid transport issues
	// return adapterCF({
	// 	Explicitly disable platform proxy to avoid transport issues
	// platformProxy: false
	// });
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [mdsvex(mdsvexConfig),vitePreprocess()],
	kit: {
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: getAdapter()
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
