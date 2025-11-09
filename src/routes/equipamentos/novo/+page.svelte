<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const statusOptions = [
		{ value: 'disponivel', label: 'Disponivel' },
		{ value: 'em_uso', label: 'Em uso' },
		{ value: 'em_manutencao', label: 'Em manutencao' },
		{ value: 'em_transito', label: 'Em transito' },
		{ value: 'baixado', label: 'Baixado' }
	];

	function fieldError(field: string) {
		return form?.errors?.[field]?.[0];
	}

	function fieldValue(field: string, fallback = '') {
		return (form?.values?.[field] as string) ?? fallback;
	}
</script>

<Card.Root class="max-w-4xl border-muted-foreground/20">
	<Card.Header>
		<Card.Title>Novo equipamento</Card.Title>
		<Card.Description>Cadastre os dados principais antes de liberar o ativo para uso.</Card.Description>
	</Card.Header>
	<form method="post">
		<Card.Content class="grid gap-6">
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="name">Nome do equipamento</Label>
					<Input id="name" name="name" required value={fieldValue('name')} />
					{#if fieldError('name')}
						<p class="text-xs text-destructive">{fieldError('name')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="category">Categoria</Label>
					<Select.Root type="single" id="category" name="category" value={fieldValue('category')}>
						<Select.Trigger>{fieldValue('category') || 'Selecione'}</Select.Trigger>
						<Select.Content>
							{#each data.categories as category}
								<Select.Item value={category}>{category}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if fieldError('category')}
						<p class="text-xs text-destructive">{fieldError('category')}</p>
					{/if}
				</div>
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="assetTag">Tag patrimonial</Label>
					<Input id="assetTag" name="assetTag" required value={fieldValue('assetTag')} />
					{#if fieldError('assetTag')}
						<p class="text-xs text-destructive">{fieldError('assetTag')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="serialNumber">Numero de serie</Label>
					<Input id="serialNumber" name="serialNumber" required value={fieldValue('serialNumber')} />
					{#if fieldError('serialNumber')}
						<p class="text-xs text-destructive">{fieldError('serialNumber')}</p>
					{/if}
				</div>
			</div>
			<div class="grid gap-4 md:grid-cols-3">
				<div class="space-y-2">
					<Label for="status">Status inicial</Label>
					<Select.Root type="single" id="status" name="status" value={fieldValue('status', 'disponivel')}>
						<Select.Trigger>
							{statusOptions.find((option) => option.value === fieldValue('status', 'disponivel'))?.label ??
								'Selecione'}
						</Select.Trigger>
						<Select.Content>
							{#each statusOptions as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if fieldError('status')}
						<p class="text-xs text-destructive">{fieldError('status')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="location">Local atual</Label>
					<Select.Root type="single" id="location" name="location" value={fieldValue('location')}>
						<Select.Trigger>{fieldValue('location') || 'Selecione'}</Select.Trigger>
						<Select.Content>
							{#each data.locations as location}
								<Select.Item value={location}>{location}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if fieldError('location')}
						<p class="text-xs text-destructive">{fieldError('location')}</p>
					{/if}
				</div>
				<div class="space-y-2">
					<Label for="currentHolder">Responsavel atual</Label>
					<Input id="currentHolder" name="currentHolder" required value={fieldValue('currentHolder')} />
					{#if fieldError('currentHolder')}
						<p class="text-xs text-destructive">{fieldError('currentHolder')}</p>
					{/if}
				</div>
			</div>
			<div class="grid gap-4 md:grid-cols-3">
				<div class="space-y-2">
					<Label for="purchaseDate">Data de compra</Label>
					<Input id="purchaseDate" name="purchaseDate" type="date" value={fieldValue('purchaseDate')} />
				</div>
				<div class="space-y-2">
					<Label for="purchaseValue">Valor de compra</Label>
					<Input
						id="purchaseValue"
						name="purchaseValue"
						type="number"
						step="0.01"
						min="0"
						value={fieldValue('purchaseValue')}
					/>
				</div>
				<div class="space-y-2">
					<Label for="maintenanceCycleDays">Ciclo manutencao (dias)</Label>
					<Input
						id="maintenanceCycleDays"
						name="maintenanceCycleDays"
						type="number"
						min="0"
						value={fieldValue('maintenanceCycleDays')}
					/>
				</div>
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="authorizer">Autorizador</Label>
					<Input id="authorizer" name="authorizer" value={fieldValue('authorizer')} />
				</div>
				<div class="space-y-2">
					<Label for="notes">Observacoes</Label>
					<Textarea id="notes" name="notes" rows={4}>
						{fieldValue('notes')}
					</Textarea>
				</div>
			</div>
			{#if form?.errors?.general}
				<div class="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
					{form.errors.general[0]}
				</div>
			{/if}
		</Card.Content>
		<Card.Footer class="flex justify-between gap-3">
			<Button type="button" variant="outline" onclick={() => goto('/equipamentos')}>
				Cancelar
			</Button>
			<Button type="submit">Salvar equipamento</Button>
		</Card.Footer>
	</form>
</Card.Root>
