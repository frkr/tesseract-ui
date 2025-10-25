import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHighlighter } from 'shiki';
import { escapeSvelte } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			// DOES NOT WORK layout: {_:'./src/lib/components/Mermaid.svelte'},
			highlight: {
				highlighter: async (code, lang) => {
					// Skip Mermaid blocks - don't highlight them
					if (lang === 'mermaid') {
						return `<pre class="mermaid">${code}</pre>`;
					}

					const highlighter = await createHighlighter({
						theme: 'github-dark',
						langs: [lang]
					});

					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'github-dark' }));

					return `{@html \`${html}\`}`;
				}
			}
		})
	],
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
