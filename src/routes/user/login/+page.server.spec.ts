import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect, fail } from '@sveltejs/kit';
import { load, actions } from './+page.server';
import * as auth from '$lib/utils/auth';
import * as dbModule from '$lib/db';
import * as table from '$lib/db/schema';
import { generateUniqueId, ensureDefaultAdminGroupAndRelation } from '$lib/utils/common';

// Mock dependencies
vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		redirect: vi.fn(),
		fail: vi.fn((status, data) => ({ status, data }))
	};
});

vi.mock('$lib/utils/auth');
vi.mock('$lib/db');
vi.mock('$lib/utils/common');
vi.mock('$lib/paraglide/messages.js', () => ({
	m: {
		emailInvalid: () => 'Email invalido',
		passwordInvalid: () => 'Senha invalida',
		incorrectCredentials: () => 'Credenciais incorretas',
		invalidUsername: () => 'Usuario invalido',
		invalidPassword: () => 'Senha invalida',
		errorOccurred: () => 'Erro ocorreu'
	}
}));

describe('/user/login/+page.server', () => {
	let mockEvent: any;

	beforeEach(() => {
		vi.clearAllMocks();

		mockEvent = {
			locals: {
				user: null
			},
			cookies: {
				set: vi.fn(),
				get: vi.fn()
			},
			request: {
				formData: vi.fn()
			}
		};
	});

	describe('load', () => {
		it('should redirect to profile if user is logged in', async () => {
			mockEvent.locals.user = { id: 'user-1', username: 'testuser' };
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			await expect(load(mockEvent)).rejects.toThrow('redirect');
			expect(redirect).toHaveBeenCalledWith(302, '/user/profile');
		});

		it('should return empty object if user is not logged in', async () => {
			const result = await load(mockEvent);
			expect(result).toEqual({});
		});
	});

	describe('actions.login', () => {
		it('should fail with invalid username', async () => {
			const formData = new FormData();
			formData.set('username', 'ab');
			formData.set('password', 'password123');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.login(mockEvent);
			expect(result).toEqual({ status: 400, data: { message: 'Email invalido' } });
		});

		it('should fail with invalid password', async () => {
			const formData = new FormData();
			formData.set('username', 'test@example.com');
			formData.set('password', '12345');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.login(mockEvent);
			expect(result).toEqual({ status: 400, data: { message: 'Senha invalida' } });
		});

		it('should fail with incorrect credentials', async () => {
			const formData = new FormData();
			formData.set('username', 'test@example.com');
			formData.set('password', 'password123');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => Promise.resolve([]))
				}))
			}));
			dbModule.db = { select: mockSelect } as any;

			const result = await actions.login(mockEvent);
			expect(result).toEqual({ status: 400, data: { message: 'Credenciais incorretas' } });
		});

		it('should successfully login and redirect', async () => {
			const formData = new FormData();
			formData.set('username', 'test@example.com');
			formData.set('password', 'password123');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const mockUser = {
				id: 'user-1',
				username: 'test@example.com',
				passwordHash: 'hashed-password'
			};

			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => ({
					where: vi.fn(() => Promise.resolve([mockUser]))
				}))
			}));
			dbModule.db = { select: mockSelect, insert: vi.fn() } as any;

			vi.mocked(auth.generateSessionToken).mockReturnValue('session-token');
			vi.mocked(auth.createSession).mockResolvedValue({
				id: 'session-1',
				userId: 'user-1',
				expiresAt: new Date()
			} as any);
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			// Mock crypto.subtle for password verification
			global.crypto = {
				...global.crypto,
				subtle: {
					importKey: vi.fn().mockResolvedValue({}),
					deriveBits: vi.fn().mockResolvedValue(new ArrayBuffer(32))
				} as any
			};

			await expect(actions.login(mockEvent)).rejects.toThrow('redirect');
			expect(auth.generateSessionToken).toHaveBeenCalled();
		});
	});

	describe('actions.register', () => {
		it('should fail with invalid username', async () => {
			const formData = new FormData();
			formData.set('username', 'ab');
			formData.set('password', 'password123');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			const result = await actions.register(mockEvent);
			expect(result).toEqual({ status: 400, data: { message: 'Usuario invalido' } });
		});

		it('should successfully register new user', async () => {
			const formData = new FormData();
			formData.set('username', 'newuser@example.com');
			formData.set('password', 'password123');
			mockEvent.request.formData = vi.fn().mockResolvedValue(formData);

			vi.mocked(generateUniqueId).mockReturnValue('new-user-id');
			const mockSelect = vi.fn(() => ({
				from: vi.fn(() => Promise.resolve([]))
			}));
			const mockInsert = vi.fn(() => ({
				values: vi.fn().mockResolvedValue(undefined)
			}));
			dbModule.db = {
				select: mockSelect,
				insert: mockInsert
			} as any;

			vi.mocked(auth.generateSessionToken).mockReturnValue('session-token');
			vi.mocked(auth.createSession).mockResolvedValue({
				id: 'session-1',
				userId: 'new-user-id',
				expiresAt: new Date()
			} as any);
			vi.mocked(redirect).mockImplementation(() => {
				throw new Error('redirect');
			});

			// Mock crypto.subtle for password hashing
			global.crypto = {
				...global.crypto,
				subtle: {
					importKey: vi.fn().mockResolvedValue({}),
					deriveBits: vi.fn().mockResolvedValue(new ArrayBuffer(32))
				} as any
			};

			await expect(actions.register(mockEvent)).rejects.toThrow('redirect');
			expect(generateUniqueId).toHaveBeenCalled();
		});
	});
});
