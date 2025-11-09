<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const eventBadge = {
		cadastro: { label: 'Cadastro', style: 'bg-sky-500/20 text-sky-700' },
		movimento: { label: 'Movimento', style: 'bg-amber-500/20 text-amber-700' },
		manutencao: { label: 'Manutencao', style: 'bg-emerald-500/20 text-emerald-700' },
		status_change: { label: 'Status', style: 'bg-violet-500/20 text-violet-700' }
	} as const;
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Timeline de equipamentos</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Visualize eventos recentes agrupados por ativo. Utilize o seletor para filtrar um equipamento
			especifico.
		</p>
		<div class="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="focus">Equipamento</label>
				<select
					id="focus"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					on:change={(event) => {
						const target = event.target as HTMLSelectElement;
						const value = target.value;
						const params = new URLSearchParams(window.location.search);
						if (value === '') {
							params.delete('focus');
						} else {
							params.set('focus', value);
						}
						window.location.search = params.toString();
					}}
				>
					<option value="">Todos</option>
					{#each data.equipment as item}
						<option value={item.id} selected={data.focus?.id === item.id}>
							{item.assetCode} - {item.name}
						</option>
					{/each}
				</select>
			</div>
			{#if data.focus}
				<div class="rounded-md bg-secondary px-4 py-3 text-sm">
					<p class="font-medium">{data.focus.name}</p>
					<p class="text-xs text-muted-foreground">
						Ativo em {data.focus.locationName} - Criticidade {data.focus.criticality}
					</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		{#if data.events.length === 0}
			<p class="text-sm text-muted-foreground">Nenhum evento encontrado para o filtro atual.</p>
		{:else}
			<ol class="relative border-l border-border pl-6">
				{#each data.events as event}
					<li class="mb-8">
						<span class="absolute -left-2 top-2 h-3 w-3 rounded-full bg-primary" />
						<div class="flex flex-col gap-2 rounded-md border border-border/60 bg-background/80 p-4">
							<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
								<div>
									<h2 class="text-lg font-semibold">{event.title}</h2>
									<p class="text-xs text-muted-foreground">
										{new Date(event.timestamp).toLocaleString()} - por {event.actor}
									</p>
								</div>
								<span
									class={`self-start rounded-full px-3 py-1 text-xs font-semibold ${eventBadge[event.eventType].style}`}
								>
									{eventBadge[event.eventType].label}
								</span>
							</div>
							<p class="text-sm text-muted-foreground">{event.description}</p>
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</section>
</div>

