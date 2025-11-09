<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const statusLabels: Record<string, string> = {
		pendente: 'Pendente',
		aprovado: 'Aprovado',
		em_transito: 'Em transito',
		concluido: 'Concluido'
	};

	function formatDate(value?: string) {
		if (!value) return '-';
		try {
			return format(new Date(value), 'dd/MM/yyyy');
		} catch {
			return '-';
		}
	}

	function fieldError(field: string) {
		return form?.errors?.[field]?.[0];
	}

	function fieldValue(field: string, fallback = '') {
		return (form?.values?.[field] as string) ?? fallback;
	}
</script>

<div class="grid gap-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">
				Nova movimentacao para {data.equipment.name}
			</h2>
			<p class="text-sm text-muted-foreground">
				Informe origem, destino, justificativa e responsaveis da movimentacao.
			</p>
		</div>
		<Button variant="outline" onclick={() => goto(`/equipamentos/${data.equipment.id}`)}>
			Voltar
		</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Dados do equipamento</Card.Title>
			<Card.Description>Use como referencia para preencher a solicitacao.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-2 text-sm">
			<div>Tag patrimonial: <span class="font-medium">{data.equipment.assetTag}</span></div>
			<div>Local atual: <span class="font-medium">{data.equipment.location}</span></div>
			<div>Responsavel: <span class="font-medium">{data.equipment.currentHolder}</span></div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="border-muted-foreground/20">
		<form method="post">
			<Card.Header>
				<Card.Title>Formulario de movimentacao</Card.Title>
				<Card.Description>Defina origem, destino e aprovadores.</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="originLocation">Origem</Label>
					<Input
						id="originLocation"
						name="originLocation"
						required
						value={fieldValue('originLocation', data.equipment.location)}
					/>
					{#if fieldError('originLocation')}
						<p class="text-xs text-destructive">{fieldError('originLocation')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="targetLocation">Destino</Label>
					<Input id="targetLocation" name="targetLocation" required value={fieldValue('targetLocation')} />
					{#if fieldError('targetLocation')}
						<p class="text-xs text-destructive">{fieldError('targetLocation')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="requestedBy">Solicitante</Label>
					<Input
						id="requestedBy"
						name="requestedBy"
						required
						value={fieldValue('requestedBy', data.equipment.currentHolder)}
					/>
					{#if fieldError('requestedBy')}
						<p class="text-xs text-destructive">{fieldError('requestedBy')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="expectedReturnAt">Previsao de retorno</Label>
					<Input id="expectedReturnAt" name="expectedReturnAt" type="date" value={fieldValue('expectedReturnAt')} />
				</div>
				<div class="md:col-span-2 space-y-2">
					<Label for="reason">Justificativa</Label>
					<Textarea id="reason" name="reason" rows={4} required>
						{fieldValue('reason')}
					</Textarea>
					{#if fieldError('reason')}
						<p class="text-xs text-destructive">{fieldError('reason')}</p>
					{/if}
				</div>
				<div class="md:col-span-2 space-y-2">
					<Label for="notes">Observacoes (opcional)</Label>
					<Textarea id="notes" name="notes" rows={3}>
						{fieldValue('notes')}
					</Textarea>
				</div>
				{#if form?.errors?.general}
					<div class="md:col-span-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
						{form.errors.general[0]}
					</div>
				{/if}
			</Card.Content>
			<Card.Footer class="flex justify-end gap-3">
				<Button type="button" variant="outline" onclick={() => goto(`/equipamentos/${data.equipment.id}`)}>
					Cancelar
				</Button>
				<Button type="submit">Registrar solicitacao</Button>
			</Card.Footer>
		</form>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Movimentacoes recentes</Card.Title>
			<Card.Description>Use como referencia historica.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Origem</Table.Head>
						<Table.Head>Destino</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Solicitante</Table.Head>
						<Table.Head class="text-right">Atualizado</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if data.movements.length === 0}
						<Table.Row>
							<Table.Cell colspan={5} class="h-24 text-center text-sm text-muted-foreground">
								Nenhuma movimentacao registrada.
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each data.movements as movement}
							<Table.Row>
								<Table.Cell>{movement.originLocation}</Table.Cell>
								<Table.Cell>{movement.targetLocation}</Table.Cell>
								<Table.Cell>
									<Badge class="px-2 py-0.5 text-xs">
										{statusLabels[movement.status] ?? movement.status}
									</Badge>
								</Table.Cell>
								<Table.Cell>{movement.requestedBy}</Table.Cell>
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
