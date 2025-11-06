import { describe, it, expect, vi } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { load } from './+page.server';

// Mock @sveltejs/kit
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn()
}));

describe('/+page.server', () => {
	it('should redirect to /home', () => {
		vi.mocked(redirect).mockImplementation(() => {
			throw new Error('redirect');
		});

		expect(() => load()).toThrow('redirect');
		expect(redirect).toHaveBeenCalledWith(302, '/home');
	});
});
