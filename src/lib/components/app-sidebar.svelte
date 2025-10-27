<script lang="ts" module>
	import AudioWaveformIcon from '@lucide/svelte/icons/audio-waveform';
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';
	import CommandIcon from '@lucide/svelte/icons/command';
	import FrameIcon from '@lucide/svelte/icons/frame';
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import MapIcon from '@lucide/svelte/icons/map';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';

	import { m } from '$lib/paraglide/messages.js';

	// This is sample data.
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		teams: [
			{
				name: 'Acme Inc',
				logo: GalleryVerticalEndIcon,
				plan: m.enterprise()
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveformIcon,
				plan: m.startup()
			},
			{
				name: 'Evil Corp.',
				logo: CommandIcon,
				plan: m.free()
			}
		],
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
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavUser from './nav-user.svelte';
	import TeamSwitcher from './team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
