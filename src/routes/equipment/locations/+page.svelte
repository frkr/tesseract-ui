<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const typeLabel: Record<string, string> = {
		matriz: 'Matriz',
		filial: 'Filial',
		sala: 'Sala',
		externo: 'Externo'
	};
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Locais e unidades</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Monitore distribuicao de ativos por local. Integre este painel com CRUD completo em proximos
			passos.
		</p>
	</section>

	<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each data.locations as location}
			<div class="rounded-lg border border-border bg-card p-5 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-xl font-semibold">{location.name}</h2>
						<p class="text-xs uppercase tracking-wide text-muted-foreground">
							{typeLabel[location.type] ?? location.type}
						</p>
					</div>
					<span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
						{location.total} ativos
					</span>
				</div>
				<div class="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
					<div class="rounded-md bg-emerald-500/10 p-3">
						<p class="text-xs uppercase tracking-wide text-emerald-700">Ativos</p>
						<p class="mt-1 text-lg font-semibold">{location.ativos}</p>
					</div>
					<div class="rounded-md bg-amber-500/10 p-3">
						<p class="text-xs uppercase tracking-wide text-amber-700">Manutencao</p>
						<p class="mt-1 text-lg font-semibold">{location.emManutencao}</p>
					</div>
					<div class="rounded-md bg-rose-500/10 p-3">
						<p class="text-xs uppercase tracking-wide text-rose-700">Inativos</p>
						<p class="mt-1 text-lg font-semibold">{location.inativos}</p>
					</div>
				</div>
				<button
					type="button"
					class="mt-4 inline-flex items-center rounded-md border border-border px-4 py-2 text-xs font-medium hover:bg-muted/40"
				>
					Configurar regras
				</button>
			</div>
		{/each}
	</section>
</div>

