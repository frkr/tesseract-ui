import { mdsvex } from 'mdsvex';
// import adapterVercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.ts';

// Function to detect deployment environment and return appropriate adapter
// function getAdapter() {
// 	// Check for Vercel environment variables
// 	if (process.env.VERCEL || process.env.VERCEL_ENV) {
// 		return adapterVercel();
// 	}
// 		return adapterCloudflare();
// }

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
	kit: {
		// Automatically select adapter based on deployment environment:
		// - Vercel: uses @sveltejs/adapter-vercel
		// - Cloudflare: uses @sveltejs/adapter-cloudflare  
		// - Other environments: uses @sveltejs/adapter-auto
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
