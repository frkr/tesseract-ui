import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ensureDefaultAdminGroupAndRelation, getUserGroupsAndAdmin } from './common';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/db/schema';

describe('ensureDefaultAdminGroupAndRelation', () => {
	let mockDb: any;
	let mockSelect: any;
	let mockInsert: any;
	let mockFrom: any;
	let mockWhere: any;

	beforeEach(() => {
		// Reset mocks before each test
		mockWhere = vi.fn();
		mockFrom = vi.fn(() => ({ where: mockWhere }));
		mockSelect = vi.fn(() => ({ from: mockFrom }));
		mockInsert = vi.fn(() => ({ values: vi.fn() }));

		mockDb = {
			select: mockSelect,
			insert: mockInsert
		} as unknown as PostgresJsDatabase<typeof schema>;
	});

	it('should create both admin group and relation when neither exists', async () => {
		const userId = 'test-user-1';

		// Mock: admin group doesn't exist (empty array)
		mockWhere.mockResolvedValueOnce([]);

		// Mock: user-group relation doesn't exist (empty array)
		mockWhere.mockResolvedValueOnce([]);

		// Mock insert operations
		const groupInsertValues = vi.fn().mockResolvedValue(undefined);
		const relationInsertValues = vi.fn().mockResolvedValue(undefined);
		mockInsert
			.mockReturnValueOnce({ values: groupInsertValues })
			.mockReturnValueOnce({ values: relationInsertValues });

		await ensureDefaultAdminGroupAndRelation(mockDb, userId);

		// Verify admin group was checked
		expect(mockSelect).toHaveBeenCalled();
		expect(mockFrom).toHaveBeenCalled();

		// Verify admin group was created
		expect(groupInsertValues).toHaveBeenCalledWith({
			id: '1',
			name: 'admin'
		});

		// Verify relation was created with admin privileges
		expect(relationInsertValues).toHaveBeenCalledWith({
			groupId: '1',
			userId: userId,
			adm: true
		});

		expect.assertions(4);
	});

	it('should create only relation when admin group already exists', async () => {
		const userId = 'test-user-2';

		// Mock: admin group exists (non-empty array)
		mockWhere.mockResolvedValueOnce([{ id: '1', name: 'admin' }]);

		// Mock: user-group relation doesn't exist (empty array)
		mockWhere.mockResolvedValueOnce([]);

		// Mock insert operation for relation only
		const relationInsertValues = vi.fn().mockResolvedValue(undefined);
		mockInsert.mockReturnValueOnce({ values: relationInsertValues });

		await ensureDefaultAdminGroupAndRelation(mockDb, userId);

		// Verify select was called for checking group and relation
		expect(mockSelect).toHaveBeenCalled();

		// Verify insert was called only once (for relation, not for group)
		expect(mockInsert).toHaveBeenCalledTimes(1);

		// Verify relation was created with admin privileges
		expect(relationInsertValues).toHaveBeenCalledWith({
			groupId: '1',
			userId: userId,
			adm: true
		});

		expect.assertions(3);
	});

	it('should not create anything when both group and relation already exist', async () => {
		const userId = 'test-user-3';

		// Mock: admin group exists (non-empty array)
		mockWhere.mockResolvedValueOnce([{ id: '1', name: 'admin' }]);

		// Mock: user-group relation exists (non-empty array)
		mockWhere.mockResolvedValueOnce([
			{ groupId: '1', userId: userId, adm: true }
		]);

		await ensureDefaultAdminGroupAndRelation(mockDb, userId);

		// Verify select was called for checking
		expect(mockSelect).toHaveBeenCalled();

		// Verify insert was never called
		expect(mockInsert).not.toHaveBeenCalled();

		expect.assertions(2);
	});
});

describe('getUserGroupsAndAdmin', () => {
	let mockDb: any;
	let mockSelect: any;
	let mockFrom: any;
	let mockInnerJoin: any;
	let mockWhere: any;

	beforeEach(() => {
		// Reset mocks before each test
		mockWhere = vi.fn();
		mockInnerJoin = vi.fn(() => ({ where: mockWhere }));
		mockFrom = vi.fn(() => ({ innerJoin: mockInnerJoin }));
		mockSelect = vi.fn(() => ({ from: mockFrom }));

		mockDb = {
			select: mockSelect
		} as unknown as PostgresJsDatabase<typeof schema>;
	});

	it('should return multiple groups with correct admin status', async () => {
		const userId = 'test-user-1';
		const mockResults = [
			{ groupName: 'admin', isAdmin: true },
			{ groupName: 'developers', isAdmin: false },
			{ groupName: 'managers', isAdmin: true }
		];

		mockWhere.mockResolvedValueOnce(mockResults);

		const result = await getUserGroupsAndAdmin(mockDb, userId);

		expect(mockSelect).toHaveBeenCalled();
		expect(mockFrom).toHaveBeenCalled();
		expect(mockInnerJoin).toHaveBeenCalled();
		expect(mockWhere).toHaveBeenCalled();
		expect(result).toEqual([
			{ groupName: 'admin', isAdmin: true },
			{ groupName: 'developers', isAdmin: false },
			{ groupName: 'managers', isAdmin: true }
		]);

		expect.assertions(5);
	});

	it('should return empty array when user has no groups', async () => {
		const userId = 'test-user-2';
		const mockResults: any[] = [];

		mockWhere.mockResolvedValueOnce(mockResults);

		const result = await getUserGroupsAndAdmin(mockDb, userId);

		expect(mockSelect).toHaveBeenCalled();
		expect(result).toEqual([]);
		expect(result.length).toBe(0);

		expect.assertions(3);
	});

	it('should handle null groupName correctly', async () => {
		const userId = 'test-user-3';
		const mockResults = [
			{ groupName: null, isAdmin: true },
			{ groupName: 'valid-group', isAdmin: false }
		];

		mockWhere.mockResolvedValueOnce(mockResults);

		const result = await getUserGroupsAndAdmin(mockDb, userId);

		expect(result).toEqual([
			{ groupName: null, isAdmin: true },
			{ groupName: 'valid-group', isAdmin: false }
		]);
		expect(result[0].groupName).toBeNull();

		expect.assertions(2);
	});

	it('should default isAdmin to false when null', async () => {
		const userId = 'test-user-4';
		const mockResults = [
			{ groupName: 'test-group', isAdmin: null }
		];

		mockWhere.mockResolvedValueOnce(mockResults);

		const result = await getUserGroupsAndAdmin(mockDb, userId);

		expect(result).toEqual([
			{ groupName: 'test-group', isAdmin: false }
		]);
		expect(result[0].isAdmin).toBe(false);

		expect.assertions(2);
	});

	it('should handle mixed null values correctly', async () => {
		const userId = 'test-user-5';
		const mockResults = [
			{ groupName: null, isAdmin: null },
			{ groupName: 'admin', isAdmin: true },
			{ groupName: 'users', isAdmin: null }
		];

		mockWhere.mockResolvedValueOnce(mockResults);

		const result = await getUserGroupsAndAdmin(mockDb, userId);

		expect(result).toEqual([
			{ groupName: null, isAdmin: false },
			{ groupName: 'admin', isAdmin: true },
			{ groupName: 'users', isAdmin: false }
		]);

		expect.assertions(1);
	});
});
