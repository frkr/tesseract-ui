<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';

	import AppSidebar from "./app-sidebar.svelte";
	import NavActions from "./nav-actions.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	let open = $state(true);

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<Sidebar.Provider  open={open}>
	<AppSidebar />
	<Sidebar.Inset  onmouseenter={() => (open = false)} onmouseleave={() => (open = true)}>
		<header class="flex h-14 shrink-0 items-center gap-2">
			<div class="flex flex-1 items-center gap-2 px-3">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Page class="line-clamp-1">
								Project Management & Task Tracking
							</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
			<div class="ml-auto px-3">
				<NavActions />
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 px-4 py-10">
			<div class="bg-muted/50 mx-auto h-24 w-full max-w-3xl rounded-xl"></div>
			<div class="bg-muted/50 mx-auto h-full w-full max-w-3xl rounded-xl"></div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
