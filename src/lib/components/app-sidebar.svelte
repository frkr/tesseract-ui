<script lang="ts" module>
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
	import BotIcon from '@lucide/svelte/icons/bot';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import LifeBuoyIcon from '@lucide/svelte/icons/life-buoy';
	import SendIcon from '@lucide/svelte/icons/send';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import PieChartIcon from '@lucide/svelte/icons/pie-chart';
	import MapIcon from '@lucide/svelte/icons/map';
	import { m } from '$lib/paraglide/messages.js';
	import TeamSwitcher from './team-switcher.svelte';
	import { ChartPieIcon } from '@lucide/svelte';

	const data = {
		navMain: [
			{
				title: m.playground(),
				url: '#',
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: m.history(),
						url: '#'
					},
					{
						title: m.starred(),
						url: '#'
					},
					{
						title: m.settings(),
						url: '#'
					}
				]
			},
			{
				title: m.models(),
				url: '#',
				icon: BotIcon,
				items: [
					{
						title: m.genesis(),
						url: '#'
					},
					{
						title: m.explorer(),
						url: '#'
					},
					{
						title: m.quantum(),
						url: '#'
					}
				]
			},
			{
				title: m.documentation(),
				url: '#',
				icon: BookOpenIcon,
				items: [
					{
						title: m.introduction(),
						url: '#'
					},
					{
						title: m.getStarted(),
						url: '#'
					},
					{
						title: m.tutorials(),
						url: '#'
					},
					{
						title: m.changelog(),
						url: '#'
					}
				]
			},
			{
				title: m.settings(),
				url: '#',
				icon: Settings2Icon,
				items: [
					{
						title: m.general(),
						url: '#'
					},
					{
						title: m.teams(),
						url: '#'
					},
					{
						title: m.billing(),
						url: '#'
					},
					{
						title: m.limits(),
						url: '#'
					}
				]
			}
		],
		projects: [
			{
				name: m.designEngineering(),
				url: '#',
				icon: FrameIcon
			},
			{
				name: m.salesMarketing(),
				url: '#',
				icon: ChartPieIcon
			},
			{
				name: m.travel(),
				url: '#',
				icon: MapIcon
			}
		]
	};
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user?: { id: string; username: string; name: string | null } | null;
	} = $props();
</script>

<Sidebar.Root class="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={user ? { name: user.name || user.username, username: user.username, avatar: '/avatars/shadcn.jpg' } : { name: '', username: '', avatar: '/avatars/shadcn.jpg' }} />
	</Sidebar.Footer>
</Sidebar.Root>
