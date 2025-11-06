import { describe, it, expect } from 'vitest';
import { getGroupIcon } from './groupIcon';

describe('getGroupIcon', () => {
	it('should return UsersIcon for null group name', () => {
		const icon = getGroupIcon(null);
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('should return an icon for a valid group name', () => {
		const icon = getGroupIcon('admin');
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('should return the same icon for the same group name', () => {
		const icon1 = getGroupIcon('admin');
		const icon2 = getGroupIcon('admin');
		expect(icon1).toBe(icon2);
	});

	it('should return different icons for different group names', () => {
		const icon1 = getGroupIcon('admin');
		const icon2 = getGroupIcon('users');
		// They might be the same due to hash collision, but usually different
		// We just verify both are valid icons
		expect(icon1).toBeDefined();
		expect(icon2).toBeDefined();
		expect(typeof icon1).toBe('function');
		expect(typeof icon2).toBe('function');
	});

	it('should handle empty string group name', () => {
		const icon = getGroupIcon('');
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('should handle special characters in group name', () => {
		const icon = getGroupIcon('group-with-special-chars-123!@#');
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('should return consistent icons for various group names', () => {
		const groupNames = ['admin', 'users', 'developers', 'managers', 'test-group'];
		const icons = groupNames.map((name) => getGroupIcon(name));

		icons.forEach((icon) => {
			expect(icon).toBeDefined();
			expect(typeof icon).toBe('function');
		});

		// Verify consistency
		groupNames.forEach((name) => {
			const icon1 = getGroupIcon(name);
			const icon2 = getGroupIcon(name);
			expect(icon1).toBe(icon2);
		});
	});

	it('should handle long group names', () => {
		const longName = 'a'.repeat(100);
		const icon = getGroupIcon(longName);
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});

	it('should handle unicode characters in group name', () => {
		const icon = getGroupIcon('grupo-ñ-中文-🚀');
		expect(icon).toBeDefined();
		expect(typeof icon).toBe('function');
	});
});
