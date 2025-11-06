import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect, fail } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { load, actions } from './+page.server';
import * as auth from '$lib/utils/auth';
import * as dbModule from '$lib/db';
import * as schema from '$lib/db/schema';
import * as utilsServer from './utils.server';

// Mock dependencies
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn(),
	fail: vi.fn((status, data) => ({ status, data }))
}));

vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));

vi.mock('$lib/utils/auth');
vi.mock('$lib/db');
vi.mock('./utils.server');

describe('/user/profile/+page.server', () => {
	let mockEvent: any;
	let mockDb: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockDb = {
			select: vi.fn(),
			insert: vi.fn(),
			update: vi.fn(),
			delete: vi.fn()
		};

		dbModule.db = mockDb;

		mockEvent = {
			locals: {
				user: { id: 'user-1', username: 'testuser', name: 'Test User' },
				session: { id: 'session-1' },
				groups: [{ groupId: '1', groupName: 'admin', isAdmin: true }]
			},
			cookies: {
				set: vi.fn(),
				delete: vi.fn(),
				get: vi.fn(),
				getAll: vi.fn(),
				serialize: vi.fn()
			},
			request: {
				formData: vi.fn()
			}
		};

		vi.mocked(getRequestEvent).mockReturnValue(mockEvent as any);
	});

	describe('load', () => {
		it('should redirect to login if user is not logged in', async () => {
			mockEvent.locals.user = null;
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			await expect(load()).rejects.toThrow('redirect');
			expect(redirect).toHaveBeenCalledWith(302, '/user/login');
		});

		it('should return user data and empty menu for non-admin user', async () => {
			mockEvent.locals.user = { id: 'user-2', username: 'regular', name: 'Regular User' };
			mockEvent.locals.groups = [{ groupId: '2', groupName: 'users', isAdmin: false }];

			const result = await load();

			expect(result).toHaveProperty('user');
			expect(result).toHaveProperty('menu');
			expect(result).toHaveProperty('isAdministrator', false);
			expect(result).toHaveProperty('allUsers', []);
			expect(result).toHaveProperty('groupMemberships', {});
			expect(result.menu).toEqual([]);
		});

		it('should return user data and fetch all users for admin user', async () => {
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => Promise.resolve([]))
				}))
			}));

			mockDb.select = mockSelect;

			vi.mocked(utilsServer.getUsersInGroup).mockResolvedValue([]);

			const result = await load();

			expect(result).toHaveProperty('user');
			expect(result).toHaveProperty('isAdministrator', true);
			expect(result).toHaveProperty('allUsers');
			expect(result).toHaveProperty('groupMemberships');
			expect(mockSelect).toHaveBeenCalled();
		});

		it('should fetch group memberships for admin groups', async () => {
			const mockUsers = [
				{ id: 'user-1', username: 'user1', name: 'User 1' },
				{ id: 'user-2', username: 'user2', name: 'User 2' }
			];

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => Promise.resolve(mockUsers))
			}));

			mockDb.select = mockSelect;

			const mockGroupMembers = [
				{ id: 'user-1', username: 'user1', name: 'User 1', isAdmin: true }
			];

			vi.mocked(utilsServer.getUsersInGroup).mockResolvedValue(mockGroupMembers);

			const result = await load();

			expect(result.isAdministrator).toBe(true);
			expect(result.allUsers).toEqual(mockUsers);
			expect(utilsServer.getUsersInGroup).toHaveBeenCalledWith(mockDb, '1');
			expect(result.groupMemberships).toHaveProperty('1');
			expect(result.groupMemberships['1']).toEqual(mockGroupMembers);
		});

		it('should handle multiple admin groups', async () => {
			mockEvent.locals.groups = [
				{ groupId: '1', groupName: 'admin', isAdmin: true },
				{ groupId: '2', groupName: 'managers', isAdmin: true }
			];

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => Promise.resolve([]))
			}));

			mockDb.select = mockSelect;

			vi.mocked(utilsServer.getUsersInGroup)
				.mockResolvedValueOnce([])
				.mockResolvedValueOnce([]);

			const result = await load();

			expect(result.isAdministrator).toBe(true);
			expect(utilsServer.getUsersInGroup).toHaveBeenCalledTimes(2);
			expect(utilsServer.getUsersInGroup).toHaveBeenCalledWith(mockDb, '1');
			expect(utilsServer.getUsersInGroup).toHaveBeenCalledWith(mockDb, '2');
		});

		it('should return empty arrays when user has no admin groups', async () => {
			mockEvent.locals.groups = [{ groupId: '2', groupName: 'users', isAdmin: false }];

			const result = await load();

			expect(result.isAdministrator).toBe(false);
			expect(result.allUsers).toEqual([]);
			expect(result.groupMemberships).toEqual({});
		});
	});

	describe('actions.logout', () => {
		it('should fail if session is not present', async () => {
			mockEvent.locals.session = null;

			const result = await actions.logout(mockEvent);

			expect(result).toEqual({ status: 401, data: undefined });
			expect(auth.invalidateSession).not.toHaveBeenCalled();
		});

		it('should invalidate session and redirect on successful logout', async () => {
			vi.mocked(auth.invalidateSession).mockResolvedValue(undefined);
			vi.mocked(auth.deleteSessionTokenCookie).mockReturnValue(undefined);
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			await expect(actions.logout(mockEvent)).rejects.toThrow('redirect');
			expect(auth.invalidateSession).toHaveBeenCalledWith('session-1');
			expect(auth.deleteSessionTokenCookie).toHaveBeenCalledWith(mockEvent);
			expect(redirect).toHaveBeenCalledWith(302, '/');
		});
	});

	describe('actions.addUserToGroup', () => {
		beforeEach(() => {
			mockEvent.locals.user = { id: 'user-1', username: 'admin', name: 'Admin' };
			mockEvent.locals.groups = [{ groupId: '1', groupName: 'admin', isAdmin: true }];
		});

		it('should fail if user is not logged in', async () => {
			mockEvent.locals.user = null;
			mockEvent.locals.groups = null;

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 401, data: { message: 'UNAUTHORIZED' } });
		});

		it('should fail if user is not administrator', async () => {
			mockEvent.locals.groups = [{ groupId: '2', groupName: 'users', isAdmin: false }];

			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 403, data: { message: 'NOT_ADMINISTRATOR' } });
		});

		it('should fail with invalid user ID', async () => {
			const formData = new FormData();
			formData.set('userId', '');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 400, data: { message: 'INVALID_USER_ID' } });
		});

		it('should fail when group ID is not provided', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 400, data: { message: 'GROUP_NOT_SELECTED' } });
		});

		it('should fail when user does not have admin rights on the specific group', async () => {
			mockEvent.locals.groups = [
				{ groupId: '1', groupName: 'admin', isAdmin: true },
				{ groupId: '2', groupName: 'other', isAdmin: false }
			];

			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '2');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 403, data: { message: 'NO_ADMIN_RIGHTS_ON_GROUP' } });
		});

		it('should fail when target user does not exist', async () => {
			const formData = new FormData();
			formData.set('userId', 'non-existent-user');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn(() => Promise.resolve([]))
					}))
				}))
			}));

			mockDb.select = mockSelect;

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 404, data: { message: 'USER_NOT_FOUND' } });
		});

		it('should fail when group does not exist', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', 'non-existent-group');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockUser = { id: 'user-2', username: 'user2', name: 'User 2' };

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn((limit) => {
							if (limit === 1) {
								return Promise.resolve([mockUser]);
							}
							return Promise.resolve([]);
						})
					}))
				}))
			}));

			mockDb.select = mockSelect;

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 404, data: { message: 'GROUP_NOT_FOUND' } });
		});

		it('should successfully add user to group', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockUser = { id: 'user-2', username: 'user2', name: 'User 2' };
			const mockGroup = { id: '1', name: 'admin' };

			let callCount = 0;
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn(() => {
							callCount++;
							if (callCount === 1) {
								return Promise.resolve([mockUser]);
							}
							return Promise.resolve([mockGroup]);
						})
					}))
				}))
			}));

			mockDb.select = mockSelect;

			vi.mocked(utilsServer.addUserToGroup).mockResolvedValue({ success: true });

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ success: true, message: 'USER_ADDED_SUCCESSFULLY' });
			expect(utilsServer.addUserToGroup).toHaveBeenCalledWith(mockDb, '1', 'user-2');
		});

		it('should fail when user is already in group', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockUser = { id: 'user-2', username: 'user2', name: 'User 2' };
			const mockGroup = { id: '1', name: 'admin' };

			let callCount = 0;
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn(() => {
							callCount++;
							if (callCount === 1) {
								return Promise.resolve([mockUser]);
							}
							return Promise.resolve([mockGroup]);
						})
					}))
				}))
			}));

			mockDb.select = mockSelect;

			vi.mocked(utilsServer.addUserToGroup).mockResolvedValue({
				success: false,
				error: 'USER_ALREADY_IN_GROUP'
			});

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 400, data: { message: 'USER_ALREADY_IN_GROUP' } });
		});

		it('should handle database errors', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockUser = { id: 'user-2', username: 'user2', name: 'User 2' };
			const mockGroup = { id: '1', name: 'admin' };

			let callCount = 0;
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn(() => {
							callCount++;
							if (callCount === 1) {
								return Promise.resolve([mockUser]);
							}
							return Promise.resolve([mockGroup]);
						})
					}))
				}))
			}));

			mockDb.select = mockSelect;

			vi.mocked(utilsServer.addUserToGroup).mockResolvedValue({
				success: false,
				error: 'DATABASE_ERROR'
			});

			const result = await actions.addUserToGroup(mockEvent);

			expect(result).toEqual({ status: 500, data: { message: 'DATABASE_ERROR' } });
		});
	});
});
