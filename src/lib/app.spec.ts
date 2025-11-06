import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSoftwareList } from './app';
import type { GroupData } from './app';

// Mock the messages module
vi.mock('$lib/paraglide/messages.js', () => ({
	m: {
		home: () => 'Home',
		softwareDataManager: () => 'Data Manager',
		softwareCloudService: () => 'Cloud Service',
		softwareServerPlatform: () => 'Server Platform',
		softwarePackageManager: () => 'Package Manager'
	}
}));

describe('getSoftwareList', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return home item by default', () => {
		const result = getSoftwareList();

		expect(result).toHaveLength(4);
		expect(result[0]).toHaveProperty('title', 'Home');
		expect(result[0]).toHaveProperty('url', '/home');
		expect(result[0]).toHaveProperty('icon');
	});

	it('should include database manager when user is in group ID 1', () => {
		const groups: GroupData = [{ groupId: '1', groupName: 'admin', isAdmin: true }];
		const result = getSoftwareList(groups);

		expect(result).toHaveLength(5);
		expect(result[1]).toHaveProperty('title', 'Data Manager');
		expect(result[1]).toHaveProperty('url', '/doc/schema');
		expect(result[1]).toHaveProperty('icon');
	});

	it('should not include database manager when user is not in group ID 1', () => {
		const groups: GroupData = [{ groupId: '2', groupName: 'user', isAdmin: false }];
		const result = getSoftwareList(groups);

		expect(result).toHaveLength(4);
		expect(result.find((item) => item.url === '/doc/schema')).toBeUndefined();
	});

	it('should include database manager when user has multiple groups including ID 1', () => {
		const groups: GroupData = [
			{ groupId: '1', groupName: 'admin', isAdmin: true },
			{ groupId: '2', groupName: 'user', isAdmin: false }
		];
		const result = getSoftwareList(groups);

		expect(result).toHaveLength(5);
		expect(result.find((item) => item.url === '/doc/schema')).toBeDefined();
	});

	it('should always include cloud service, server platform, and package manager', () => {
		const result = getSoftwareList();

		const cloudService = result.find((item) => item.url === '/software/cloud-service');
		const serverPlatform = result.find((item) => item.url === '/software/server-platform');
		const packageManager = result.find((item) => item.url === '/software/package-manager');

		expect(cloudService).toBeDefined();
		expect(cloudService?.title).toBe('Cloud Service');
		expect(serverPlatform).toBeDefined();
		expect(serverPlatform?.title).toBe('Server Platform');
		expect(packageManager).toBeDefined();
		expect(packageManager?.title).toBe('Package Manager');
	});

	it('should return items with correct structure', () => {
		const result = getSoftwareList();

		result.forEach((item) => {
			expect(item).toHaveProperty('title');
			expect(item).toHaveProperty('url');
			expect(typeof item.title).toBe('string');
			expect(typeof item.url).toBe('string');
			if (item.icon) {
				expect(typeof item.icon).toBe('function');
			}
		});
	});

	it('should handle empty groups array', () => {
		const result = getSoftwareList([]);

		expect(result).toHaveLength(4);
		expect(result.find((item) => item.url === '/doc/schema')).toBeUndefined();
	});

	it('should handle undefined groups', () => {
		const result = getSoftwareList(undefined);

		expect(result).toHaveLength(4);
		expect(result.find((item) => item.url === '/doc/schema')).toBeUndefined();
	});
});
