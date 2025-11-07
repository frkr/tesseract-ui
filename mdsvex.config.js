import { codeToHtml } from 'shiki';
import { escapeSvelte } from 'mdsvex';

const mdsvexConfig = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = '') => {
			if (lang === 'mermaid') {
				return `<pre class="mermaid">${escapeSvelte(code)}</pre>`;
			}

			const html = escapeSvelte(await codeToHtml(code, { lang, theme: 'github-dark-default' }));

			return `{@html \`${html}\`}`;
		}
	}
};

export default mdsvexConfig;
