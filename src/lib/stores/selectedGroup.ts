import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type SelectedGroup = {
	groupId: string | null;
	groupName: string | null;
	isAdmin: boolean;
} | null;

const STORAGE_KEY = 'selectedGroup';

function getInitialValue(): SelectedGroup {
	if (!browser) {
		return null;
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored) as SelectedGroup;
		}
	} catch {
		// If localStorage is unavailable or parsing fails, return null
	}

	return null;
}

function createSelectedGroupStore() {
	const { subscribe, set, update } = writable<SelectedGroup>(getInitialValue());

	return {
		subscribe,
		set: (value: SelectedGroup) => {
			set(value);
			if (browser) {
				try {
					if (value === null) {
						localStorage.removeItem(STORAGE_KEY);
					} else {
						localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
					}
				} catch {
					// Ignore localStorage errors
				}
			}
		},
		update
	};
}

export const selectedGroup = createSelectedGroupStore();
