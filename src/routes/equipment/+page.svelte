<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import TransferIcon from '@tabler/icons-svelte/icons/arrows-right-left';
	import ClipboardIcon from '@tabler/icons-svelte/icons/clipboard';
	import PlusIcon from '@tabler/icons-svelte/icons/plus';
	import MapPinIcon from '@tabler/icons-svelte/icons/map-pin';
	import CheckIcon from '@tabler/icons-svelte/icons/circle-check';
	import AlertTriangleIcon from '@tabler/icons-svelte/icons/alert-triangle';
	import {
		equipmentList,
		equipmentMovements,
		equipmentStats,
		equipmentLocations,
		equipmentCategories,
		moveEquipment,
		addEquipment,
		type EquipmentStatus,
		type MovementType
	} from '$lib/stores/equipment';

	const statusFilters: Array<'all' | EquipmentStatus> = ['all', 'available', 'allocated', 'maintenance'];

	let statusFilter: 'all' | EquipmentStatus = $state('all');
	let locationFilter: 'all' | string = $state('all');
	let categoryFilter: 'all' | string = $state('all');
	let searchTerm = $state('');

	let selectedEquipmentId: string | undefined = $state();
	let movementLocation = $state('');
	let movementCustodian = $state('');
	let movementAuthorizer = $state('');
	let movementExecutor = $state('');
	let movementNotes = $state('');
	let movementType: MovementType = $state('transfer');
	let statusOverride: EquipmentStatus | '' = $state('');

	let newAssetTag = $state('');
	let newName = $state('');
	let newCategory = $state('');
	let newLocation = $state('');
	let newCustodian = $state('');
	let newAuthorizer = $state('');
	let newStatus: EquipmentStatus = $state('available');

	let activeTab = $state('inventory');

	const equipment = $derived($equipmentList);
	const stats = $derived($equipmentStats);
	const movements = $derived($equipmentMovements);
	const locations = $derived($equipmentLocations);
	const categories = $derived($equipmentCategories);

	let filteredEquipment = $derived.by(() => {
		const normalizedTerm = searchTerm.trim().toLowerCase();
		return equipment.filter((item) => {
			const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
			const matchesLocation = locationFilter === 'all' ? true : item.currentLocation === locationFilter;
			const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;
			const matchesSearch =
				normalizedTerm.length === 0
					? true
					: [item.assetTag, item.name, item.custodian, item.authorizer, item.currentLocation]
							.join(' ')
							.toLowerCase()
							.includes(normalizedTerm);

			return matchesStatus && matchesLocation && matchesCategory && matchesSearch;
		});
	});

	let recentMovements = $derived(movements.slice(0, 6));

	function formatDate(value: string) {
		try {
			return new Date(value).toLocaleString('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short'
			});
		} catch {
			return value;
		}
	}

	function badgeClasses(status: EquipmentStatus) {
		switch (status) {
			case 'available':
				return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
			case 'allocated':
				return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
			case 'maintenance':
				return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
			default:
				return '';
		}
	}

	function resolveStatusFromMovement(type: MovementType): EquipmentStatus {
		switch (type) {
			case 'allocation':
			case 'transfer':
				return 'allocated';
			case 'maintenance':
				return 'maintenance';
			case 'return':
			default:
				return 'available';
		}
	}

	function resetMovementForm() {
		selectedEquipmentId = undefined;
		movementLocation = '';
		movementCustodian = '';
		movementAuthorizer = '';
		movementExecutor = '';
		movementNotes = '';
		movementType = 'transfer';
		statusOverride = '';
	}

	function resetNewEquipmentForm() {
		newAssetTag = '';
		newName = '';
		newCategory = '';
		newLocation = '';
		newCustodian = '';
		newAuthorizer = '';
		newStatus = 'available';
	}

	function submitMovement() {
		if (!selectedEquipmentId) {
			toast.error('Select an equipment item first');
			return;
		}
		if (!movementLocation || !movementCustodian || !movementAuthorizer || !movementExecutor) {
			toast.error('Fill all required fields for the movement');
			return;
		}

		moveEquipment({
			equipmentId: selectedEquipmentId,
			toLocation: movementLocation,
			movedBy: movementExecutor,
			custodian: movementCustodian,
			authorizedBy: movementAuthorizer,
			type: movementType,
			notes: movementNotes || undefined,
			statusOverride: statusOverride || undefined
		});

		toast.success('Movement registered');
		resetMovementForm();
	}

	function submitNewEquipment() {
		if (!newAssetTag || !newName || !newCategory || !newLocation || !newCustodian || !newAuthorizer) {
			toast.error('Fill all required fields to register the equipment');
			return;
		}

		addEquipment({
			assetTag: newAssetTag,
			name: newName,
			category: newCategory,
			location: newLocation,
			custodian: newCustodian,
			authorizer: newAuthorizer,
			status: newStatus
		});

		toast.success('Equipment registered');
		resetNewEquipmentForm();
	}
</script>

<div class="flex flex-col gap-6">
	<section
		class="@lg/main:grid-cols-4 grid grid-cols-1 gap-3 *:data-[slot=card]:bg-card *:data-[slot=card]:shadow-sm"
	>
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-4">
				<Card.Title>Total ativos</Card.Title>
				<ClipboardIcon class="text-muted-foreground size-5" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-semibold">{stats.total}</div>
				<p class="text-muted-foreground mt-2 text-sm">
					Ultima atualizacao: {stats.lastUpdated ? formatDate(stats.lastUpdated) : 'N/A'}
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-4">
				<Card.Title>Disponiveis</Card.Title>
				<CheckIcon class="text-emerald-500 size-5" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-semibold">{stats.available}</div>
				<p class="text-muted-foreground mt-2 text-sm">
					{Math.round((stats.available / Math.max(stats.total, 1)) * 100)}% do parque
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-4">
				<Card.Title>Alocados</Card.Title>
				<TransferIcon class="text-blue-500 size-5" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-semibold">{stats.allocated}</div>
				<p class="text-muted-foreground mt-2 text-sm">
					{Math.round((stats.allocated / Math.max(stats.total, 1)) * 100)}% do parque
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between pb-4">
				<Card.Title>Em manutencao</Card.Title>
				<AlertTriangleIcon class="text-amber-500 size-5" />
			</Card.Header>
			<Card.Content>
				<div class="text-3xl font-semibold">{stats.maintenance}</div>
				<p class="text-muted-foreground mt-2 text-sm">Itens aguardando retorno</p>
			</Card.Content>
		</Card.Root>
	</section>

	<Tabs.Root bind:value={activeTab} class="flex flex-col gap-4">
		<Tabs.List class="w-full overflow-x-auto">
			<Tabs.Trigger value="inventory">Inventario</Tabs.Trigger>
			<Tabs.Trigger value="movement">Movimentacoes</Tabs.Trigger>
			<Tabs.Trigger value="register">Cadastro rapido</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="inventory" class="flex flex-col gap-4">
			<Card.Root>
				<Card.Header class="gap-4">
					<Card.Title>Filtros de inventario</Card.Title>
					<Card.Description>
						Use filtros para localizar equipamentos por status, local, categoria ou texto livre
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid grid-cols-1 gap-4 md:grid-cols-5">
					<div class="space-y-2">
						<Label>Status</Label>
						<Select.Root bind:value={statusFilter}>
							<Select.Trigger>
								{statusFilter === 'all' ? 'Todos' : statusFilter}
							</Select.Trigger>
							<Select.Content>
								{#each statusFilters as option}
									<Select.Item value={option}>
										{option === 'all' ? 'Todos' : option}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label>Local</Label>
						<Select.Root bind:value={locationFilter}>
							<Select.Trigger>
								{locationFilter === 'all' ? 'Todos' : locationFilter}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all">Todos</Select.Item>
								{#each locations as location}
									<Select.Item value={location}>{location}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label>Categoria</Label>
						<Select.Root bind:value={categoryFilter}>
							<Select.Trigger>
								{categoryFilter === 'all' ? 'Todas' : categoryFilter}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="all">Todas</Select.Item>
								{#each categories as category}
									<Select.Item value={category}>{category}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2 md:col-span-2">
						<Label>Busca</Label>
						<Input bind:value={searchTerm} placeholder="Buscar por patrimonio, nome ou responsavel" />
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title>Equipamentos</Card.Title>
						<Card.Description>
							{filteredEquipment.length} itens encontrados
						</Card.Description>
					</div>
					<Button variant="outline" onclick={() => (activeTab = 'register')}>
						<PlusIcon />
						Novo equipamento
					</Button>
				</Card.Header>
				<Card.Content class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Patrimonio</Table.Head>
								<Table.Head>Nome</Table.Head>
								<Table.Head>Categoria</Table.Head>
								<Table.Head>Local</Table.Head>
								<Table.Head>Responsavel</Table.Head>
								<Table.Head>Autorizado por</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head>Ultima movimentacao</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#if filteredEquipment.length === 0}
								<Table.Row>
									<Table.Cell colspan="8" class="text-muted-foreground py-6 text-center text-sm">
										Nenhum equipamento encontrado com os filtros aplicados
									</Table.Cell>
								</Table.Row>
							{:else}
								{#each filteredEquipment as item}
									<Table.Row class="cursor-pointer" onclick={() => {
										selectedEquipmentId = item.id;
										activeTab = 'movement';
										movementLocation = item.currentLocation;
										movementCustodian = item.custodian;
										movementAuthorizer = item.authorizer;
									}}>
										<Table.Cell class="font-medium">{item.assetTag}</Table.Cell>
										<Table.Cell>{item.name}</Table.Cell>
										<Table.Cell>{item.category}</Table.Cell>
										<Table.Cell class="flex items-center gap-2">
											<MapPinIcon class="text-muted-foreground size-4" />
											{item.currentLocation}
										</Table.Cell>
										<Table.Cell>{item.custodian}</Table.Cell>
										<Table.Cell>{item.authorizer}</Table.Cell>
										<Table.Cell>
											<Badge class={badgeClasses(item.status)}>{item.status}</Badge>
										</Table.Cell>
										<Table.Cell>{formatDate(item.lastMovementAt)}</Table.Cell>
									</Table.Row>
								{/each}
							{/if}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="movement" class="grid grid-cols-1 gap-4 lg:grid-cols-5">
			<Card.Root class="lg:col-span-3">
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title>Registrar movimentacao</Card.Title>
						<Card.Description>
							Selecione um equipamento na lista ou escolha abaixo para movimentar
						</Card.Description>
					</div>
				</Card.Header>
				<Card.Content class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="md:col-span-2 space-y-2">
						<Label>Equipamento</Label>
						<Select.Root bind:value={selectedEquipmentId}>
							<Select.Trigger placeholder="Selecionar equipamento" />
							<Select.Content>
								{#each equipment as option}
									<Select.Item value={option.id}>
										{option.assetTag} - {option.name}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label>Tipo</Label>
						<Select.Root bind:value={movementType}>
							<Select.Trigger />
							<Select.Content>
								<Select.Item value="transfer">transfer</Select.Item>
								<Select.Item value="allocation">allocation</Select.Item>
								<Select.Item value="return">return</Select.Item>
								<Select.Item value="maintenance">maintenance</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label>Status (opcional)</Label>
						<Select.Root bind:value={statusOverride}>
							<Select.Trigger>{statusOverride || 'Manter automatico'}</Select.Trigger>
							<Select.Content>
								<Select.Item value="">Manter automatico</Select.Item>
								<Select.Item value="available">available</Select.Item>
								<Select.Item value="allocated">allocated</Select.Item>
								<Select.Item value="maintenance">maintenance</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-2">
						<Label>Novo local</Label>
						<Input bind:value={movementLocation} placeholder="Ex: HQ Floor 2" />
					</div>
					<div class="space-y-2">
						<Label>Novo responsavel</Label>
						<Input bind:value={movementCustodian} placeholder="Nome do responsavel" />
					</div>
					<div class="space-y-2">
						<Label>Executado por</Label>
						<Input bind:value={movementExecutor} placeholder="Quem fez a movimentacao" />
					</div>
					<div class="space-y-2">
						<Label>Autorizado por</Label>
						<Input bind:value={movementAuthorizer} placeholder="Nome de quem autorizou" />
					</div>
					<div class="md:col-span-2 space-y-2">
						<Label>Observacoes</Label>
						<Textarea bind:value={movementNotes} rows={3} placeholder="Detalhes opcionais" />
					</div>
					<div class="md:col-span-2 flex items-center justify-end gap-2">
						<Button variant="ghost" onclick={resetMovementForm}>Limpar</Button>
						<Button onclick={submitMovement} disabled={!selectedEquipmentId}>
							<TransferIcon />
							Registrar
						</Button>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="lg:col-span-2">
				<Card.Header>
					<Card.Title>Ultimas movimentacoes</Card.Title>
					<Card.Description>Monitoramento rapido das alteracoes recentes</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					{#if recentMovements.length === 0}
						<p class="text-muted-foreground text-sm">Nenhuma movimentacao registrada ainda</p>
					{:else}
						{#each recentMovements as movement}
							<div class="border-border/60 rounded-lg border p-3">
								<div class="flex items-center justify-between gap-3 text-sm">
									<div class="font-medium">{movement.equipmentName}</div>
									<Badge variant="outline" class={badgeClasses(resolveStatusFromMovement(movement.type))}>
										{movement.type}
									</Badge>
								</div>
								<div class="text-muted-foreground mt-1 text-sm">
									{movement.fromLocation} -> {movement.toLocation}
								</div>
								<div class="text-muted-foreground mt-1 text-xs flex flex-wrap gap-2">
									<span>Executado por {movement.movedBy}</span>
									<span>Responsavel {movement.custodian}</span>
									<span>Autorizado por {movement.authorizedBy}</span>
								</div>
								<div class="text-muted-foreground mt-1 text-xs">
									{formatDate(movement.movedAt)}
								</div>
								{#if movement.notes}
									<div class="mt-2 rounded bg-muted/40 p-2 text-xs">{movement.notes}</div>
								{/if}
							</div>
						{/each}
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>

		<Tabs.Content value="register" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<Card.Root class="lg:col-span-2">
				<Card.Header>
					<Card.Title>Novo equipamento</Card.Title>
					<Card.Description>Cadastre rapidamente um ativo controlado pelo time</Card.Description>
				</Card.Header>
				<Card.Content class="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div class="space-y-2 md:col-span-1">
						<Label>Patrimonio</Label>
						<Input bind:value={newAssetTag} placeholder="Ex: ASSET-010" />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Nome</Label>
						<Input bind:value={newName} placeholder="Descricao do equipamento" />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Categoria</Label>
						<Input bind:value={newCategory} placeholder="Notebook, scanner..." />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Local</Label>
						<Input bind:value={newLocation} placeholder="Ex: HQ Floor 1" />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Responsavel</Label>
						<Input bind:value={newCustodian} placeholder="Nome do responsavel" />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Autorizado por</Label>
						<Input bind:value={newAuthorizer} placeholder="Nome de quem autorizou" />
					</div>
					<div class="space-y-2 md:col-span-1">
						<Label>Status inicial</Label>
						<Select.Root bind:value={newStatus}>
							<Select.Trigger />
							<Select.Content>
								<Select.Item value="available">available</Select.Item>
								<Select.Item value="allocated">allocated</Select.Item>
								<Select.Item value="maintenance">maintenance</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="md:col-span-3 flex items-center justify-end gap-2">
						<Button variant="ghost" onclick={resetNewEquipmentForm}>Limpar</Button>
						<Button onclick={submitNewEquipment}>
							<PlusIcon />
							Cadastrar
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
