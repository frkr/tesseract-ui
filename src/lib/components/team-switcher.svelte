<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';

	import { m } from '$lib/paraglide/messages.js';
	import { page } from '$app/stores';
	import { selectedGroup } from '$lib/stores/selectedGroup';
	import { getGroupIcon } from '$lib/utils/groupIcon';
	import { browser } from '$app/environment';

	const sidebar = useSidebar();

	// Get groups from page data
	const groups = $derived($page.data.groups || []);

	// Initialize selected group from store or default to first group
	$effect(() => {
		if (!browser || groups.length === 0) return;

		const currentSelected = $selectedGroup;
		if (currentSelected === null) {
			// No selection, default to first group
			selectedGroup.set(groups[0]);
		} else {
			// Validate that the selected group still exists in user's groups
			const groupExists = groups.some(
				(g) => g.groupName === currentSelected.groupName
			);
			if (!groupExists) {
				// Selected group no longer exists, default to first
				selectedGroup.set(groups[0]);
			}
		}
	});

	const activeGroup = $derived($selectedGroup || (groups.length > 0 ? groups[0] : null));
	const activeIcon = $derived(activeGroup ? getGroupIcon(activeGroup.groupName) : null);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						{#if activeIcon}
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<svelte:component this={activeIcon} class="size-4" />
							</div>
						{/if}
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								{activeGroup?.groupName || m.noGroupsAssigned()}
							</span>
							{#if activeGroup?.isAdmin}
								<span class="truncate text-xs">{m.admin()}</span>
							{:else}
								<span class="truncate text-xs"></span>
							{/if}
						</div>
						<ChevronsUpDownIcon class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">{m.groups()}</DropdownMenu.Label>
				{#if groups.length > 0}
					{#each groups as group, index (group.groupName || `group-${index}`)}
						{@const groupIcon = getGroupIcon(group.groupName)}
						<DropdownMenu.Item onSelect={() => selectedGroup.set(group)} class="gap-2 p-2">
							<div class="flex size-6 items-center justify-center rounded-md border">
								<svelte:component this={groupIcon} class="size-3.5 shrink-0" />
							</div>
							<div class="flex flex-1 items-center justify-between">
								<span>{group.groupName || m.unknown()}</span>
								{#if group.isAdmin}
									<span class="text-muted-foreground ml-2 text-xs">{m.admin()}</span>
								{/if}
							</div>
							<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
						</DropdownMenu.Item>
					{/each}
				{:else}
					<DropdownMenu.Item class="gap-2 p-2" disabled>
						<div class="text-muted-foreground text-sm">{m.noGroupsAssigned()}</div>
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
