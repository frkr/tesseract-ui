<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import ClipboardListIcon from '@tabler/icons-svelte/icons/clipboard-list';
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin';
	import UsersIcon from '@tabler/icons-svelte/icons/users';
	import CalendarIcon from '@tabler/icons-svelte/icons/calendar';
	import CurrencyDollarIcon from '@tabler/icons-svelte/icons/currency-dollar';
	import HistoryIcon from '@tabler/icons-svelte/icons/history';
	import RefreshIcon from '@tabler/icons-svelte/icons/refresh';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const statusLabels: Record<string, string> = {
		disponivel: 'Disponivel',
		em_uso: 'Em uso',
		em_manutencao: 'Em manutencao',
		em_transito: 'Em transito',
		baixado: 'Baixado',
		pendente: 'Pendente',
		aprovado: 'Aprovado',
		concluido: 'Concluido',
		rejeitado: 'Rejeitado'
	};

	const statusColors: Record<string, string> = {
		disponivel: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
		em_uso: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
		em_manutencao: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
		em_transito: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
		baixado: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
		pendente: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
		aprovado: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
		concluido: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
		rejeitado: 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
	};

	function formatDate(value?: string) {
		if (!value) return '-';
		try {
			return format(new Date(value), 'dd/MM/yyyy');
		} catch {
			return '-';
		}
	}

	function statusClass(status: string) {
		return statusColors[status] ?? 'bg-muted text-muted-foreground';
	}
</script>

<div class="grid gap-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">{data.equipment.name}</h2>
			<p class="text-sm text-muted-foreground">
				Tag {data.equipment.assetTag} • Serie {data.equipment.serialNumber}
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button variant="outline" onclick={() => goto(`/equipamentos/${data.equipment.id}/movimentar`)}>
				<RefreshIcon class="mr-2 size-4" /> Solicitar movimentacao
			</Button>
			<Button
				onclick={() => goto(`/equipamentos/${data.equipment.id}/aprovar`)}
				variant="outline"
			>
				<ClipboardListIcon class="mr-2 size-4" /> Aprovar movimentacao
			</Button>
			<Button onclick={() => goto('/equipamentos')}>Voltar</Button>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<Card.Title>Situacao atual</Card.Title>
				<Card.Description>Resumo operacional do ativo.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4 text-sm">
				<div class="flex items-center gap-2">
					<Badge class={`px-2 py-0.5 text-xs ${statusClass(data.equipment.status)}`}>
						{statusLabels[data.equipment.status] ?? data.equipment.status}
					</Badge>
					<span>Status atual</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<MapPinIcon class="size-4" />
					Local: <span class="text-foreground">{data.equipment.location}</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<UsersIcon class="size-4" />
					Responsavel: <span class="text-foreground">{data.equipment.currentHolder}</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<UsersIcon class="size-4" />
					Autorizador: <span class="text-foreground">{data.equipment.authorizer ?? 'Nao informado'}</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<CalendarIcon class="size-4" />
					Atualizado em {formatDate(data.equipment.updatedAt)}
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Informacoes financeiras</Card.Title>
				<Card.Description>Dados de aquisicao e manutencao.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-3 text-sm">
				<div class="flex items-center gap-2 text-muted-foreground">
					<CalendarIcon class="size-4" />
					Aquisicao: <span class="text-foreground">{formatDate(data.equipment.purchaseDate)}</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<CurrencyDollarIcon class="size-4" />
					Valor de compra:
					<span class="text-foreground">
						{data.equipment.purchaseValue ? `R$ ${data.equipment.purchaseValue.toFixed(2)}` : '-'}
					</span>
				</div>
				<div class="flex items-center gap-2 text-muted-foreground">
					<HistoryIcon class="size-4" />
					Ciclo manutencao:
					<span class="text-foreground">
						{data.equipment.maintenanceCycleDays
							? `${data.equipment.maintenanceCycleDays} dias`
							: 'Nao definido'}
					</span>
				</div>
				{#if data.equipment.notes}
					<div class="rounded-md border border-dashed px-3 py-2 text-sm">
						<p class="font-medium">Observacoes</p>
						<p class="text-muted-foreground">{data.equipment.notes}</p>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Linha do tempo</Card.Title>
			<Card.Description>Eventos mais recentes vinculados ao equipamento.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if data.equipment.history.length === 0}
				<p class="text-sm text-muted-foreground">Nenhum evento registrado.</p>
			{:else}
				<ul class="space-y-3">
					{#each data.equipment.history as event}
						<li class="rounded-lg border px-4 py-3">
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div class="font-medium">{event.title}</div>
								<div class="text-xs text-muted-foreground">{formatDate(event.createdAt)}</div>
							</div>
							<p class="text-sm text-muted-foreground">{event.details}</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Responsavel: {event.actor ?? 'Nao informado'}
							</p>
							{#if event.relatedMovementId}
								<Button
									size="sm"
									variant="ghost"
									class="mt-2 px-2 text-xs"
									onclick={() =>
										goto(
											`/equipamentos/${data.equipment.id}/movimentar?mid=${event.relatedMovementId}`
										)}
								>
									Consultar movimentacao
								</Button>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Movimentacoes</Card.Title>
			<Card.Description>Historico completo de movimentacoes do ativo.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Origem</Table.Head>
						<Table.Head>Destino</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Solicitante</Table.Head>
						<Table.Head>Aprovador</Table.Head>
						<Table.Head class="text-right">Atualizado</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if data.movements.length === 0}
						<Table.Row>
							<Table.Cell colspan={6} class="h-24 text-center text-sm text-muted-foreground">
								Nenhuma movimentacao registrada.
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each data.movements as movement}
							<Table.Row>
								<Table.Cell>{movement.originLocation}</Table.Cell>
								<Table.Cell>{movement.targetLocation}</Table.Cell>
								<Table.Cell>
									<Badge class={`px-2 py-0.5 text-xs ${statusClass(movement.status)}`}>
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
		</Card.Content>
	</Card.Root>
</div>
