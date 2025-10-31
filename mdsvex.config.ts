import { codeToHtml } from 'shiki';
import { escapeSvelte } from 'mdsvex';

const mdsvexConfig = {
	extensions: ['.md'],
	// DOES NOT WORK layout: {_:'./src/lib/components/Mermaid.svelte'},
	highlight:  {
		highlighter: async (code: never, lang: string = '') => {
			// Skip Mermaid blocks - don't highlight them
			if (lang === 'mermaid') {
				return `<pre class="mermaid">${escapeSvelte(code)}</pre>`;
			}

			const html = escapeSvelte(await codeToHtml(code, { lang, theme: 'github-dark-default' }));

			return `{@html \`${html}\`}`;
		}
	}
};

export default mdsvexConfig;
