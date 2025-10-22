import { describe, it, expect } from 'vitest';
import { load } from './+page';

describe('/p/[id]/+page.ts', () => {
	it('should return the id from params', () => {
		const params = { id: 'test-id-123' };
		const result = load({ params } as never);
		
		expect(result).toEqual({ id: 'test-id-123' });
	});

	it('should handle different id values', () => {
		const params = { id: 'another-id' };
		const result = load({ params } as never);
		
		expect(result).toEqual({ id: 'another-id' });
	});

	it('should handle numeric id values', () => {
		const params = { id: '12345' };
		const result = load({ params } as never);
		
		expect(result).toEqual({ id: '12345' });
	});
});
