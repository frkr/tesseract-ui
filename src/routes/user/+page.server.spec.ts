import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { load, actions } from './+page.server';
import * as auth from '$lib/utils/auth';
import * as dbModule from '$lib/db';
import * as schema from '$lib/db/schema';
import { getUsersInGroup, addUserToGroup as addUserToGroupUtil } from './utils.server';

// Mock dependencies
vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		redirect: vi.fn()
	};
});

vi.mock('$lib/utils/auth');
vi.mock('$lib/db');
vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));
vi.mock('./utils.server');

describe('/user/+page.server', () => {
	let mockEvent: any;
	let mockGetRequestEvent: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockEvent = {
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				session: { id: 'session-1' },
				groups: [{ groupId: '1', groupName: 'admin', isAdmin: true }]
			},
			cookies: {
				get: vi.fn(),
				set: vi.fn(),
				delete: vi.fn()
			},
			request: {
				formData: vi.fn()
			}
		};

		mockGetRequestEvent = (await import('$app/server')).getRequestEvent;
		mockGetRequestEvent.mockReturnValue({ locals: mockEvent.locals });
	});

	describe('load', () => {
		it('should redirect to login if user is not logged in', async () => {
			mockGetRequestEvent.mockReturnValue({ locals: { user: null } });
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			await expect(load()).rejects.toThrow('redirect');
			expect(redirect).toHaveBeenCalledWith(302, '/user/login');
		});

		it('should return data for logged in user', async () => {
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => Promise.resolve([]))
				}))
			}));
			dbModule.db = { select: mockSelect } as any;

			const result = await load();

			expect(result).toHaveProperty('user');
			expect(result).toHaveProperty('menu');
			expect(result).toHaveProperty('isAdministrator');
		});

		it('should fetch all users if user is administrator', async () => {
			const mockUsers = [
				{ id: 'user-1', username: 'user1', name: 'User 1' },
				{ id: 'user-2', username: 'user2', name: 'User 2' }
			];

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => Promise.resolve(mockUsers))
				}))
			}));
			dbModule.db = { select: mockSelect } as any;

			vi.mocked(getUsersInGroup).mockResolvedValue([]);

			const result = await load();

			expect(result.isAdministrator).toBe(true);
			expect(result.allUsers).toHaveLength(2);
		});
	});

	describe('actions.logout', () => {
		it('should invalidate session and redirect', async () => {
			vi.mocked(auth.invalidateSession).mockResolvedValue(undefined);
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			await expect(actions.logout(mockEvent)).rejects.toThrow('redirect');
			expect(auth.invalidateSession).toHaveBeenCalledWith('session-1');
			expect(auth.deleteSessionTokenCookie).toHaveBeenCalledWith(mockEvent);
		});

		it('should fail if no session', async () => {
			mockEvent.locals.session = null;
			const result = await actions.logout(mockEvent);
			expect(result).toEqual({ status: 401, data: undefined });
		});
	});

	describe('actions.addUserToGroup', () => {
		it('should fail if user is not logged in', async () => {
			mockEvent.locals.user = null;
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);
			expect(result).toEqual({ status: 401, data: { message: 'UNAUTHORIZED' } });
		});

		it('should fail if user is not administrator', async () => {
			mockEvent.locals.groups = [{ groupId: '2', groupName: 'user', isAdmin: false }];
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '2');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);
			expect(result).toEqual({ status: 403, data: { message: 'NOT_ADMINISTRATOR' } });
		});

		it('should fail if userId is invalid', async () => {
			const formData = new FormData();
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.addUserToGroup(mockEvent);
			expect(result).toEqual({ status: 400, data: { message: 'INVALID_USER_ID' } });
		});

		it('should successfully add user to group', async () => {
			const formData = new FormData();
			formData.set('userId', 'user-2');
			formData.set('groupId', '1');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => ({
						limit: vi.fn(() => Promise.resolve([{ id: 'user-2' }]))
					}))
				}))
			}));
			dbModule.db = {
				select: mockSelect,
				insert: vi.fn()
			} as any;

			vi.mocked(addUserToGroupUtil).mockResolvedValue({ success: true });

			const result = await actions.addUserToGroup(mockEvent);
			expect(result).toEqual({ success: true, message: 'USER_ADDED_SUCCESSFULLY' });
		});
	});
});
