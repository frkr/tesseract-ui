import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { MenuData } from '$lib/components/menu-bread.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = requireLogin();

	const menu: MenuData = [];

	return {
		...result,
		menu
	};
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/user/login');
	}

	return locals;
}
