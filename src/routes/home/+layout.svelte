<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from './site-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from './app-sidebar.svelte';

	let { children } = $props();

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
			<AppSidebar onmouseenter={() => (open = true)} />
			<Sidebar.Inset onmouseenter={() => (open = false)} class="@container/main">
				{@render children?.()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
