import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export const load = async () => {
	const { locals } = getRequestEvent();

	// Check if user is logged in (safety check, parent layout should handle this)
	if (!locals.user) {
		// FIXME translation
		throw error(401, 'Unauthorized');
	}

	// Check if user has group id = '1'
	if (!locals.groups || !locals.groups.some((group) => group.groupId === '1')) {
		// FIXME translation
		throw error(403, 'Forbidden: Access restricted to group 1');
	}

	return {};
};
