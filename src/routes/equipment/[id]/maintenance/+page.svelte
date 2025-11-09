<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const equipment = data.equipment;

	let maintenanceCreated = false;
	let form = {
		type: 'preventiva',
		scheduledFor: '',
		technician: '',
		notes: ''
	};

	function handleSubmit() {
		maintenanceCreated = true;
	}
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Registrar manutencao</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			O status do equipamento sera atualizado automaticamente apos a conclusao do atendimento.
		</p>
		<form class="mt-6 grid gap-6 md:grid-cols-2" on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="text-sm font-medium text-muted-foreground">Tipo de manutencao</label>
				<div class="flex flex-wrap gap-3">
					<label class="flex items-center gap-2 text-sm">
						<input type="radio" name="type" value="preventiva" bind:group={form.type} />
						<span>Preventiva</span>
					</label>
					<label class="flex items-center gap-2 text-sm">
						<input type="radio" name="type" value="corretiva" bind:group={form.type} />
						<span>Corretiva</span>
					</label>
					<label class="flex items-center gap-2 text-sm">
						<input type="radio" name="type" value="calibracao" bind:group={form.type} />
						<span>Calibracao</span>
					</label>
				</div>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="scheduledFor">Data agendada</label>
				<input
					id="scheduledFor"
					name="scheduledFor"
					type="datetime-local"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.scheduledFor}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="technician">Tecnico responsavel</label>
				<input
					id="technician"
					name="technician"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="Nome ou time responsavel"
					bind:value={form.technician}
				/>
			</div>
			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="text-sm font-medium text-muted-foreground" for="notes">Observacoes</label>
				<textarea
					id="notes"
					name="notes"
					rows="4"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="Informe procedimentos, pecas, riscos ou checklist aplicado"
					bind:value={form.notes}
				/>
			</div>
			<div class="md:col-span-2">
				<button
					type="submit"
					class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Agendar manutencao
				</button>
				{#if maintenanceCreated}
					<span class="ml-3 text-sm text-emerald-600">Manutencao registrada.</span>
				{/if}
			</div>
		</form>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Contexto atual</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2">
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Equipamento</p>
				<p class="mt-2 text-base font-medium">{equipment.name}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
				<p class="mt-2 text-base font-medium">{equipment.status}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Ultima manutencao</p>
				<p class="mt-2 text-base font-medium">{equipment.lastMovementAt ?? 'Sem historico'}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Criticidade</p>
				<p class="mt-2 text-base font-medium">{equipment.criticality}</p>
			</div>
		</div>
	</section>
</div>

