import { describe, it, expect, vi, beforeEach } from 'vitest';
import { error } from '@sveltejs/kit';
import { load } from './+page.server';
import { getRequestEvent } from '$app/server';

// Mock dependencies
vi.mock('@sveltejs/kit', () => ({
	error: vi.fn((status, message) => {
		const err = new Error(message);
		(err as any).status = status;
		return err;
	})
}));

vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));

describe('/doc/schema/+page.server', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should throw 401 if user is not logged in', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: { user: null }
		});

		await expect(load()).rejects.toThrow();
		expect(error).toHaveBeenCalledWith(401, 'Unauthorized');
	});

	it('should throw 403 if user is not in group 1', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				groups: [{ groupId: '2', groupName: 'user', isAdmin: false }]
			}
		});

		await expect(load()).rejects.toThrow();
		expect(error).toHaveBeenCalledWith(403, 'Forbidden: Access restricted to group 1');
	});

	it('should return empty object if user is in group 1', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				groups: [{ groupId: '1', groupName: 'admin', isAdmin: true }]
			}
		});

		const result = await load();
		expect(result).toEqual({});
	});

	it('should allow access when user has multiple groups including group 1', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				groups: [
					{ groupId: '1', groupName: 'admin', isAdmin: true },
					{ groupId: '2', groupName: 'user', isAdmin: false }
				]
			}
		});

		const result = await load();
		expect(result).toEqual({});
	});
});
