<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import type { LayoutServerData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutServerData } = $props();

	let open = $state(true);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col" {open}>
		<SiteHeader onmouseenter={() => (open = true)} />
		<div class="flex flex-1">
			<AppSidebar user={data.user} onmouseenter={() => (open = true)} />
			<Sidebar.Inset
				onmouseenter={() => (open = false)}
				class="@container/main  gap-2 px-2 py-4 md:gap-2 md:py-4 lg:px-2"
			>
				{@render children?.()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
