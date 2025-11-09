import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { listCategories, listLocations, listHolders } from '$lib/server/equipamentos/store';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/user/login');
	}

	return {
		user: locals.user,
		filters: {
			categories: listCategories(),
			locations: listLocations(),
			holders: listHolders()
		}
	};
};
