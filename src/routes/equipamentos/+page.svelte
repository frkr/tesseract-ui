<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Table from '$lib/components/ui/table';
	import CircleCheckIcon from '@tabler/icons-svelte/icons/circle-check';
	import ClipboardListIcon from '@tabler/icons-svelte/icons/clipboard-list';
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin';
	import UsersIcon from '@tabler/icons-svelte/icons/users';
	import ClockIcon from '@tabler/icons-svelte/icons/clock';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const statusLabels: Record<string, string> = {
		disponivel: 'Disponivel',
		em_uso: 'Em uso',
		em_manutencao: 'Em manutencao',
		em_transito: 'Em transito',
		baixado: 'Baixado'
	};

	const statusColors: Record<string, string> = {
		disponivel: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
		em_uso: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
		em_manutencao: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
		em_transito: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
		baixado: 'bg-slate-500/15 text-slate-600 dark:text-slate-400'
	};

	function formatDate(value?: string) {
		if (!value) return '-';
		try {
			return format(new Date(value), 'dd/MM/yyyy');
		} catch {
			return '-';
		}
	}

	function statusBadgeClass(status: string) {
		return statusColors[status] ?? 'bg-muted text-muted-foreground';
	}
</script>

<div class="grid gap-6">
	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<Card.Root class="@container/stat">
			<Card.Header>
				<Card.Description>Total ativos</Card.Description>
				<Card.Title class="text-4xl font-semibold tabular-nums">{data.summary.total}</Card.Title>
				<Card.Action class="text-xs text-muted-foreground">Ultima atualizacao automatica</Card.Action>
			</Card.Header>
		</Card.Root>
		{#each Object.entries(data.summary.byStatus) as [status, value]}
			<Card.Root class="@container/stat">
				<Card.Header>
					<Card.Description>{statusLabels[status] ?? status}</Card.Description>
					<Card.Title class="text-4xl font-semibold tabular-nums">{value}</Card.Title>
					<Card.Action>
						<Badge class={`px-2 py-0.5 text-xs ${statusBadgeClass(status)}`}>
							{statusLabels[status] ?? status}
						</Badge>
					</Card.Action>
				</Card.Header>
			</Card.Root>
		{/each}
	</div>

	<Card.Root class="border-muted-foreground/20">
		<Card.Header class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<Card.Title>Visao geral</Card.Title>
				<Card.Description>
					Filtre os equipamentos por status, local, categoria e responsavel atual.
				</Card.Description>
			</div>
			<Button variant="outline" onclick={() => goto('/equipamentos/novo')}>Adicionar</Button>
		</Card.Header>
		<Card.Content class="space-y-4">
			<form method="get" class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
				<div class="space-y-2">
					<Label for="q">Busca</Label>
					<Input
						name="q"
						id="q"
						type="search"
						placeholder="Patrimonio, serie ou nome"
						value={data.activeFilters.search}
					/>
				</div>
				<div class="space-y-2">
					<Label for="status">Status</Label>
					<Select.Root type="single" name="status" id="status" value={data.activeFilters.status}>
						<Select.Trigger>
							{statusLabels[data.activeFilters.status] ?? 'Todos'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="todos">Todos</Select.Item>
							{#each Object.keys(statusLabels) as status}
								<Select.Item value={status}>{statusLabels[status]}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="category">Categoria</Label>
					<Select.Root type="single" name="category" id="category" value={data.activeFilters.category}>
						<Select.Trigger>{data.activeFilters.category || 'Todas'}</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Todas</Select.Item>
							{#each data.filters.categories as category}
								<Select.Item value={category}>{category}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="location">Local</Label>
					<Select.Root type="single" name="location" id="location" value={data.activeFilters.location}>
						<Select.Trigger>{data.activeFilters.location || 'Todos'}</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Todos</Select.Item>
							{#each data.filters.locations as location}
								<Select.Item value={location}>{location}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="space-y-2">
					<Label for="holder">Responsavel</Label>
					<Select.Root type="single" name="holder" id="holder" value={data.activeFilters.holder}>
						<Select.Trigger>{data.activeFilters.holder || 'Todos'}</Select.Trigger>
						<Select.Content>
							<Select.Item value="">Todos</Select.Item>
							{#each data.filters.holders as holder}
								<Select.Item value={holder}>{holder}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="md:col-span-2 xl:col-span-5 flex flex-wrap gap-2">
					<Button type="submit">Aplicar filtros</Button>
					<a
						class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						href="/equipamentos"
					>
						Limpar
					</a>
				</div>
			</form>

			<div class="rounded-lg border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Identificacao</Table.Head>
							<Table.Head>Categoria</Table.Head>
							<Table.Head>Local atual</Table.Head>
							<Table.Head>Responsavel</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Atualizado em</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if data.equipments.length === 0}
							<Table.Row>
								<Table.Cell colspan={6} class="h-24 text-center text-sm text-muted-foreground">
									Nenhum equipamento encontrado para os filtros atuais.
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each data.equipments as equipment}
								<Table.Row
									onclick={() => goto(`/equipamentos/${equipment.id}`)}
									class="cursor-pointer transition hover:bg-muted/40"
								>
									<Table.Cell class="space-y-1">
										<div class="font-medium">{equipment.name}</div>
										<div class="text-xs text-muted-foreground flex flex-wrap gap-2">
											<span>Tag {equipment.assetTag}</span>
											<span>Serie {equipment.serialNumber}</span>
										</div>
									</Table.Cell>
									<Table.Cell>{equipment.category}</Table.Cell>
									<Table.Cell class="flex items-center gap-1 text-sm">
										<MapPinIcon class="size-4 text-muted-foreground" />
										{equipment.location}
									</Table.Cell>
									<Table.Cell class="flex items-center gap-1 text-sm">
										<UsersIcon class="size-4 text-muted-foreground" />
										{equipment.currentHolder}
									</Table.Cell>
									<Table.Cell>
										<Badge class={`px-2 py-0.5 text-xs ${statusBadgeClass(equipment.status)}`}>
											{statusLabels[equipment.status] ?? equipment.status}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-right text-sm text-muted-foreground">
										{formatDate(equipment.updatedAt)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>

	<Tabs.Root value="pendencias" class="space-y-4">
		<Tabs.List>
			<Tabs.Trigger value="pendencias">Pendencias de aprovacao</Tabs.Trigger>
			<Tabs.Trigger value="eventos">Eventos recentes</Tabs.Trigger>
			<Tabs.Trigger value="historico">Ultimas movimentacoes</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pendencias">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#if data.summary.pendingApprovals.length === 0}
					<Card.Root>
						<Card.Content class="flex flex-col items-center justify-center gap-2 py-10 text-center">
							<CircleCheckIcon class="size-8 text-emerald-500" />
							<p class="text-sm text-muted-foreground">Nenhuma aprovacao pendente.</p>
						</Card.Content>
					</Card.Root>
				{:else}
					{#each data.summary.pendingApprovals as movement}
						<Card.Root class="border-amber-500/50">
							<Card.Header>
								<Card.Title class="text-lg">Movimentacao pendente</Card.Title>
								<Card.Description>
									{movement.originLocation} -> {movement.targetLocation}
								</Card.Description>
							</Card.Header>
							<Card.Content class="space-y-3 text-sm">
								<div class="flex items-center gap-2 text-muted-foreground">
									<ClipboardListIcon class="size-4" />
									Motivo: {movement.reason}
								</div>
								<div class="flex items-center gap-2 text-muted-foreground">
									<UsersIcon class="size-4" />
									Solicitante: {movement.requestedBy}
								</div>
								<div class="flex items-center gap-2 text-muted-foreground">
									<ClockIcon class="size-4" />
									Solicitado em {formatDate(movement.requestedAt)}
								</div>
							</Card.Content>
							<Card.Footer class="flex justify-end gap-2">
								<Button variant="outline" size="sm" onclick={() => goto(`/equipamentos/${movement.equipmentId}`)}>
									Detalhes
								</Button>
								<Button size="sm" onclick={() => goto(`/equipamentos/${movement.equipmentId}/aprovar?mid=${movement.id}`)}>
									Decidir
								</Button>
							</Card.Footer>
						</Card.Root>
					{/each}
				{/if}
			</div>
		</Tabs.Content>
		<Tabs.Content value="eventos">
			<div class="grid gap-3">
				{#if data.summary.recentEvents.length === 0}
					<p class="text-sm text-muted-foreground">Nenhum evento registrado.</p>
				{:else}
					{#each data.summary.recentEvents as event}
						<div class="rounded-lg border px-4 py-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div class="font-medium">{event.title}</div>
								<div class="text-xs text-muted-foreground">{formatDate(event.createdAt)}</div>
							</div>
							<p class="text-sm text-muted-foreground">{event.details}</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Responsavel: {event.actor || 'Nao informado'}
							</p>
						</div>
					{/each}
				{/if}
			</div>
		</Tabs.Content>
		<Tabs.Content value="historico">
			<div class="rounded-lg border">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Origem</Table.Head>
							<Table.Head>Destino</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head>Solicitante</Table.Head>
							<Table.Head>Aprovador</Table.Head>
							<Table.Head class="text-right">Atualizado em</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#if data.recentMovements.length === 0}
							<Table.Row>
								<Table.Cell colspan={6} class="h-24 text-center text-sm text-muted-foreground">
									Nenhuma movimentacao registrada.
								</Table.Cell>
							</Table.Row>
						{:else}
							{#each data.recentMovements as movement}
								<Table.Row>
									<Table.Cell>{movement.originLocation}</Table.Cell>
									<Table.Cell>{movement.targetLocation}</Table.Cell>
									<Table.Cell>
										<Badge class={`px-2 py-0.5 text-xs ${statusBadgeClass(movement.status)}`}>
											{statusLabels[movement.status] ?? movement.status}
										</Badge>
									</Table.Cell>
									<Table.Cell>{movement.requestedBy}</Table.Cell>
									<Table.Cell>{movement.approvedBy ?? '-'}</Table.Cell>
									<Table.Cell class="text-right text-sm text-muted-foreground">
										{formatDate(movement.updatedAt)}
									</Table.Cell>
								</Table.Row>
							{/each}
						{/if}
					</Table.Body>
				</Table.Root>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
