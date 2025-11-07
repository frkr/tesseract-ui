import { describe, expect, it } from 'vitest';
import { load } from './+layout.server';

describe('root layout load', () => {
	it('should expose locals data', async () => {
		const locals = {
			user: { id: 'user-1' },
			session: { id: 'session-1' },
			groups: [{ groupId: 'g1' }]
		};

		const result = await load({ locals } as any);

		expect(result).toEqual({
			user: locals.user,
			session: locals.session,
			groups: locals.groups
		});
	});
});
