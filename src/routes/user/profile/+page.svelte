<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { setLocale } from '$lib/paraglide/runtime';

	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
	<Card.Root>
		<Card.Header>
			<Card.Title>{m.hello({ name: data.user.name || data.user.username })}</Card.Title>
			<Card.Description>
				ID: {data.user.id}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="mb-4">
				<h3 class="mb-2 text-sm font-medium">{m.groups()}</h3>
				{#if data.groups && data.groups.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each data.groups as group}
							<span class="inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold">
								{group.groupName || m.unknown()}
								{#if group.isAdmin}
									<span class="text-xs text-muted-foreground">{m.admin()}</span>
								{/if}
							</span>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">{m.noGroupsAssigned()}</p>
				{/if}
			</div>
			<div class="mb-4 flex gap-2">
				<Button variant="outline" onclick={() => setLocale('pt-br')} title="Português (Brasil)">
					🇧🇷
				</Button>
				<Button variant="outline" onclick={() => setLocale('en')} title="English">🇺🇸</Button>
				<Button variant="outline" onclick={() => setLocale('es')} title="Español">🇪🇸</Button>
			</div>
			<form method="post" action="?/logout" use:enhance>
				<Button type="submit">{m.signOut()}</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
