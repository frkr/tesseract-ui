<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const equipment = data.equipment;

	const statusLabels: Record<typeof equipment.status, string> = {
		ativo: 'Ativo',
		em_manutencao: 'Em manutencao',
		inativo: 'Inativo'
	};
	const statusStyles: Record<typeof equipment.status, string> = {
		ativo: 'bg-emerald-500/10 text-emerald-600',
		em_manutencao: 'bg-amber-500/10 text-amber-600',
		inativo: 'bg-rose-500/10 text-rose-600'
	};

	const infoRows = [
		{ label: 'Codigo patrimonial', value: equipment.assetCode },
		{ label: 'Categoria', value: equipment.category },
		{ label: 'Criticidade', value: equipment.criticality },
		{ label: 'Custodia', value: equipment.custodian ?? 'Nao atribuido' },
		{ label: 'Local atual', value: equipment.locationName },
		{ label: 'Proxima manutencao', value: equipment.nextMaintenance ?? 'Sem data' },
		{ label: 'Ultima movimentacao', value: equipment.lastMovementAt ?? 'Sem historico' }
	];
</script>

<div class="flex flex-col gap-8">
	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div>
				<h1 class="text-2xl font-semibold">{equipment.name}</h1>
				<p class="mt-1 text-sm text-muted-foreground">ID interno: {equipment.id}</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[equipment.status]}`}>
					{statusLabels[equipment.status]}
				</span>
				<span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
					Criticidade {equipment.criticality}
				</span>
			</div>
		</div>
		<div class="mt-6 grid gap-4 sm:grid-cols-2">
			{#each infoRows as item}
				<div class="rounded-md border border-muted-foreground/10 p-4">
					<p class="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
					<p class="mt-1 text-base font-medium">{item.value}</p>
				</div>
			{/each}
		</div>
		<div class="mt-6 flex flex-wrap gap-3">
			<a
				class="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40"
				href="./edit"
				>Editar cadastro</a
			>
			<a
				class="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40"
				href="./transfer"
				>Registrar movimentacao</a
			>
			<a
				class="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40"
				href="./maintenance"
				>Agendar manutencao</a
			>
			<a
				class="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted/40"
				href="../history?focus={equipment.id}"
				>Ver timeline geral</a
			>
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Politicas aplicaveis</h2>
		<div class="mt-4 grid gap-3 md:grid-cols-2">
			{#each data.policies as policy}
				<div class="rounded-md border border-dashed border-border/60 p-4">
					<p class="text-xs uppercase tracking-wide text-muted-foreground">{policy.scopeType}</p>
					<p class="mt-1 text-base font-medium">{policy.description}</p>
					<p class="mt-2 text-xs text-muted-foreground">
						Aprovador principal: {policy.approver} - Status: {policy.isActive ? 'Ativa' : 'Inativa'}
					</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="rounded-lg border border-border bg-card p-6 shadow-sm">
		<h2 class="text-lg font-semibold">Resumo operacional</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Dias sem manutencao</p>
				<p class="mt-2 text-2xl font-semibold">42</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Transferencias anuais</p>
				<p class="mt-2 text-2xl font-semibold">3</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Pendencias abertas</p>
				<p class="mt-2 text-2xl font-semibold">{equipment.status === 'em_manutencao' ? '1' : '0'}</p>
			</div>
			<div class="rounded-md bg-secondary px-4 py-5">
				<p class="text-xs uppercase tracking-wide text-muted-foreground">Prioridade</p>
				<p class="mt-2 text-2xl font-semibold">{equipment.criticality.toUpperCase()}</p>
			</div>
		</div>
		<p class="mt-4 text-sm text-muted-foreground">
			Valores calculados para fins de prototipacao. Integrar com dados reais do banco e trilha de
			auditoria em proximas iteracoes.
		</p>
	</section>
</div>

