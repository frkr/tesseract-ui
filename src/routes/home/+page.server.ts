import { redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { PageServerLoad } from './$types';
import type { MenuData } from '$lib/components/menu-bread.svelte';

export const load: PageServerLoad = async () => {
	const result = requireLogin();

	// Mock menu data for /home route
	const menu: MenuData = [
		{
			trigger: 'Home',
			items: [
				{
					title: 'Dashboard',
					href: '/home',
					description: 'View your main dashboard with overview information.'
				},
				{
					title: 'Settings',
					href: '/home/settings',
					description: 'Manage your account settings and preferences.'
				},
				{
					title: 'Profile',
					href: '/user/profile',
					description: 'View and edit your user profile information.'
				}
			]
		},
		{
			trigger: 'Components',
			items: [
				{
					title: 'Data Table',
					href: '/home',
					description: 'Interactive data table with sorting and filtering capabilities.'
				},
				{
					title: 'Charts',
					href: '/home',
					description: 'Visual charts and graphs for data visualization.'
				},
				{
					title: 'Forms',
					href: '/home',
					description: 'Form components for user input and data collection.'
				}
			]
		}
	];

	return {
		...result,
		menu
	};
};

function requireLogin() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return redirect(302, '/user/login');
	}

	return locals;
}
