import { describe, it, expect } from 'vitest';
import { load, prerender } from './+page.server';

describe('routes/p/[id]/+page.server', () => {
	it('should export prerender as false', () => {
		expect(prerender).toBe(false);
	});

	it('should return id from params', () => {
		const mockEvent = {
			params: {
				id: 'test-id-123'
			}
		};

		const result = load(mockEvent as any);

		expect(result).toEqual({
			id: 'test-id-123'
		});
	});

	it('should handle different id values', () => {
		const testCases = [
			{ id: '1' },
			{ id: 'abc-123' },
			{ id: 'very-long-id-with-special-chars-!@#' },
			{ id: '' }
		];

		testCases.forEach((testCase) => {
			const mockEvent = {
				params: testCase
			};

			const result = load(mockEvent as any);

			expect(result).toEqual({
				id: testCase.id
			});
		});
	});

	it('should return object with id property', () => {
		const mockEvent = {
			params: {
				id: 'any-id'
			}
		};

		const result = load(mockEvent as any);

		expect(result).toHaveProperty('id');
		expect(typeof result.id).toBe('string');
	});
});
