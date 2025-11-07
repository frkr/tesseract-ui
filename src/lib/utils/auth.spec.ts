import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	generateSessionToken,
	createSession,
	validateSessionToken,
	invalidateSession,
	setSessionTokenCookie,
	deleteSessionTokenCookie,
	sessionCookieName,
	createUTCDate
} from './auth';
import type { RequestEvent } from '@sveltejs/kit';
import * as dbModule from '$lib/db';
import * as table from '$lib/db/schema';

vi.mock('$env/static/private', () => ({
	SESSION_EXPIRY_HOURS: '6',
	SESSION_COOKIE_NAME: 'auth_session'
}));

const getUserGroupsAndAdminMock = vi.hoisted(() => vi.fn());

vi.mock('$lib/utils/common', () => ({
	getUserGroupsAndAdmin: getUserGroupsAndAdminMock
}));

// Mock the db module
vi.mock('$lib/db', () => ({
	db: {
		insert: vi.fn(),
		select: vi.fn(),
		update: vi.fn(),
		delete: vi.fn()
	}
}));

// Mock messages
vi.mock('$lib/paraglide/messages.js', () => ({
	m: {
		invalidDateValue: () => 'Invalid date value',
		invalidExpirationDate: () => 'Invalid expiration date'
	}
}));

describe('createUTCDate', () => {
	it('should create a valid Date from timestamp', () => {
		const timestamp = Date.now();
		const date = createUTCDate(timestamp);

		expect(date).toBeInstanceOf(Date);
		expect(date.getTime()).toBe(timestamp);
	});

	it('should handle zero timestamp', () => {
		const date = createUTCDate(0);
		expect(date).toBeInstanceOf(Date);
		expect(date.getTime()).toBe(0);
	});

	it('should handle future timestamp', () => {
		const futureTimestamp = Date.now() + 1000000;
		const date = createUTCDate(futureTimestamp);
		expect(date).toBeInstanceOf(Date);
		expect(date.getTime()).toBe(futureTimestamp);
	});

	it('should throw error for invalid timestamp', () => {
		const invalidTimestamp = NaN;
		expect(() => createUTCDate(invalidTimestamp)).toThrow('Invalid date value');
	});

	it('should handle negative timestamp', () => {
		const negativeTimestamp = -1000;
		const date = createUTCDate(negativeTimestamp);
		expect(date).toBeInstanceOf(Date);
		expect(date.getTime()).toBe(negativeTimestamp);
	});
});

describe('generateSessionToken', () => {
	it('should return a non-empty string', () => {
		const token = generateSessionToken();

		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);

		expect.assertions(2);
	});

	it('should generate unique tokens', () => {
		const token1 = generateSessionToken();
		const token2 = generateSessionToken();
		const token3 = generateSessionToken();

		expect(token1).not.toBe(token2);
		expect(token2).not.toBe(token3);
		expect(token1).not.toBe(token3);

		expect.assertions(3);
	});

	it('should generate tokens with expected base64url format', () => {
		const token = generateSessionToken();

		// Base64url uses A-Z, a-z, 0-9, -, _
		const base64urlPattern = /^[A-Za-z0-9_-]+$/;
		expect(base64urlPattern.test(token)).toBe(true);

		expect.assertions(1);
	});
});

describe('createSession', () => {
	let mockDb: any;
	let mockInsert: any;
	let mockValues: any;

	beforeEach(() => {
		mockValues = vi.fn().mockResolvedValue(undefined);
		mockInsert = vi.fn(() => ({ values: mockValues }));
		mockDb = dbModule.db;
		mockDb.insert = mockInsert;
	});

	it('should create a session with correct values', async () => {
		const token = 'test-token-123';
		const userId = 'user-456';

		const session = await createSession(token, userId);

		// Verify insert was called
		expect(mockInsert).toHaveBeenCalledWith(table.session);

		// Verify the session object structure
		expect(session).toHaveProperty('id');
		expect(session).toHaveProperty('userId', userId);
		expect(session).toHaveProperty('expiresAt');
		expect(session.expiresAt instanceof Date).toBe(true);

		expect.assertions(5);
	});

	it('should set expiration time correctly', async () => {
		const token = 'test-token-456';
		const userId = 'user-789';
		const beforeTime = Date.now();

		const session = await createSession(token, userId);

		const afterTime = Date.now();
		const expectedMinExpiration = beforeTime + 1000 * 60 * 60 * 6; // 6 hours
		const expectedMaxExpiration = afterTime + 1000 * 60 * 60 * 6; // 6 hours

		expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMinExpiration);
		expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedMaxExpiration);

		expect.assertions(2);
	});

	it('should call database insert with session object', async () => {
		const token = 'test-token-789';
		const userId = 'user-012';

		await createSession(token, userId);

		expect(mockValues).toHaveBeenCalledWith(
			expect.objectContaining({
				id: expect.any(String),
				userId: userId,
				expiresAt: expect.any(Date)
			})
		);

		expect.assertions(1);
	});
});

describe('validateSessionToken', () => {
	let mockDb: any;
	let mockSelect: any;
	let mockFrom: any;
	let mockInnerJoin: any;
	let mockWhere: any;
	let mockUpdate: any;
	let mockSet: any;
	let mockDelete: any;

	beforeEach(() => {
		mockWhere = vi.fn();
		mockSet = vi.fn(() => ({ where: mockWhere }));
		mockUpdate = vi.fn(() => ({ set: mockSet }));
		mockInnerJoin = vi.fn(() => ({ where: mockWhere }));
		mockFrom = vi.fn(() => ({ innerJoin: mockInnerJoin }));
		mockSelect = vi.fn(() => ({ from: mockFrom }));
		mockDelete = vi.fn(() => ({ where: mockWhere }));

		mockDb = dbModule.db;
		mockDb.select = mockSelect;
		mockDb.update = mockUpdate;
		mockDb.delete = mockDelete;
		getUserGroupsAndAdminMock.mockReset();
		getUserGroupsAndAdminMock.mockResolvedValue([]);
	});

	it('should return null for non-existent session', async () => {
		const token = 'non-existent-token';

		// Mock empty result
		mockWhere.mockResolvedValueOnce([]);

		const result = await validateSessionToken(token);

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
		expect(mockSelect).toHaveBeenCalled();

		expect.assertions(3);
	});

	it('should delete and return null for expired session', async () => {
		const token = 'expired-token';
		const expiredDate = new Date(Date.now() - 1000); // 1 second ago

		const mockResult = {
			session: {
				id: 'session-123',
				userId: 'user-456',
				expiresAt: expiredDate
			},
			user: {
				id: 'user-456',
				username: 'testuser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);
		mockWhere.mockResolvedValueOnce(undefined); // for delete

		const result = await validateSessionToken(token);

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
		expect(mockDelete).toHaveBeenCalled();

		expect.assertions(3);
	});

	it('should return valid session without renewal when not close to expiration', async () => {
		const token = 'valid-token';
		const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 5); // 5 hours from now

		const mockResult = {
			session: {
				id: 'session-789',
				userId: 'user-012',
				expiresAt: futureDate
			},
			user: {
				id: 'user-012',
				username: 'validuser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);

		const result = await validateSessionToken(token);

		expect(result.session).not.toBeNull();
		expect(result.user).not.toBeNull();
		expect(result.session?.id).toBe('session-789');
		expect(result.user?.username).toBe('validuser');
		expect(mockUpdate).not.toHaveBeenCalled();

		expect.assertions(5);
	});

	it('should renew session when close to expiration', async () => {
		const token = 'renew-token';
		// Set expiration to 2 hours from now (within renewal window of 3 hours)
		const expiringDate = new Date(Date.now() + 1000 * 60 * 60 * 2);

		const mockResult = {
			session: {
				id: 'session-345',
				userId: 'user-678',
				expiresAt: expiringDate
			},
			user: {
				id: 'user-678',
				username: 'renewuser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);
		mockWhere.mockResolvedValueOnce(undefined); // for update

		const result = await validateSessionToken(token);

		expect(result.session).not.toBeNull();
		expect(result.user).not.toBeNull();
		expect(mockUpdate).toHaveBeenCalled();
		expect(mockSet).toHaveBeenCalledWith(
			expect.objectContaining({
				expiresAt: expect.any(Date)
			})
		);

		expect.assertions(4);
	});

	it('should return correct user data structure', async () => {
		const token = 'data-token';
		const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 5);

		const mockResult = {
			session: {
				id: 'session-999',
				userId: 'user-888',
				expiresAt: futureDate
			},
			user: {
				id: 'user-888',
				username: 'datauser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);

		const result = await validateSessionToken(token);

		expect(result.user).toHaveProperty('id', 'user-888');
		expect(result.user).toHaveProperty('username', 'datauser');

		expect.assertions(2);
	});

	it('should delete session and return null when expiresAt is invalid', async () => {
		const token = 'invalid-date-token';
		const invalidDate = new Date('invalid-date');

		const mockResult = {
			session: {
				id: 'session-invalid',
				userId: 'user-123',
				expiresAt: invalidDate
			},
			user: {
				id: 'user-123',
				username: 'testuser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);
		mockWhere.mockResolvedValueOnce(undefined); // for delete

		const result = await validateSessionToken(token);

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
		expect(mockDelete).toHaveBeenCalled();

		expect.assertions(3);
	});

	it('should delete session and return null when expiresAt is null', async () => {
		const token = 'null-date-token';

		const mockResult = {
			session: {
				id: 'session-null',
				userId: 'user-456',
				expiresAt: null
			},
			user: {
				id: 'user-456',
				username: 'testuser'
			}
		};

		mockWhere.mockResolvedValueOnce([mockResult]);
		mockWhere.mockResolvedValueOnce(undefined); // for delete

		const result = await validateSessionToken(token);

		expect(result.session).toBeNull();
		expect(result.user).toBeNull();
		expect(mockDelete).toHaveBeenCalled();

		expect.assertions(3);
	});
});

describe('invalidateSession', () => {
	let mockDb: any;
	let mockDelete: any;
	let mockWhere: any;

	beforeEach(() => {
		mockWhere = vi.fn().mockResolvedValue(undefined);
		mockDelete = vi.fn(() => ({ where: mockWhere }));

		mockDb = dbModule.db;
		mockDb.delete = mockDelete;
	});

	it('should call database delete with correct session id', async () => {
		const sessionId = 'session-to-delete';

		await invalidateSession(sessionId);

		expect(mockDelete).toHaveBeenCalledWith(table.session);
		expect(mockWhere).toHaveBeenCalled();

		expect.assertions(2);
	});

	it('should handle multiple invalidation calls', async () => {
		await invalidateSession('session-1');
		await invalidateSession('session-2');
		await invalidateSession('session-3');

		expect(mockDelete).toHaveBeenCalledTimes(3);

		expect.assertions(1);
	});
});

describe('setSessionTokenCookie', () => {
	let mockEvent: RequestEvent;
	let mockCookiesSet: any;

	beforeEach(() => {
		mockCookiesSet = vi.fn();
		mockEvent = {
			cookies: {
				set: mockCookiesSet,
				delete: vi.fn(),
				get: vi.fn(),
				getAll: vi.fn(),
				serialize: vi.fn()
			}
		} as unknown as RequestEvent;
	});

	it('should call cookies.set with correct parameters', () => {
		const token = 'cookie-token-123';
		const expiresAt = new Date(Date.now() + 10000);

		setSessionTokenCookie(mockEvent, token, expiresAt);

		expect(mockCookiesSet).toHaveBeenCalledWith(sessionCookieName, token, {
			expires: expiresAt,
			path: '/'
		});

		expect.assertions(1);
	});

	it('should use correct cookie name', () => {
		const token = 'test-token';
		const expiresAt = new Date();

		setSessionTokenCookie(mockEvent, token, expiresAt);

		expect(mockCookiesSet).toHaveBeenCalledWith(
			expect.stringContaining('auth'),
			expect.any(String),
			expect.any(Object)
		);

		expect.assertions(1);
	});

	it('should set cookie path to root', () => {
		const token = 'path-token';
		const expiresAt = new Date();

		setSessionTokenCookie(mockEvent, token, expiresAt);

		expect(mockCookiesSet).toHaveBeenCalledWith(
			expect.any(String),
			expect.any(String),
			expect.objectContaining({ path: '/' })
		);

		expect.assertions(1);
	});

	it('should throw error for invalid expiration date', () => {
		const token = 'test-token';
		const invalidDate = new Date('invalid-date');

		expect(() => setSessionTokenCookie(mockEvent, token, invalidDate)).toThrow(
			'Invalid expiration date'
		);

		expect.assertions(1);
	});

	it('should throw error for null expiration date', () => {
		const token = 'test-token';
		const nullDate = null as any;

		expect(() => setSessionTokenCookie(mockEvent, token, nullDate)).toThrow(
			'Invalid expiration date'
		);

		expect.assertions(1);
	});
});

describe('deleteSessionTokenCookie', () => {
	let mockEvent: RequestEvent;
	let mockCookiesDelete: any;

	beforeEach(() => {
		mockCookiesDelete = vi.fn();
		mockEvent = {
			cookies: {
				set: vi.fn(),
				delete: mockCookiesDelete,
				get: vi.fn(),
				getAll: vi.fn(),
				serialize: vi.fn()
			}
		} as unknown as RequestEvent;
	});

	it('should call cookies.delete with correct parameters', () => {
		deleteSessionTokenCookie(mockEvent);

		expect(mockCookiesDelete).toHaveBeenCalledWith(sessionCookieName, {
			path: '/'
		});

		expect.assertions(1);
	});

	it('should use correct cookie name', () => {
		deleteSessionTokenCookie(mockEvent);

		expect(mockCookiesDelete).toHaveBeenCalledWith(
			expect.stringContaining('auth'),
			expect.any(Object)
		);

		expect.assertions(1);
	});

	it('should delete cookie from root path', () => {
		deleteSessionTokenCookie(mockEvent);

		expect(mockCookiesDelete).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ path: '/' })
		);

		expect.assertions(1);
	});
});
