<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let draftCreated = false;

	let form = {
		assetCode: '',
		name: '',
		category: '',
		criticality: 'media',
		status: 'ativo',
		locationId: data.locations[0]?.id ?? '',
		custodian: '',
		nextMaintenance: ''
	};

	function handleSubmit() {
		draftCreated = true;
	}
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h1 class="text-2xl font-semibold">Cadastrar equipamento</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Informe os dados principais do ativo. Campos adicionais podem ser anexados em revisoes futuras.
		</p>
		<form class="mt-6 grid gap-6 md:grid-cols-2" on:submit|preventDefault={handleSubmit}>
			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="text-sm font-medium text-muted-foreground" for="assetCode">Codigo patrimonial</label>
				<input
					id="assetCode"
					name="assetCode"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="EQ-120"
					bind:value={form.assetCode}
					list="asset-code-suggestions"
					required
				/>
				<datalist id="asset-code-suggestions">
					{#each data.suggestedCodes as code}
						<option value={`EQ-${Number(code.split('-')[1]) + 1}`} />
					{/each}
				</datalist>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="name">Nome</label>
				<input
					id="name"
					name="name"
					class="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="Ex: Servidor Aplicacao 02"
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
					placeholder="infraestrutura"
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
				<label class="text-sm font-medium text-muted-foreground" for="status">Status inicial</label>
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
				<label class="text-sm font-medium text-muted-foreground" for="location">Local principal</label>
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
					placeholder="Responsavel primario"
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
					Criar rascunho
				</button>
				{#if draftCreated}
					<span class="ml-3 text-sm text-emerald-600">Cadastro rascunho preparado.</span>
				{/if}
			</div>
		</form>
	</section>
</div>

