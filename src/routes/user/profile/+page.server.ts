import * as auth from '$lib/utils/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import type { MenuData } from '$lib/components/menu-bread.svelte';
import { db } from '$lib/db';
import * as schema from '$lib/db/schema';
import { addUserToGroup as addUserToGroupUtil, getUsersInGroup } from './utils.server';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const result = requireLogin();

	// Empty menu data for /user/profile route
	const menu: MenuData = [];

	// Check if user is administrator (has any group with isAdmin === true)
	const isAdministrator =
		result.groups?.some((group) => group.isAdmin === true) ?? false;

	// Fetch all users from database for selection (only if administrator)
	let allUsers: { id: string; username: string; name: string | null }[] = [];
	// Fetch group memberships for all groups where user has admin rights
	let groupMemberships: Record<string, { id: string; username: string; name: string | null; isAdmin: boolean }[]> = {};
	
	if (isAdministrator && result.groups) {
		allUsers = await db
			.select({
				id: schema.user.id,
				username: schema.user.username,
				name: schema.user.name
			})
			.from(schema.user);

		// Get all group IDs where user has admin rights
		const adminGroupIds = result.groups
			.filter((g) => g.isAdmin === true)
			.map((g) => g.groupId);

		// Fetch users for each admin group
		for (const groupId of adminGroupIds) {
			groupMemberships[groupId] = await getUsersInGroup(db, groupId);
		}
	}

	return {
		...result,
		menu,
		isAdministrator,
		allUsers,
		groupMemberships
	};
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/user/login');
	}

	return locals;
}

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/');
	},
	addUserToGroup: async (event) => {
		const { locals } = event;

		// Check if user is logged in
		if (!locals.user || !locals.groups) {
			return fail(401, { message: 'UNAUTHORIZED' });
		}

		// Check if user is administrator (has any group with isAdmin === true)
		const isAdministrator = locals.groups.some((group) => group.isAdmin === true);
		if (!isAdministrator) {
			return fail(403, { message: 'NOT_ADMINISTRATOR' });
		}

		const formData = await event.request.formData();
		const userId = formData.get('userId');
		const groupId = formData.get('groupId');

		// Validate inputs
		if (!userId || typeof userId !== 'string') {
			return fail(400, { message: 'INVALID_USER_ID' });
		}
		if (!groupId || typeof groupId !== 'string') {
			return fail(400, { message: 'GROUP_NOT_SELECTED' });
		}

		// Verify selected group exists and user has admin rights on that specific group
		const userGroupRelation = locals.groups.find((g) => g.groupId === groupId && g.isAdmin === true);
		if (!userGroupRelation) {
			return fail(403, { message: 'NO_ADMIN_RIGHTS_ON_GROUP' });
		}

		// Verify target user exists
		const targetUser = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, userId))
			.limit(1);

		if (targetUser.length === 0) {
			return fail(404, { message: 'USER_NOT_FOUND' });
		}

		// Verify group exists
		const group = await db
			.select()
			.from(schema.group)
			.where(eq(schema.group.id, groupId))
			.limit(1);

		if (group.length === 0) {
			return fail(404, { message: 'GROUP_NOT_FOUND' });
		}

		// Add user to group
		const result = await addUserToGroupUtil(db, groupId, userId);

		if (!result.success) {
			if (result.error === 'USER_ALREADY_IN_GROUP') {
				return fail(400, { message: 'USER_ALREADY_IN_GROUP' });
			}
			return fail(500, { message: 'DATABASE_ERROR' });
		}

		// Return success - the form enhancement will automatically refresh the page data
		return { success: true, message: 'USER_ADDED_SUCCESSFULLY' };
	}
};
