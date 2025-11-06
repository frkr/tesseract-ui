import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { load } from './+page.server';
import { getRequestEvent } from '$app/server';

// Mock dependencies
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

vi.mock('$app/server', () => ({
	getRequestEvent: vi.fn()
}));

describe('/home/+page.server', () => {
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

	it('should return menu data for logged in user', async () => {
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
		expect(result.menu).toBeInstanceOf(Array);
		expect(result.menu.length).toBeGreaterThan(0);
	});

	it('should include menu items with correct structure', async () => {
		vi.mocked(getRequestEvent).mockReturnValue({
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				session: { id: 'session-1' },
				groups: []
			}
		});

		const result = await load();

		result.menu.forEach((menuItem: any) => {
			expect(menuItem).toHaveProperty('trigger');
			expect(menuItem).toHaveProperty('items');
			expect(Array.isArray(menuItem.items)).toBe(true);
			menuItem.items.forEach((item: any) => {
				expect(item).toHaveProperty('title');
				expect(item).toHaveProperty('href');
				expect(item).toHaveProperty('description');
			});
		});
	});
});
