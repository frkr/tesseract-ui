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

	function formatDate(value?: string) {
		if (!value) return '-';
		try {
			return format(new Date(value), 'dd/MM/yyyy');
		} catch {
			return '-';
		}
	}

	function isApproveForm() {
		return form?.form === 'approve';
	}

	function isConcludeForm() {
		return form?.form === 'conclude';
	}

	function fieldError(formKey: 'approve' | 'conclude', field: string) {
		if (form?.form !== formKey) return undefined;
		return form?.errors?.[field]?.[0];
	}

	function fieldValue(formKey: 'approve' | 'conclude', field: string, fallback = '') {
		if (form?.form !== formKey) return fallback;
		return (form?.values?.[field] as string) ?? fallback;
	}

	const statusLabels: Record<string, string> = {
		pendente: 'Pendente',
		aprovado: 'Aprovado',
		em_transito: 'Em transito',
		concluido: 'Concluido',
		rejeitado: 'Rejeitado'
	};
</script>

<div class="grid gap-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">Aprovar movimentacao</h2>
			<p class="text-sm text-muted-foreground">
				Revise os dados e confirme a autorizacao da movimentacao, registrando responsaveis.
			</p>
		</div>
		<Button variant="outline" onclick={() => goto(`/equipamentos/${data.equipment.id}`)}>
			Voltar
		</Button>
	</div>

	{#if !data.targetMovement}
		<Card.Root>
			<Card.Content class="py-10 text-center text-sm text-muted-foreground">
				Nenhuma movimentacao pendente ou aprovada disponivel para decisao.
			</Card.Content>
		</Card.Root>
	{:else}
		<Card.Root class="border-muted-foreground/20">
			<Card.Header>
				<Card.Title>Resumo da movimentacao</Card.Title>
				<Card.Description>
					{data.targetMovement.originLocation} -> {data.targetMovement.targetLocation}
				</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-3 text-sm">
				<div>Solicitante: <span class="font-medium">{data.targetMovement.requestedBy}</span></div>
				<div>Motivo: <span class="text-muted-foreground">{data.targetMovement.reason}</span></div>
				<div>Recebido em: {formatDate(data.targetMovement.requestedAt)}</div>
				<div>Previsao retorno: {formatDate(data.targetMovement.expectedReturnAt)}</div>
				<div>
					Status atual:
					<Badge class="ml-2 px-2 py-0.5 text-xs">
						{statusLabels[data.targetMovement.status] ?? data.targetMovement.status}
					</Badge>
				</div>
			</Card.Content>
		</Card.Root>

		<div class="grid gap-4 md:grid-cols-2">
			<Card.Root>
				<form method="post" action="?/approve">
					<Card.Header>
						<Card.Title>Aprovar solicitacao</Card.Title>
						<Card.Description>Informe aprovador e autorizador.</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-4">
						<input type="hidden" name="movementId" value={data.targetMovement.id} />
						<div class="space-y-2">
							<Label for="approvedBy">Aprovador</Label>
							<Input
								id="approvedBy"
								name="approvedBy"
								required
								value={fieldValue('approve', 'approvedBy')}
							/>
							{#if fieldError('approve', 'approvedBy')}
								<p class="text-xs text-destructive">{fieldError('approve', 'approvedBy')}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label for="authorizedBy">Autorizador</Label>
							<Input
								id="authorizedBy"
								name="authorizedBy"
								required
								value={fieldValue('approve', 'authorizedBy')}
							/>
							{#if fieldError('approve', 'authorizedBy')}
								<p class="text-xs text-destructive">{fieldError('approve', 'authorizedBy')}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label for="comment">Observacao</Label>
							<Textarea id="comment" name="comment" rows={3}>
								{fieldValue('approve', 'comment')}
							</Textarea>
						</div>
						{#if isApproveForm() && form?.errors?.general}
							<div class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
								{form.errors.general[0]}
							</div>
						{/if}
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button type="submit">Aprovar movimentacao</Button>
					</Card.Footer>
				</form>
			</Card.Root>

			<Card.Root>
				<form method="post" action="?/conclude">
					<Card.Header>
						<Card.Title>Concluir entrega</Card.Title>
						<Card.Description>Registre entregue e recebedor para finalizar.</Card.Description>
					</Card.Header>
					<Card.Content class="grid gap-4">
						<input type="hidden" name="movementId" value={data.targetMovement.id} />
						<div class="space-y-2">
							<Label for="completedBy">Responsavel pela entrega</Label>
							<Input
								id="completedBy"
								name="completedBy"
								required
								value={fieldValue('conclude', 'completedBy')}
							/>
							{#if fieldError('conclude', 'completedBy')}
								<p class="text-xs text-destructive">{fieldError('conclude', 'completedBy')}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label for="receivedBy">Recebedor</Label>
							<Input
								id="receivedBy"
								name="receivedBy"
								required
								value={fieldValue('conclude', 'receivedBy')}
							/>
							{#if fieldError('conclude', 'receivedBy')}
								<p class="text-xs text-destructive">{fieldError('conclude', 'receivedBy')}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label for="comment-conclude">Observacao</Label>
							<Textarea id="comment-conclude" name="comment" rows={3}>
								{fieldValue('conclude', 'comment')}
							</Textarea>
						</div>
						{#if isConcludeForm() && form?.errors?.general}
							<div class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
								{form.errors.general[0]}
							</div>
						{/if}
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button type="submit">Concluir</Button>
					</Card.Footer>
				</form>
			</Card.Root>
		</div>
	{/if}

	<Card.Root>
		<Card.Header>
			<Card.Title>Historico de movimentacoes</Card.Title>
			<Card.Description>Veja aprovacoes e conclusoes anteriores.</Card.Description>
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
									<Badge class="px-2 py-0.5 text-xs">
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
