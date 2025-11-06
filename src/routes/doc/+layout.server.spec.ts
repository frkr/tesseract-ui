import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { load } from './+layout.server';
import { getRequestEvent } from '$app/server';

// Mock dependencies
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));

describe('/doc/+layout.server', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should redirect to login if user is not logged in', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: { user: null }
		});
		vi.mocked(redirect).mockImplementation(() => {
			throw new Error('redirect');
		});

		await expect(load()).rejects.toThrow('redirect');
		expect(redirect).toHaveBeenCalledWith(302, '/user/login');
	});

	it('should return data for logged in user', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				session: { id: 'session-1' },
				groups: []
			}
		});

		const result = await load();

		expect(result).toHaveProperty('user');
		expect(result).toHaveProperty('menu');
		expect(result.menu).toEqual([]);
	});
});
