import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sequence } from '@sveltejs/kit/hooks';
import { handle } from './hooks.server';
import * as auth from '$lib/utils/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';

// Mock dependencies
vi.mock('@sveltejs/kit/hooks', () => ({
	sequence: vi.fn((...handlers) => {
		return async (event: any) => {
			let result = event;
			for (const handler of handlers) {
				result = await handler({ event: result, resolve: vi.fn((e) => e) });
			}
			return result;
		};
	})
}));

vi.mock('$lib/utils/auth', () => ({
	sessionCookieName: 'auth-session',
	validateSessionToken: vi.fn(),
	setSessionTokenCookie: vi.fn(),
	deleteSessionTokenCookie: vi.fn()
}));

vi.mock('$lib/paraglide/server', () => ({
	paraglideMiddleware: vi.fn((request, callback) => {
		return callback(
			{ request, locale: 'pt-BR' },
			vi.fn((e) => e)
		);
	})
}));

describe('hooks.server', () => {
	let mockEvent: any;
	let mockResolve: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockResolve = vi.fn((event) => event);
		mockEvent = {
			request: new Request('http://localhost'),
			cookies: {
				get: vi.fn(),
				set: vi.fn(),
				delete: vi.fn()
			},
			locals: {}
		};
	});

	it('should export handle function', () => {
		expect(handle).toBeDefined();
		expect(typeof handle).toBe('function');
	});

	it('should set user to null when no session token', async () => {
		mockEvent.cookies.get.mockReturnValue(null);
		vi.mocked(auth.validateSessionToken).mockResolvedValue({
			session: null,
			user: null,
			groups: null
		});

		const result = await handle({ event: mockEvent, resolve: mockResolve });

		expect(result.locals.user).toBeNull();
		expect(result.locals.session).toBeNull();
		expect(result.locals.groups).toBeNull();
		expect(auth.validateSessionToken).not.toHaveBeenCalled();
	});

	it('should validate session token when cookie exists', async () => {
		mockEvent.cookies.get.mockReturnValue('session-token');
		vi.mocked(auth.validateSessionToken).mockResolvedValue({
			session: { id: 'session-1', userId: 'user-1', expiresAt: new Date() },
			user: { id: 'user-1', username: 'testuser' },
			groups: []
		});

		const result = await handle({ event: mockEvent, resolve: mockResolve });

		expect(auth.validateSessionToken).toHaveBeenCalledWith('session-token');
		expect(result.locals.user).toBeDefined();
		expect(result.locals.session).toBeDefined();
	});

	it('should set session cookie when session is valid', async () => {
		mockEvent.cookies.get.mockReturnValue('session-token');
		const mockSession = {
			id: 'session-1',
			userId: 'user-1',
			expiresAt: new Date(Date.now() + 3600000)
		};
		vi.mocked(auth.validateSessionToken).mockResolvedValue({
			session: mockSession,
			user: { id: 'user-1', username: 'testuser' },
			groups: []
		});

		await handle({ event: mockEvent, resolve: mockResolve });

		expect(auth.setSessionTokenCookie).toHaveBeenCalledWith(
			mockEvent,
			'session-token',
			mockSession.expiresAt
		);
	});

	it('should delete session cookie when session is invalid', async () => {
		mockEvent.cookies.get.mockReturnValue('invalid-token');
		vi.mocked(auth.validateSessionToken).mockResolvedValue({
			session: null,
			user: null,
			groups: null
		});

		await handle({ event: mockEvent, resolve: mockResolve });

		expect(auth.deleteSessionTokenCookie).toHaveBeenCalledWith(mockEvent);
	});
});
