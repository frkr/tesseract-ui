import { describe, it, expect } from 'vitest';
import { load } from './+layout.server';

describe('/+layout.server', () => {
	it('should return locals data', async () => {
		const mockEvent = {
			locals: {
				user: { id: 'user-1', username: 'testuser' },
				session: { id: 'session-1' },
				groups: [{ groupId: '1', groupName: 'admin', isAdmin: true }]
			}
		};

		const result = await load(mockEvent as any);

		expect(result).toEqual({
			user: mockEvent.locals.user,
			session: mockEvent.locals.session,
			groups: mockEvent.locals.groups
		});
	});

	it('should handle null values', async () => {
		const mockEvent = {
			locals: {
				user: null,
				session: null,
				groups: null
			}
		};

		const result = await load(mockEvent as any);

		expect(result).toEqual({
			user: null,
			session: null,
			groups: null
		});
	});
});
