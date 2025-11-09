<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const equipment = data.equipment;

	let draftSaved = false;

	let form = {
		name: equipment.name,
		category: equipment.category,
		criticality: equipment.criticality,
		locationId: equipment.locationId,
		custodian: equipment.custodian ?? '',
		nextMaintenance: equipment.nextMaintenance ?? '',
		status: equipment.status
	};

	function handleSubmit() {
		draftSaved = true;
	}
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Editar equipamento</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			As alteracoes ficam em modo rascunho ate que seja criada uma revisao aprovada.
		</p>
		<form class="mt-6 grid gap-6 md:grid-cols-2" on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="name">Nome</label>
				<input
					id="name"
					name="name"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.name}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="category">Categoria</label>
				<input
					id="category"
					name="category"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.category}
					required
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="criticality">Criticidade</label>
				<select
					id="criticality"
					name="criticality"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.criticality}
				>
					<option value="baixa">Baixa</option>
					<option value="media">Media</option>
					<option value="alta">Alta</option>
					<option value="critica">Critica</option>
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="status">Status</label>
				<select
					id="status"
					name="status"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.status}
				>
					<option value="ativo">Ativo</option>
					<option value="em_manutencao">Em manutencao</option>
					<option value="inativo">Inativo</option>
				</select>
			</div>
			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="text-sm font-medium text-muted-foreground" for="location">Local atual</label>
				<select
					id="location"
					name="location"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.locationId}
				>
					{#each data.locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="custodian">Custodia</label>
				<input
					id="custodian"
					name="custodian"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.custodian}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="nextMaintenance"
					>Proxima manutencao</label
				>
				<input
					id="nextMaintenance"
					name="nextMaintenance"
					type="date"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					bind:value={form.nextMaintenance}
				/>
			</div>
			<div class="md:col-span-2">
				<button
					type="submit"
					class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					Salvar rascunho
				</button>
				{#if draftSaved}
					<span class="ml-3 text-sm text-emerald-600">Rascunho salvo localmente.</span>
				{/if}
			</div>
		</form>
	</section>
</div>

