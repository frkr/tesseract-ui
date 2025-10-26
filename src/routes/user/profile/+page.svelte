<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';

	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let open = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
</div>
