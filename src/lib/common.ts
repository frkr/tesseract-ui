import { encodeBase32LowerCase, encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/db/schema';

export function generateUniqueId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export async function getUserGroupsAndAdmin(
	db: PostgresJsDatabase<typeof schema>,
	userId: string
): Promise<{ groupName: string | null; isAdmin: boolean }[]> {
	const results = await db
		.select({
			groupName: schema.group.name,
			isAdmin: schema.relGroup.adm
		})
		.from(schema.relGroup)
		.innerJoin(schema.group, eq(schema.relGroup.groupId, schema.group.id))
		.where(eq(schema.relGroup.userId, userId));

	return results.map((result) => ({
		groupName: result.groupName,
		isAdmin: result.isAdmin ?? false
	}));
}

export async function ensureDefaultAdminGroupAndRelation(
	db: PostgresJsDatabase<typeof schema>,
	userId: string
): Promise<void> {
	const adminGroupId = '1';
	const adminGroupName = 'admin';

	// Check if the admin group exists
	const existingGroup = await db
		.select()
		.from(schema.group)
		.where(eq(schema.group.id, adminGroupId));

	// Insert the admin group if it doesn't exist
	if (existingGroup.length === 0) {
		await db.insert(schema.group).values({
			id: adminGroupId,
			name: adminGroupName
		});
	}

	// Check if the user-group relation already exists
	const existingRelation = await db
		.select()
		.from(schema.relGroup)
		.where(eq(schema.relGroup.userId, userId))
		.where(eq(schema.relGroup.groupId, adminGroupId));

	// Insert the relation if it doesn't exist
	if (existingRelation.length === 0) {
		await db.insert(schema.relGroup).values({
			groupId: adminGroupId,
			userId: userId,
			adm: true
		});
	}
}
