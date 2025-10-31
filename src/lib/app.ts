import type { Icon } from '@tabler/icons-svelte';
import CodeIcon from '@tabler/icons-svelte/icons/code';
import DatabaseIcon from '@tabler/icons-svelte/icons/database';
import CloudIcon from '@tabler/icons-svelte/icons/cloud';
import ServerIcon from '@tabler/icons-svelte/icons/server';
import BoxIcon from '@tabler/icons-svelte/icons/box';
import { m } from '$lib/paraglide/messages.js';

export interface SoftwareItem {
	title: string;
	url: string;
	icon?: Icon;
}

export function getSoftwareList(): SoftwareItem[] {
	return [
		{
			title: m.softwareTesseractCore(),
			url: '/software/tesseract-core',
			icon: CodeIcon
		},
		{
			title: m.softwareDataManager(),
			url: '/software/data-manager',
			icon: DatabaseIcon
		},
		{
			title: m.softwareCloudService(),
			url: '/software/cloud-service',
			icon: CloudIcon
		},
		{
			title: m.softwareServerPlatform(),
			url: '/software/server-platform',
			icon: ServerIcon
		},
		{
			title: m.softwarePackageManager(),
			url: '/software/package-manager',
			icon: BoxIcon
		}
	];
}
