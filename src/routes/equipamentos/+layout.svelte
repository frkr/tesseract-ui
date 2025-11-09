<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { LayoutServerData } from './$types';
	import type { Snippet } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutServerData } = $props();

	let open = $state(true);

	const crumbs = $derived([
		{ label: 'Home', href: '/home' },
		{ label: 'Equipamentos', href: '/equipamentos' }
	]);

	const isRoot = $derived($page.url.pathname === '/equipamentos');
</script>

<svelte:head>
	<title>Gestao de Equipamentos</title>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col" {open}>
		<SiteHeader onmouseenter={() => (open = true)} breadcrumbs={crumbs} />
		<div class="flex flex-1">
			<AppSidebar user={data.user} onmouseenter={() => (open = true)} />
			<Sidebar.Inset
				onmouseenter={() => (open = false)}
				class="@container/main gap-4 px-2 py-4 md:gap-6 md:py-6 lg:px-4"
			>
				{#if isRoot}
					<div class="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h1 class="text-2xl font-semibold tracking-tight">Gestao de equipamentos</h1>
							<p class="text-sm text-muted-foreground">
								Rastreie cadastros, movimentacoes e responsabilizacao dos ativos corporativos.
							</p>
						</div>
						<div class="flex flex-wrap gap-2">
							<button
								class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
								onclick={() => goto('/equipamentos/novo')}
							>
								Novo equipamento
							</button>
							<button
								class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								onclick={() => goto('/equipamentos/dashboard')}
								disabled
							>
								Relatorios (em breve)
							</button>
						</div>
					</div>
				{/if}
				{@render children?.()}
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
