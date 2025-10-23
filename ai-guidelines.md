# Project Guidelines

## Project Structure

- [routes](src/routes) - This is where all pages and CRUDs are created!
- Database Schema - [schema.md](src/lib/server/db/schema.md) - [schema.ts](src/lib/server/db/schema.ts)
- [e2e](e2e) - End-to-end testing directory — put all user journeys in this directory.
- [cleanup_chrome.sh](cleanup_chrome.sh) - this script its for ensure to close all chrome instances after running the End-to-End testing
- Unit tests should stay alongside their pages named ".spec.ts", following this example: [demo.spec.ts](src/demo.spec.ts)
- [messages](messages) - Put all text messages in multiple languages here.
- [settings.json](project.inlang/settings.json) - Configuration of which languages the project supports and how many.
- [static](static) - Static files; no AI should modify this directory.
- [.env](.env) [.env.example](.env.example) - Always keep the ".env" and ".env.example" files in sync with the same content, but mask the values in the example.

- [wrangler.jsonc](wrangler.jsonc) - This file is used for Cloudflare Workers; AIs should check whether the variables match those in ".env".

- [assets](src/lib/assets) - Directory where the server will store raw files. Probably no AI will use this directory.
- [paraglide](src/lib/paraglide) - Ignore this directory.

- [worker-configuration.d.ts](src/worker-configuration.d.ts) - This file is owned by Cloudflare. It must not be changed.

- [security.txt](static/security.txt) - This file should contain the administrator's email. Replace it when you discover it.

- [schema.ts](src/lib/server/db/schema.ts) - This file contains the data structure. Also keep the data structure in this file using mermaidjs: "src/lib/server/db/schema.md"

# Security:

SvelteKit offers native protection against leaking sensitive information through server-only modules. Any file placed in the src/lib/server/ folder or with a .server.js extension is never sent to the client.

Environment variables — like API keys and database credentials — can be added to a `.env` file, and they will be made available to your application.

> [!NOTE] You can also use `.env.local` or `.env.[mode]` files — see the [Vite documentation](https://vitejs.dev/guide/env-and-mode.html#env-files) for more information. Make sure you add any files containing sensitive information to your `.gitignore` file!
>
> Environment variables in `process.env` are also available via `$env/static/private`.

In this exercise, we want to allow the user to enter the website if they know the correct passphrase, using an environment variable.

First, in `.env`, add a new environment variable:

```env
/// file: .env
PASSPHRASE=+++"open sesame"+++
```

Open `src/routes/+page.server.js`. Import `PASSPHRASE` from `$env/static/private` and use it inside the [form action](/tutorial/kit/the-form-element):

```js
/// file: src/routes/+page.server.js
import { redirect, fail } from '@sveltejs/kit';
+++import { PASSPHRASE } from '$env/static/private';+++

export function load({ cookies }) {
	if (cookies.get('allowed')) {
		redirect(307, '/welcome');
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		if (data.get('passphrase') === +++PASSPHRASE+++) {
			cookies.set('allowed', 'true', {
				path: '/'
			});

			redirect(303, '/welcome');
		}

		return fail(403, {
			incorrect: true
		});
	}
};
```

The website is now accessible to anyone who knows the correct passphrase.

## Keeping secrets

It's important that sensitive data doesn't accidentally end up being sent to the browser, where it could easily be stolen by hackers and scoundrels.

SvelteKit makes it easy to prevent this from happening. Notice what happens if we try to import `PASSPHRASE` into `src/routes/+page.svelte`:

```svelte
<script>
	+++import { PASSPHRASE } from '$env/static/private';+++
	let { form } = $props();
</script>

/// file: src/routes/+page.svelte
```

An error overlay pops up, telling us that `$env/static/private` cannot be imported into client-side code. It can only be imported into server modules:

- `+page.server.js`
- `+layout.server.js`
- `+server.js`
- any modules ending with `.server.js`
- any modules inside `src/lib/server`

In turn, these modules can only be imported by _other_ server modules.

## Static vs dynamic

The `static` in `$env/static/private` indicates that these values are known at build time, and can be _statically replaced_. This enables useful optimisations:

```js
import { FEATURE_FLAG_X } from '$env/static/private';

if (FEATURE_FLAG_X === 'enabled') {
	// code in here will be removed from the build output
	// if FEATURE_FLAG_X is not enabled
}
```

In some cases you might need to refer to environment variables that are _dynamic_ — in other words, not known until we run the app. We'll cover this case in the next exercise.
