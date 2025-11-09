<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const equipment = data.equipment;

	let form = {
		origin: equipment.locationId,
		target: equipment.locationId,
		reason: '',
		expectedDate: '',
		approver: data.policies[0]?.approver ?? ''
	};

	let requestPrepared = false;

	function handleSubmit() {
		requestPrepared = true;
	}
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Solicitar movimentacao</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Defina origem, destino e motivo. O fluxo gera uma pendencia para aprovacao conforme politicas
			configuradas.
		</p>
		<form class="mt-6 grid gap-6 md:grid-cols-2" on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="origin">Origem</label>
				<select
					id="origin"
					name="origin"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.origin}
				>
					{#each data.locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="target">Destino</label>
				<select
					id="target"
					name="target"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.target}
				>
					{#each data.locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="text-sm font-medium text-muted-foreground" for="reason">Justificativa</label>
				<textarea
					id="reason"
					name="reason"
					rows="4"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="Descreva a necessidade operacional ou projeto relacionado"
					bind:value={form.reason}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="expectedDate">Data prevista</label>
				<input
					id="expectedDate"
					name="expectedDate"
					type="date"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.expectedDate}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="approver">Aprovador sugerido</label>
				<input
					id="approver"
					name="approver"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.approver}
				/>
			</div>
			<div class="md:col-span-2">
				<button
					type="submit"
					class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Registrar solicitacao
				</button>
				{#if requestPrepared}
					<span class="ml-3 text-sm text-emerald-600">Solicitacao registrada para validacao.</span>
				{/if}
			</div>
		</form>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Politicas ativas</h2>
		<div class="mt-4 grid gap-3 md:grid-cols-2">
			{#each data.policies as policy}
				<div class="rounded-md border border-dashed border-border/60 p-4">
					<p class="text-xs uppercase tracking-wide text-muted-foreground">{policy.scopeType}</p>
					<p class="mt-1 text-base font-medium">{policy.description}</p>
					<p class="mt-2 text-xs text-muted-foreground">
						Aprovador: {policy.approver} - Status: {policy.isActive ? 'Ativa' : 'Inativa'}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Passos do workflow</h2>
		<ol class="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
			<li>Solicitante envia pedido com destino e justificativa.</li>
			<li>Sistema valida politicas e identifica aprovadores.</li>
			<li>Aprovadores recebem alerta no painel dedicado.</li>
			<li>Movimentacao e inventario sao atualizados apos confirmacao.</li>
		</ol>
	</section>
</div>

