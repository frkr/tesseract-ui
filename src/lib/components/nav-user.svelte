<script lang="ts">
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import UserIcon from '@lucide/svelte/icons/user';

	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import { m } from '$lib/paraglide/messages.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let {
		user
	}: {
		user: {
			name: string;
			username: string;
			avatar: string;
		};
	} = $props();

	function handleProfileClick() {
		goto('/user/profile');
	}

	let logoutFormElement: HTMLFormElement;

	function handleLogoutClick() {
		logoutFormElement?.requestSubmit();
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name || user.username} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name || user.username}</span>
							<span class="truncate text-xs">{user.username}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={IsMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name || user.username} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name || user.username}</span>
							<span class="truncate text-xs">{user.username}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<SparklesIcon />
						{m.upgradeToPro()}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onSelect={handleProfileClick}>
						<BadgeCheckIcon />
						{m.profile()}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CreditCardIcon />
						{m.billing()}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BellIcon />
						{m.notifications()}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<form
					bind:this={logoutFormElement}
					method="post"
					action="/user/profile?/logout"
					use:enhance
				>
					<button type="submit" hidden>Submit</button>
				</form>
				<DropdownMenu.Item onSelect={handleLogoutClick}>
					<LogOutIcon />
					{m.logOut()}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
