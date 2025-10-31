<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { getSoftwareList } from '$lib/app.ts';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const groups = $derived($page.data.groups || []);
	const softwareList = $derived(getSoftwareList(groups));
</script>

<Sidebar.Group>
	<Sidebar.GroupContent class="flex flex-col gap-2">
		<!-- XXX este menu é interessante mas não será usado por enquanto -->
		<!--		<Sidebar.Menu>-->
		<!--			<Sidebar.MenuItem class="flex items-center gap-2">-->
		<!--				<Sidebar.MenuButton-->
		<!--					class="bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90  min-w-8 duration-200 ease-linear"-->
		<!--					tooltipContent="Quick create"-->
		<!--				>-->
		<!--					<CirclePlusFilledIcon />-->
		<!--					<span>Quick Create</span>-->
		<!--				</Sidebar.MenuButton>-->
		<!--				<Button-->
		<!--					size="icon"-->
		<!--					class="size-8 group-data-[collapsible=icon]:opacity-0"-->
		<!--					variant="outline"-->
		<!--				>-->
		<!--					<MailIcon />-->
		<!--					<span class="sr-only">Inbox</span>-->
		<!--				</Button>-->
		<!--			</Sidebar.MenuItem>-->
		<!--		</Sidebar.Menu>-->
		<Sidebar.Menu>
			{#each softwareList as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton tooltipContent={item.title} onclick={() => goto(item.url)}>
						{#if item.icon}
							{@const IconComponent = item.icon}
							<IconComponent />
						{/if}
						<span>{item.title}</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
