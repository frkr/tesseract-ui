import { describe, expect, it } from 'vitest';
import { load } from './+page.server';

describe('p/[id] load', () => {
	it('should expose route params id', () => {
		const result = load({ params: { id: '123' } } as any);
		expect(result).toEqual({ id: '123' });
	});
});
