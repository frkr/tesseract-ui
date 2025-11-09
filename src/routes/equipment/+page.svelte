<script lang="ts">
	import { createEquipmentStore, type EquipmentRecord } from '$lib/stores/equipment';
	import type { PageData } from './$types';

	export let data: PageData;

	const equipmentStore = createEquipmentStore(data.equipment);

	const filteredEquipment = equipmentStore.filteredEquipment;
	const filters = equipmentStore.filters;

	const statusOptions: Array<{ value: 'todos' | EquipmentRecord['status']; label: string }> = [
		{ value: 'todos', label: 'Todos' },
		{ value: 'ativo', label: 'Ativo' },
		{ value: 'em_manutencao', label: 'Em manutencao' },
		{ value: 'inativo', label: 'Inativo' }
	];

	const criticalityOptions: Array<{
		value: 'todas' | EquipmentRecord['criticality'];
		label: string;
	}> = [
		{ value: 'todas', label: 'Todas' },
		{ value: 'baixa', label: 'Baixa' },
		{ value: 'media', label: 'Media' },
		{ value: 'alta', label: 'Alta' },
		{ value: 'critica', label: 'Critica' }
	];

	function onStatusChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		equipmentStore.updateFilters({ status: target.value as EquipmentRecord['status'] | 'todos' });
	}

	function onLocationChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		equipmentStore.updateFilters({ locationId: target.value });
	}

	function onCriticalityChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		equipmentStore.updateFilters({
			criticality: target.value as EquipmentRecord['criticality'] | 'todas'
		});
	}

	function onSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		equipmentStore.updateFilters({ search: target.value });
	}
</script>

<div class="flex flex-col gap-8">
	<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<div class="rounded-lg border border-border bg-card p-4 shadow-sm">
			<p class="text-sm text-muted-foreground">Total de equipamentos</p>
			<p class="mt-2 text-3xl font-semibold">{data.summary.total}</p>
		</div>
		<div class="rounded-lg border border-border bg-card p-4 shadow-sm">
			<p class="text-sm text-muted-foreground">Ativos</p>
			<p class="mt-2 text-3xl font-semibold">{data.summary.byStatus.ativo}</p>
		</div>
		<div class="rounded-lg border border-border bg-card p-4 shadow-sm">
			<p class="text-sm text-muted-foreground">Em manutencao</p>
			<p class="mt-2 text-3xl font-semibold">{data.summary.byStatus.em_manutencao}</p>
		</div>
		<div class="rounded-lg border border-border bg-card p-4 shadow-sm">
			<p class="text-sm text-muted-foreground">Inativos</p>
			<p class="mt-2 text-3xl font-semibold">{data.summary.byStatus.inativo}</p>
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-4 shadow-sm">
		<div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
			<div class="flex flex-1 flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="search">Buscar</label>
				<input
					id="search"
					type="search"
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder="Nome, codigo ou categoria"
					value={$filters.search}
					on:input={onSearch}
				/>
			</div>
			<div class="flex flex-1 flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="status">Status</label>
				<select
					id="status"
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					on:change={onStatusChange}
					bind:value={$filters.status}
				>
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-1 flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="location">Local</label>
				<select
					id="location"
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					on:change={onLocationChange}
					bind:value={$filters.locationId}
				>
					<option value="todos">Todos</option>
					{#each data.locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-1 flex-col gap-2">
				<label class="text-sm font-medium text-muted-foreground" for="criticality">Criticidade</label>
				<select
					id="criticality"
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					on:change={onCriticalityChange}
					bind:value={$filters.criticality}
				>
					{#each criticalityOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="mt-6 grid gap-3 sm:grid-cols-2">
			<div class="rounded-md bg-secondary px-3 py-4">
				<p class="text-xs text-muted-foreground uppercase tracking-wide">Pendentes manutencao</p>
				<p class="mt-1 text-2xl font-semibold">{data.summary.withPendingMaintenance}</p>
			</div>
			<div class="rounded-md bg-secondary px-3 py-4">
				<p class="text-xs text-muted-foreground uppercase tracking-wide">Pendentes aprovacao</p>
				<p class="mt-1 text-2xl font-semibold">{data.summary.withPendingTransfer}</p>
			</div>
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card shadow-sm">
		<div class="border-b border-border px-4 py-3">
			<h2 class="text-lg font-semibold">Inventario</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-border text-sm">
				<thead class="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
					<tr>
						<th class="px-4 py-3 font-medium">Codigo</th>
						<th class="px-4 py-3 font-medium">Nome</th>
						<th class="px-4 py-3 font-medium">Categoria</th>
						<th class="px-4 py-3 font-medium">Status</th>
						<th class="px-4 py-3 font-medium">Criticidade</th>
						<th class="px-4 py-3 font-medium">Local</th>
						<th class="px-4 py-3 font-medium">Custodia</th>
						<th class="px-4 py-3 font-medium">Proxima manutencao</th>
						<th class="px-4 py-3 font-medium">Ultima movimentacao</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border bg-background">
					{#if $filteredEquipment.length === 0}
						<tr>
							<td class="px-4 py-6 text-center text-muted-foreground" colspan="9">
								Nenhum equipamento encontrado para os filtros selecionados.
							</td>
						</tr>
					{:else}
						{#each $filteredEquipment as item}
							<tr class="hover:bg-muted/40">
								<td class="px-4 py-3 font-medium">{item.assetCode}</td>
								<td class="px-4 py-3">{item.name}</td>
								<td class="px-4 py-3">{item.category}</td>
								<td class="px-4 py-3 capitalize">{item.status.replace('_', ' ')}</td>
								<td class="px-4 py-3 capitalize">{item.criticality}</td>
								<td class="px-4 py-3">{item.locationName}</td>
								<td class="px-4 py-3">{item.custodian ?? 'Nao atribuido'}</td>
								<td class="px-4 py-3">{item.nextMaintenance ?? 'Sem data'}</td>
								<td class="px-4 py-3">{item.lastMovementAt ?? 'Sem historico'}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-4 shadow-sm">
		<h2 class="text-lg font-semibold">Politicas em destaque</h2>
		<div class="mt-4 grid gap-3 md:grid-cols-2">
			{#each data.policies as policy}
				<div class="rounded-md border border-dashed border-border/60 p-3">
					<p class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						{policy.scopeType}
					</p>
					<p class="mt-1 text-base">{policy.description}</p>
					<p class="mt-2 text-xs text-muted-foreground">
						Aprova: {policy.approver} - Status: {policy.isActive ? 'Ativa' : 'Inativa'}
					</p>
				</div>
			{/each}
		</div>
	</section>
</div>

