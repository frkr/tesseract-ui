<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { m } from '$lib/paraglide/messages.js';

	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">

	<!-- FIXME convert this code below in a Card component -->
<h1>{m.hello(data.user.username)}</h1>
<p>ID: {data.user.id}.</p>
<form method="post" action="?/logout" use:enhance>
	<!-- FIXME translate this -->
	<button>Sign out</button>
</form>

</div>
