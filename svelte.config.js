import { mdsvex } from 'mdsvex';
import adapterAuto from '@sveltejs/adapter-auto';
import adapterVercel from '@sveltejs/adapter-vercel';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.ts';

// Function to detect deployment environment and return appropriate adapter
function getAdapter() {
	// Check for Vercel environment variables
	if (process.env.VERCEL || process.env.VERCEL_ENV) {
		return adapterVercel();
	}
	
	// Check for Cloudflare environment variables
	if (process.env.CF_PAGES || process.env.CLOUDFLARE_PAGES || process.env.WORKERS) {
		return adapterCloudflare();
	}
	
	// Default to auto adapter for other environments
	return adapterAuto();
}

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
		adapter: getAdapter()
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
