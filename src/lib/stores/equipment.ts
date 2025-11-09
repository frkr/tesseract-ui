import { derived, writable } from 'svelte/store';

export type EquipmentRecord = {
	id: string;
	assetCode: string;
	name: string;
	category: string;
	status: 'ativo' | 'em_manutencao' | 'inativo';
	criticality: 'baixa' | 'media' | 'alta' | 'critica';
	locationId: string;
	locationName: string;
	custodian?: string;
	nextMaintenance?: string;
	lastMovementAt?: string;
};

export type EquipmentFilter = {
	search?: string;
	status?: EquipmentRecord['status'] | 'todos';
	locationId?: string | 'todos';
	criticality?: EquipmentRecord['criticality'] | 'todas';
};

export type EquipmentSummary = {
	total: number;
	byStatus: Record<EquipmentRecord['status'], number>;
	byCriticality: Record<EquipmentRecord['criticality'], number>;
	withPendingMaintenance: number;
	withPendingTransfer: number;
};

export type MovementApproval = {
	id: string;
	equipmentId: string;
	equipmentName: string;
	requestedAt: string;
	originName: string;
	targetName: string;
	requester: string;
	approver: string;
	status: 'pendente' | 'aprovado' | 'rejeitado';
};

export type EquipmentHistoryEvent = {
	id: string;
	equipmentId: string;
	eventType: 'cadastro' | 'movimento' | 'manutencao' | 'status_change';
	title: string;
	description: string;
	actor: string;
	timestamp: string;
};

export const MOCK_EQUIPMENT: EquipmentRecord[] = [
	{
		id: 'eq-100',
		assetCode: 'EQ-100',
		name: 'Servidor Aplicacao 01',
		category: 'infraestrutura',
		status: 'ativo',
		criticality: 'critica',
		locationId: 'loc-matriz-dc',
		locationName: 'Matriz - Datacenter',
		custodian: 'Ana Ribeiro',
		nextMaintenance: '2025-11-18',
		lastMovementAt: '2025-10-12'
	},
	{
		id: 'eq-101',
		assetCode: 'EQ-101',
		name: 'NoBreak Predial',
		category: 'energia',
		status: 'em_manutencao',
		criticality: 'alta',
		locationId: 'loc-matriz-subsolo',
		locationName: 'Matriz - Subsolo',
		custodian: 'Luis Carvalho',
		nextMaintenance: '2025-12-01',
		lastMovementAt: '2025-09-04'
	},
	{
		id: 'eq-102',
		assetCode: 'EQ-102',
		name: 'Scanner Fiscal',
		category: 'perifericos',
		status: 'ativo',
		criticality: 'media',
		locationId: 'loc-filial-rj',
		locationName: 'Filial Rio - Recepcao',
		custodian: 'Joao Martins',
		nextMaintenance: '2026-01-10',
		lastMovementAt: '2025-10-30'
	},
	{
		id: 'eq-103',
		assetCode: 'EQ-103',
		name: 'Torno CNC',
		category: 'producao',
		status: 'ativo',
		criticality: 'alta',
		locationId: 'loc-filial-sp',
		locationName: 'Filial Sao Paulo - Planta A',
		custodian: 'Renata Souza',
		nextMaintenance: '2025-12-22',
		lastMovementAt: '2025-08-15'
	},
	{
		id: 'eq-104',
		assetCode: 'EQ-104',
		name: 'Drone Inspecao',
		category: 'inspecao',
		status: 'inativo',
		criticality: 'media',
		locationId: 'loc-matriz-deposito',
		locationName: 'Matriz - Deposito',
		custodian: 'Equipe Operacoes',
		nextMaintenance: '2025-11-28',
		lastMovementAt: '2025-07-09'
	},
	{
		id: 'eq-105',
		assetCode: 'EQ-105',
		name: 'Notebook Auditoria 05',
		category: 'mobilidade',
		status: 'ativo',
		criticality: 'baixa',
		locationId: 'loc-filial-rj',
		locationName: 'Filial Rio - Escritorio',
		custodian: 'Equipe Auditoria',
		nextMaintenance: '2026-02-14',
		lastMovementAt: '2025-10-02'
	}
];

export const MOCK_LOCATIONS = [
	{ id: 'loc-matriz-dc', name: 'Matriz - Datacenter', type: 'matriz' },
	{ id: 'loc-matriz-subsolo', name: 'Matriz - Subsolo', type: 'matriz' },
	{ id: 'loc-matriz-deposito', name: 'Matriz - Deposito', type: 'matriz' },
	{ id: 'loc-filial-sp', name: 'Filial Sao Paulo - Planta A', type: 'filial' },
	{ id: 'loc-filial-rj', name: 'Filial Rio - Escritorio', type: 'filial' }
] as const;

export const MOCK_POLICIES = [
	{
		id: 'mp-local-filiais',
		scopeType: 'local',
		description: 'Movimentacao entre filiais requer aprovacao do gerente regional',
		approver: 'Marina Figueiredo',
		isActive: true
	},
	{
		id: 'mp-categoria-critica',
		scopeType: 'categoria',
		description: 'Equipamentos criticos exigem dupla aprovacao',
		approver: 'Comite Operacional',
		isActive: true
	}
] as const;

export const MOCK_APPROVALS: MovementApproval[] = [
	{
		id: 'mv-001',
		equipmentId: 'eq-100',
		equipmentName: 'Servidor Aplicacao 01',
		requestedAt: '2025-11-01T10:00:00Z',
		originName: 'Matriz - Datacenter',
		targetName: 'Filial Sao Paulo - Planta A',
		requester: 'Ana Ribeiro',
		approver: 'Marina Figueiredo',
		status: 'pendente'
	},
	{
		id: 'mv-002',
		equipmentId: 'eq-102',
		equipmentName: 'Scanner Fiscal',
		requestedAt: '2025-11-04T14:30:00Z',
		originName: 'Filial Rio - Recepcao',
		targetName: 'Filial Rio - Escritorio',
		requester: 'Joao Martins',
		approver: 'Equipe Operacoes',
		status: 'pendente'
	},
	{
		id: 'mv-003',
		equipmentId: 'eq-103',
		equipmentName: 'Torno CNC',
		requestedAt: '2025-10-20T09:15:00Z',
		originName: 'Filial Sao Paulo - Planta A',
		targetName: 'Matriz - Deposito',
		requester: 'Renata Souza',
		approver: 'Comite Operacional',
		status: 'aprovado'
	}
];

export const MOCK_HISTORY: EquipmentHistoryEvent[] = [
	{
		id: 'hist-001',
		equipmentId: 'eq-100',
		eventType: 'cadastro',
		title: 'Cadastro inicial',
		description: 'Servidor registrado pelo time de infraestrutura.',
		actor: 'Ana Ribeiro',
		timestamp: '2025-07-12T08:30:00Z'
	},
	{
		id: 'hist-002',
		equipmentId: 'eq-100',
		eventType: 'movimento',
		title: 'Transferencia para planta SP',
		description: 'Movimento autorizado para reforcar ambiente de producao.',
		actor: 'Marina Figueiredo',
		timestamp: '2025-08-10T14:10:00Z'
	},
	{
		id: 'hist-003',
		equipmentId: 'eq-100',
		eventType: 'manutencao',
		title: 'Manutencao preventiva Q3',
		description: 'Checklist completo executado pela equipe de suporte.',
		actor: 'Equipe Operacoes',
		timestamp: '2025-09-20T09:00:00Z'
	},
	{
		id: 'hist-004',
		equipmentId: 'eq-102',
		eventType: 'status_change',
		title: 'Atualizacao de status para ativo',
		description: 'Status alterado apos validacao de testes de scanner.',
		actor: 'Joao Martins',
		timestamp: '2025-10-05T11:45:00Z'
	}
];

export function buildEquipmentSummary(items: EquipmentRecord[]): EquipmentSummary {
	const base: EquipmentSummary = {
		total: items.length,
		byStatus: {
			ativo: 0,
			em_manutencao: 0,
			inativo: 0
		},
		byCriticality: {
			baixa: 0,
			media: 0,
			alta: 0,
			critica: 0
		},
		withPendingMaintenance: 0,
		withPendingTransfer: 0
	};

	for (const item of items) {
		base.byStatus[item.status] += 1;
		base.byCriticality[item.criticality] += 1;
		if (item.status === 'em_manutencao') {
			base.withPendingMaintenance += 1;
		}
		if (item.status === 'ativo' && item.lastMovementAt) {
			base.withPendingTransfer += item.lastMovementAt < '2025-09-01' ? 1 : 0;
		}
	}

	return base;
}

export function createEquipmentStore(initialEquipment: EquipmentRecord[]) {
	const equipment = writable<EquipmentRecord[]>(initialEquipment);
	const filters = writable<EquipmentFilter>({
		status: 'todos',
		locationId: 'todos',
		criticality: 'todas',
		search: ''
	});

	const filteredEquipment = derived([equipment, filters], ([$equipment, $filters]) => {
		return $equipment.filter((item) => {
			const matchStatus =
				!$filters.status || $filters.status === 'todos' || item.status === $filters.status;
			const matchLocation =
				!$filters.locationId || $filters.locationId === 'todos' || item.locationId === $filters.locationId;
			const matchCriticality =
				!$filters.criticality ||
				$filters.criticality === 'todas' ||
				item.criticality === $filters.criticality;
			const term = ($filters.search ?? '').trim().toLowerCase();
			const matchTerm =
				term.length === 0 ||
				item.assetCode.toLowerCase().includes(term) ||
				item.name.toLowerCase().includes(term) ||
				item.category.toLowerCase().includes(term) ||
				item.locationName.toLowerCase().includes(term);

			return matchStatus && matchLocation && matchCriticality && matchTerm;
		});
	});

	return {
		equipment,
		filters,
		filteredEquipment,
		setEquipment: (items: EquipmentRecord[]) => equipment.set(items),
		updateFilters: (partial: Partial<EquipmentFilter>) =>
			filters.update((current) => ({ ...current, ...partial })),
		resetFilters: () =>
			filters.set({
				status: 'todos',
				locationId: 'todos',
				criticality: 'todas',
				search: ''
			})
	};
}

export function getEquipmentById(id: string) {
	return MOCK_EQUIPMENT.find((item) => item.id === id);
}

export function listPendingApprovals() {
	return MOCK_APPROVALS.filter((approval) => approval.status === 'pendente');
}

export function listHistory(equipmentId?: string) {
	return MOCK_HISTORY.filter((event) => (equipmentId ? event.equipmentId === equipmentId : true)).sort(
		(a, b) => (a.timestamp < b.timestamp ? 1 : -1)
	);
}


