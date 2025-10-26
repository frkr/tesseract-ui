import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(302, '/user/profile');
}

/*
302 — found
303 — for form actions, following a successful submission
307 — for temporary redirects
308 — for permanent redirects
*/
