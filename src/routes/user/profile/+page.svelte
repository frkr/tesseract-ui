<script lang="ts">
	import '$lib/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { m } from '$lib/paraglide/messages.js';
	import { setLocale } from '$lib/paraglide/runtime';

	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageServerData } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
	<Card.Root>
		<Card.Header>
			<Card.Title>{m.hello({ name: data.user.username })}</Card.Title>
			<Card.Description>
				ID: {data.user.id}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="mb-4">
				<Button variant="outline" onclick={() => setLocale('pt-br')}>pt-br</Button>
				<Button variant="outline" onclick={() => setLocale('en')}>en</Button>
			</div>
			<form method="post" action="?/logout" use:enhance>
				<Button type="submit">{m.signOut()}</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
