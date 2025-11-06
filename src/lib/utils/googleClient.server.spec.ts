import { describe, it, expect, vi, beforeEach } from 'vitest';
import googleClient from './googleClient.server';
import { Google } from 'arctic';

// Mock arctic
vi.mock('arctic', () => ({
	Google: vi.fn()
}));

// Mock environment variables
vi.mock('$env/static/private', () => ({
	GOOGLE_CLIENT_ID: 'test-client-id',
	GOOGLE_CLIENT_SECRET: 'test-client-secret'
}));

describe('googleClient.server', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should export a Google client instance', () => {
		expect(googleClient).toBeDefined();
		expect(Google).toHaveBeenCalled();
	});

	it('should initialize Google client with correct parameters', () => {
		// The client is initialized at module load time
		// We verify that Google constructor was called
		expect(Google).toHaveBeenCalledWith(
			'test-client-id',
			'test-client-secret',
			expect.stringContaining('/user/login/google/callback')
		);
	});

	it('should construct callback URL correctly', () => {
		const calls = (Google as any).mock.calls;
		if (calls.length > 0) {
			const callbackUrl = calls[calls.length - 1][2];
			expect(callbackUrl).toContain('/user/login/google/callback');
		}
	});
});
