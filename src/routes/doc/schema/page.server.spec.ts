import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockGetRequestEvent = vi.hoisted(() => vi.fn());

vi.mock('$app/server', () => ({
	getRequestEvent: mockGetRequestEvent
}));

const errorThrow = vi.hoisted(() =>
	vi.fn((status: number, message: string) => {
		const err = new Error(message) as Error & { status?: number };
		err.status = status;
		throw err;
	})
);

vi.mock('@sveltejs/kit', () => ({
	error: errorThrow
}));

import { load } from './+page.server';

describe('doc/schema load', () => {
	beforeEach(() => {
		mockGetRequestEvent.mockReset();
		errorThrow.mockClear();
	});

	it('should throw 401 when user is missing', async () => {
		mockGetRequestEvent.mockReturnValue({ locals: { user: null } });

		await expect(load()).rejects.toMatchObject({ status: 401 });
		expect(errorThrow).toHaveBeenCalledWith(401, 'Unauthorized');
	});

	it('should throw 403 when user not in group 1', async () => {
		mockGetRequestEvent.mockReturnValue({
			locals: { user: { id: 'u1' }, groups: [{ groupId: '2' }] }
		});

		await expect(load()).rejects.toMatchObject({ status: 403 });
		expect(errorThrow).toHaveBeenCalledWith(403, 'Forbidden: Access restricted to group 1');
	});

	it('should resolve when user belongs to group 1', async () => {
		mockGetRequestEvent.mockReturnValue({
			locals: {
				user: { id: 'u1' },
				groups: [{ groupId: '1' }]
			}
		});

		await expect(load()).resolves.toEqual({});
		expect(errorThrow).not.toHaveBeenCalled();
	});
});
