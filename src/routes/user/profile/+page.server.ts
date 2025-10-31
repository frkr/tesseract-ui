import * as auth from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import * as table from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserGroupsAndAdmin } from '$lib/common';

export const load: PageServerLoad = async () => {
	const user = requireLogin();

	const groups = await getUserGroupsAndAdmin(db, user.id);
	return { user, groups };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	}
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/user/login');
	}

	return locals.user;
}
