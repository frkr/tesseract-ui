import type { Component } from 'svelte';
import UsersIcon from '@lucide/svelte/icons/users';
import FolderIcon from '@lucide/svelte/icons/folder';
import BuildingIcon from '@lucide/svelte/icons/building';
import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
import ShieldIcon from '@lucide/svelte/icons/shield';
import Settings2Icon from '@lucide/svelte/icons/settings-2';
import CommandIcon from '@lucide/svelte/icons/command';
import SparklesIcon from '@lucide/svelte/icons/sparkles';
import TargetIcon from '@lucide/svelte/icons/target';
import ZapIcon from '@lucide/svelte/icons/zap';
import RocketIcon from '@lucide/svelte/icons/rocket';
import HeartIcon from '@lucide/svelte/icons/heart';
import StarIcon from '@lucide/svelte/icons/star';
import GemIcon from '@lucide/svelte/icons/gem';
import AwardIcon from '@lucide/svelte/icons/award';
import GlobeIcon from '@lucide/svelte/icons/globe';
import PaletteIcon from '@lucide/svelte/icons/palette';
import CodeIcon from '@lucide/svelte/icons/code';
import DatabaseIcon from '@lucide/svelte/icons/database';

// List of available icons
const ICONS: Component[] = [
	UsersIcon,
	FolderIcon,
	BuildingIcon,
	BriefcaseIcon,
	ShieldIcon,
	Settings2Icon,
	CommandIcon,
	SparklesIcon,
	TargetIcon,
	ZapIcon,
	RocketIcon,
	HeartIcon,
	StarIcon,
	GemIcon,
	AwardIcon,
	GlobeIcon,
	PaletteIcon,
	CodeIcon,
	DatabaseIcon
];

/**
 * Simple hash function to convert a string to a number
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

/**
 * Returns an icon component based on the group name.
 * The same group name will always return the same icon.
 */
export function getGroupIcon(groupName: string | null): Component {
	if (!groupName) {
		return UsersIcon;
	}

	const hash = hashString(groupName);
	const index = hash % ICONS.length;
	return ICONS[index];
}
