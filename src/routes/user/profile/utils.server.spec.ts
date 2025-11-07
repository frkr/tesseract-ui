import { describe, expect, it, vi } from 'vitest';
import { addUserToGroup, getUsersInGroup } from './utils.server';
import * as schema from '$lib/db/schema';

vi.mock('$lib/db/schema', async () => {
	const actual = await vi.importActual<typeof import('$lib/db/schema')>('$lib/db/schema');
	return actual;
});

describe('addUserToGroup', () => {
	it('inserts relation when none exists', async () => {
		const whereMock = vi.fn().mockResolvedValue([]);
		const valuesMock = vi.fn().mockResolvedValue(undefined);
		const db = {
			select: vi.fn(() => ({
				from: vi.fn(() => ({
					where: whereMock
				}))
			})),
			insert: vi.fn(() => ({
				values: valuesMock
			}))
		} as any;

		const result = await addUserToGroup(db, 'group-1', 'user-1');

		expect(whereMock).toHaveBeenCalled();
		expect(valuesMock).toHaveBeenCalledWith({
			groupId: 'group-1',
			userId: 'user-1',
			adm: false
		});
		expect(result).toEqual({ success: true });
	});

	it('returns error when relation already exists', async () => {
		const db = {
			select: vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn().mockResolvedValue([{}])
				}))
			})),
			insert: vi.fn()
		} as any;

		const result = await addUserToGroup(db, 'group-1', 'user-1');

		expect(result).toEqual({ success: false, error: 'USER_ALREADY_IN_GROUP' });
	});

	it('returns specific error for duplicate key violation', async () => {
		const db = {
			select: vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn().mockResolvedValue([])
				}))
			})),
			insert: vi.fn(() => ({
				values: vi.fn(async () => {
					const err = new Error('duplicate') as Error & { code?: string };
					err.code = '23505';
					throw err;
				})
			}))
		} as any;

		const result = await addUserToGroup(db, 'group-1', 'user-1');

		expect(result).toEqual({ success: false, error: 'USER_ALREADY_IN_GROUP' });
	});

	it('returns database error for other exceptions', async () => {
		const db = {
			select: vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn().mockResolvedValue([])
				}))
			})),
			insert: vi.fn(() => ({
				values: vi.fn(async () => {
					throw new Error('unexpected');
				})
			}))
		} as any;

		const result = await addUserToGroup(db, 'group-1', 'user-1');

		expect(result).toEqual({ success: false, error: 'DATABASE_ERROR' });
	});
});

describe('getUsersInGroup', () => {
	it('maps database results to expected shape', async () => {
		const records = [
			{ id: '1', username: 'user1', name: 'User 1', isAdmin: true },
			{ id: '2', username: 'user2', name: null, isAdmin: null }
		];

		const whereMock = vi.fn().mockResolvedValue(records);
		const innerJoinMock = vi.fn(() => ({
			where: whereMock
		}));

		const db = {
			select: vi.fn(() => ({
				from: vi.fn(() => ({
					innerJoin: innerJoinMock
				}))
			}))
		} as any;

		const result = await getUsersInGroup(db, 'group-1');

		expect(innerJoinMock).toHaveBeenCalledWith(schema.user, expect.anything());
		expect(whereMock).toHaveBeenCalled();
		expect(result).toEqual([
			{ id: '1', username: 'user1', name: 'User 1', isAdmin: true },
			{ id: '2', username: 'user2', name: null, isAdmin: false }
		]);
	});
});
