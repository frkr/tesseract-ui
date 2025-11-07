import { describe, expect, it, vi } from 'vitest';

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

describe('user index load', () => {
	it('redirects to profile', () => {
		expect(() => load()).toThrowError();
		expect(redirectMock).toHaveBeenCalledWith(302, '/user/profile');
	});
});
