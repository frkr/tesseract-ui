import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(303, '/user');
}

/*
303 — for form actions, following a successful submission
307 — for temporary redirects
308 — for permanent redirects
*/
