import { eq, and } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/db/schema';

export async function addUserToGroup(
	db: PostgresJsDatabase<typeof schema>,
	groupId: string,
	userId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		// Check if the relation already exists
		const existingRelation = await db
			.select()
			.from(schema.relGroup)
			.where(and(eq(schema.relGroup.userId, userId), eq(schema.relGroup.groupId, groupId)));

		if (existingRelation.length > 0) {
			return { success: false, error: 'USER_ALREADY_IN_GROUP' };
		}

		// Insert the relation with adm: false (non-admin by default)
		await db.insert(schema.relGroup).values({
			groupId: groupId,
			userId: userId,
			adm: false
		});

		return { success: true };
	} catch (error) {
		// Handle duplicate key errors (composite primary key)
		if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
			return { success: false, error: 'USER_ALREADY_IN_GROUP' };
		}
		return { success: false, error: 'DATABASE_ERROR' };
	}
}

export async function getUsersInGroup(
	db: PostgresJsDatabase<typeof schema>,
	groupId: string
): Promise<{ id: string; username: string; name: string | null; isAdmin: boolean }[]> {
	const results = await db
		.select({
			id: schema.user.id,
			username: schema.user.username,
			name: schema.user.name,
			isAdmin: schema.relGroup.adm
		})
		.from(schema.relGroup)
		.innerJoin(schema.user, eq(schema.relGroup.userId, schema.user.id))
		.where(eq(schema.relGroup.groupId, groupId));

	return results.map((result) => ({
		id: result.id,
		username: result.username,
		name: result.name,
		isAdmin: result.isAdmin ?? false
	}));
}

