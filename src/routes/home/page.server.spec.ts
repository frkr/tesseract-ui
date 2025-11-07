import { describe, expect, it, beforeEach, vi } from 'vitest';

const mockGetRequestEvent = vi.hoisted(() => vi.fn());

vi.mock('$app/server', () => ({
	getRequestEvent: mockGetRequestEvent
}));

const redirectMock = vi.hoisted(() =>
	vi.fn((status: number, location: string) => {
		const error = new Error('redirect') as Error & { status?: number; location?: string };
		error.status = status;
		error.location = location;
		throw error;
	})
);

vi.mock('@sveltejs/kit', () => ({
	redirect: redirectMock
}));

import { load } from './+page.server';

describe('home page load', () => {
	beforeEach(() => {
		mockGetRequestEvent.mockReset();
		redirectMock.mockClear();
	});

	it('should redirect to login when no user present', async () => {
		mockGetRequestEvent.mockReturnValue({ locals: { user: null } });

		await expect(load()).rejects.toMatchObject({ location: '/user/login', status: 302 });
		expect(redirectMock).toHaveBeenCalledWith(302, '/user/login');
	});

	it('should return locals data and menu for authenticated user', async () => {
		const locals = { user: { id: 'u1' }, groups: [], session: {} };
		mockGetRequestEvent.mockReturnValue({ locals });

		const result = await load();

		expect(result.menu).toBeDefined();
		expect(Array.isArray(result.menu)).toBe(true);
		expect(result.menu.length).toBeGreaterThan(0);
		expect(result.user).toBe(locals.user);
		expect(result.session).toBe(locals.session);
		expect(result.groups).toBe(locals.groups);
		expect(redirectMock).not.toHaveBeenCalled();
	});
});
