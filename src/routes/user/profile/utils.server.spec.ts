import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addUserToGroup, getUsersInGroup } from './utils.server';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/db/schema';

describe('utils.server', () => {
	let mockDb: any;
	let mockSelect: any;
	let mockFrom: any;
	let mockWhere: any;
	let mockInsert: any;
	let mockValues: any;
	let mockInnerJoin: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockWhere = vi.fn();
		mockInnerJoin = vi.fn(() => ({ where: mockWhere }));
		mockFrom = vi.fn(() => ({ innerJoin: mockInnerJoin }));
		mockSelect = vi.fn(() => ({ from: mockFrom }));
		mockValues = vi.fn().mockResolvedValue(undefined);
		mockInsert = vi.fn(() => ({ values: mockValues }));

		mockDb = {
			select: mockSelect,
			insert: mockInsert
		} as unknown as PostgresJsDatabase<typeof schema>;
	});

	describe('addUserToGroup', () => {
		it('should return success when adding user to group', async () => {
			mockWhere.mockResolvedValueOnce([]); // No existing relation

			const result = await addUserToGroup(mockDb, 'group-1', 'user-1');

			expect(result.success).toBe(true);
			expect(mockInsert).toHaveBeenCalled();
			expect(mockValues).toHaveBeenCalledWith({
				groupId: 'group-1',
				userId: 'user-1',
				adm: false
			});
		});

		it('should return error when user is already in group', async () => {
			mockWhere.mockResolvedValueOnce([{ groupId: 'group-1', userId: 'user-1' }]);

			const result = await addUserToGroup(mockDb, 'group-1', 'user-1');

			expect(result.success).toBe(false);
			expect(result.error).toBe('USER_ALREADY_IN_GROUP');
			expect(mockInsert).not.toHaveBeenCalled();
		});

		it('should handle database errors', async () => {
			mockWhere.mockResolvedValueOnce([]);
			mockValues.mockRejectedValueOnce({ code: '23505' }); // Duplicate key error

			const result = await addUserToGroup(mockDb, 'group-1', 'user-1');

			expect(result.success).toBe(false);
			expect(result.error).toBe('USER_ALREADY_IN_GROUP');
		});

		it('should handle generic database errors', async () => {
			mockWhere.mockResolvedValueOnce([]);
			mockValues.mockRejectedValueOnce(new Error('Database error'));

			const result = await addUserToGroup(mockDb, 'group-1', 'user-1');

			expect(result.success).toBe(false);
			expect(result.error).toBe('DATABASE_ERROR');
		});
	});

	describe('getUsersInGroup', () => {
		it('should return users in group', async () => {
			const mockResults = [
				{
					id: 'user-1',
					username: 'user1',
					name: 'User 1',
					isAdmin: true
				},
				{
					id: 'user-2',
					username: 'user2',
					name: 'User 2',
					isAdmin: false
				}
			];

			mockWhere.mockResolvedValueOnce(mockResults);

			const result = await getUsersInGroup(mockDb, 'group-1');

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				id: 'user-1',
				username: 'user1',
				name: 'User 1',
				isAdmin: true
			});
			expect(result[1]).toEqual({
				id: 'user-2',
				username: 'user2',
				name: 'User 2',
				isAdmin: false
			});
		});

		it('should return empty array when group has no users', async () => {
			mockWhere.mockResolvedValueOnce([]);

			const result = await getUsersInGroup(mockDb, 'group-1');

			expect(result).toEqual([]);
		});

		it('should default isAdmin to false when null', async () => {
			const mockResults = [
				{
					id: 'user-1',
					username: 'user1',
					name: 'User 1',
					isAdmin: null
				}
			];

			mockWhere.mockResolvedValueOnce(mockResults);

			const result = await getUsersInGroup(mockDb, 'group-1');

			expect(result[0].isAdmin).toBe(false);
		});
	});
});
