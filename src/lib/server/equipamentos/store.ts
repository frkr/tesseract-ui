import { z } from 'zod/v4';

export type EquipmentStatus =
	| 'disponivel'
	| 'em_uso'
	| 'em_manutencao'
	| 'em_transito'
	| 'baixado';

export type MovementStatus = 'pendente' | 'aprovado' | 'em_transito' | 'concluido' | 'rejeitado';

export interface Equipment {
	id: string;
	assetTag: string;
	serialNumber: string;
	name: string;
	category: string;
	status: EquipmentStatus;
	location: string;
	currentHolder: string;
	authorizer?: string;
	purchaseDate?: string;
	purchaseValue?: number;
	maintenanceCycleDays?: number;
	notes?: string;
	createdAt: string;
	updatedAt: string;
	history: EquipmentHistoryEvent[];
}

export interface EquipmentHistoryEvent {
	id: string;
	type: 'cadastro' | 'movimentacao' | 'status' | 'informativo';
	title: string;
	details: string;
	actor: string;
	createdAt: string;
	relatedMovementId?: string;
}

export interface Movement {
	id: string;
	equipmentId: string;
	status: MovementStatus;
	originLocation: string;
	targetLocation: string;
	requestedBy: string;
	approvedBy?: string;
	authorizedBy?: string;
	requestedAt: string;
	updatedAt: string;
	expectedReturnAt?: string;
	reason?: string;
	notes?: string;
	timeline: MovementTimelineEvent[];
}

export interface MovementTimelineEvent {
	id: string;
	movementId: string;
	status: MovementStatus | 'registrado';
	title: string;
	comment?: string;
	actor: string;
	createdAt: string;
}

export interface EquipmentFilters {
	search?: string;
	status?: EquipmentStatus | 'todos';
	category?: string;
	location?: string;
	holder?: string;
}

export interface EquipmentSummary {
	total: number;
	byStatus: Record<EquipmentStatus, number>;
	pendingApprovals: Movement[];
	recentEvents: EquipmentHistoryEvent[];
}

export const createEquipmentSchema = z.object({
	assetTag: z.string().min(2).max(32).transform((value) => value.trim()),
	serialNumber: z.string().min(2).max(64).transform((value) => value.trim()),
	name: z.string().min(3).max(120).transform((value) => value.trim()),
	category: z.string().min(2).max(60).transform((value) => value.trim()),
	status: z.enum(['disponivel', 'em_uso', 'em_manutencao', 'em_transito', 'baixado']),
	location: z.string().min(2).max(120).transform((value) => value.trim()),
	currentHolder: z.string().min(2).max(120).transform((value) => value.trim()),
	authorizer: z.string().min(2).max(120).optional().transform((value) => value?.trim() || undefined),
	purchaseDate: z
		.string()
		.optional()
		.transform((value) => (value ? new Date(value).toISOString() : undefined)),
	purchaseValue: z
		.string()
		.optional()
		.transform((value) => (value ? Number.parseFloat(value) : undefined)),
	maintenanceCycleDays: z
		.string()
		.optional()
		.transform((value) => (value ? Number.parseInt(value, 10) : undefined)),
	notes: z.string().optional().transform((value) => value?.trim() || undefined)
});

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>;

export const requestMovementSchema = z.object({
	equipmentId: z.string().uuid(),
	originLocation: z.string().min(2).max(120).transform((value) => value.trim()),
	targetLocation: z.string().min(2).max(120).transform((value) => value.trim()),
	requestedBy: z.string().min(2).max(120).transform((value) => value.trim()),
	expectedReturnAt: z
		.string()
		.optional()
		.transform((value) => (value ? new Date(value).toISOString() : undefined)),
	reason: z.string().min(3).max(240).transform((value) => value.trim()),
	notes: z.string().optional().transform((value) => value?.trim() || undefined)
});

export type RequestMovementInput = z.infer<typeof requestMovementSchema>;

export const approveMovementSchema = z.object({
	movementId: z.string().uuid(),
	approvedBy: z.string().min(2).max(120).transform((value) => value.trim()),
	authorizedBy: z.string().min(2).max(120).transform((value) => value.trim()),
	comment: z.string().optional().transform((value) => value?.trim() || undefined)
});

export type ApproveMovementInput = z.infer<typeof approveMovementSchema>;

export const concludeMovementSchema = z.object({
	movementId: z.string().uuid(),
	completedBy: z.string().min(2).max(120).transform((value) => value.trim()),
	receivedBy: z.string().min(2).max(120).transform((value) => value.trim()),
	comment: z.string().optional().transform((value) => value?.trim() || undefined)
});

export type ConcludeMovementInput = z.infer<typeof concludeMovementSchema>;

const equipmentStore = new Map<string, Equipment>();
const movementStore = new Map<string, Movement>();

seedStore();

export function listEquipments(filters: EquipmentFilters = {}) {
	const { search, status, category, location, holder } = filters;

	return Array.from(equipmentStore.values())
		.filter((item) => {
			if (status && status !== 'todos' && item.status !== status) {
				return false;
			}

			if (category && item.category !== category) {
				return false;
			}

			if (location && item.location !== location) {
				return false;
			}

			if (holder && item.currentHolder !== holder) {
				return false;
			}

			if (search) {
				const normalizedSearch = search.trim().toLowerCase();
				const searchable = [
					item.assetTag,
					item.serialNumber,
					item.name,
					item.category,
					item.location,
					item.currentHolder
				]
					.filter(Boolean)
					.join(' ')
					.toLowerCase();
				return searchable.includes(normalizedSearch);
			}

			return true;
		})
		.sort((a, b) => a.name.localeCompare(b.name));
}

export function getEquipmentDetail(id: string) {
	const equipment = equipmentStore.get(id);

	if (!equipment) {
		return null;
	}

	const movements = Array.from(movementStore.values())
		.filter((movement) => movement.equipmentId === id)
		.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

	return {
		equipment,
		movements
	};
}

export function getSummary(): EquipmentSummary {
	const base: Record<EquipmentStatus, number> = {
		disponivel: 0,
		em_uso: 0,
		em_manutencao: 0,
		em_transito: 0,
		baixado: 0
	};

	for (const equipment of equipmentStore.values()) {
		base[equipment.status] += 1;
	}

	const pendingApprovals = Array.from(movementStore.values())
		.filter((movement) => movement.status === 'pendente')
		.sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));

	const recentEvents = Array.from(equipmentStore.values())
		.flatMap((equipment) => equipment.history)
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
		.slice(0, 12);

	return {
		total: equipmentStore.size,
		byStatus: base,
		pendingApprovals,
		recentEvents
	};
}

export function listCategories() {
	const categories = new Set<string>();
	for (const equipment of equipmentStore.values()) {
		categories.add(equipment.category);
	}
	return Array.from(categories).sort();
}

export function listLocations() {
	const locations = new Set<string>();
	for (const equipment of equipmentStore.values()) {
		locations.add(equipment.location);
	}
	return Array.from(locations).sort();
}

export function listHolders() {
	const holders = new Set<string>();
	for (const equipment of equipmentStore.values()) {
		holders.add(equipment.currentHolder);
	}
	return Array.from(holders).sort();
}

export function createEquipment(input: CreateEquipmentInput) {
	if (Array.from(equipmentStore.values()).some((item) => item.assetTag === input.assetTag)) {
		throw new Error('Tag patrimonial ja esta cadastrada');
	}

	if (Array.from(equipmentStore.values()).some((item) => item.serialNumber === input.serialNumber)) {
		throw new Error('Numero de serie ja esta cadastrado');
	}

	const now = new Date().toISOString();
	const id = crypto.randomUUID();

	const equipment: Equipment = {
		id,
		assetTag: input.assetTag,
		serialNumber: input.serialNumber,
		name: input.name,
		category: input.category,
		status: input.status,
		location: input.location,
		currentHolder: input.currentHolder,
		authorizer: input.authorizer,
		purchaseDate: input.purchaseDate,
		purchaseValue: input.purchaseValue,
		maintenanceCycleDays: input.maintenanceCycleDays,
		notes: input.notes,
		createdAt: now,
		updatedAt: now,
		history: [
			{
				id: crypto.randomUUID(),
				type: 'cadastro',
				title: 'Cadastro inicial',
				details: `Equipamento criado com status ${input.status}`,
				actor: input.authorizer ?? input.currentHolder,
				createdAt: now
			}
		]
	};

	equipmentStore.set(id, equipment);

	return equipment;
}

export function requestMovement(input: RequestMovementInput) {
	const equipment = equipmentStore.get(input.equipmentId);

	if (!equipment) {
		throw new Error('Equipamento nao encontrado');
	}

	if (equipment.status === 'em_transito') {
		throw new Error('Equipamento ja esta em transito');
	}

	const now = new Date().toISOString();
	const movementId = crypto.randomUUID();

	const movement: Movement = {
		id: movementId,
		equipmentId: input.equipmentId,
		status: 'pendente',
		originLocation: input.originLocation,
		targetLocation: input.targetLocation,
		requestedBy: input.requestedBy,
		requestedAt: now,
		updatedAt: now,
		expectedReturnAt: input.expectedReturnAt,
		reason: input.reason,
		notes: input.notes,
		timeline: [
			{
				id: crypto.randomUUID(),
				movementId,
				status: 'registrado',
				title: 'Solicitacao registrada',
				comment: input.reason,
				actor: input.requestedBy,
				createdAt: now
			}
		]
	};

	movementStore.set(movementId, movement);

	equipment.status = 'em_transito';
	equipment.updatedAt = now;
	equipment.history.unshift({
		id: crypto.randomUUID(),
		type: 'movimentacao',
		title: 'Solicitacao de movimentacao',
		details: `Solicitado por ${input.requestedBy} para ${input.targetLocation}`,
		actor: input.requestedBy,
		createdAt: now,
		relatedMovementId: movementId
	});

	return movement;
}

export function approveMovement(input: ApproveMovementInput) {
	const movement = movementStore.get(input.movementId);

	if (!movement) {
		throw new Error('Movimentacao nao encontrada');
	}

	if (movement.status !== 'pendente') {
		throw new Error('Movimentacao nao esta pendente');
	}

	const now = new Date().toISOString();

	movement.status = 'aprovado';
	movement.approvedBy = input.approvedBy;
	movement.authorizedBy = input.authorizedBy;
	movement.updatedAt = now;
	movement.timeline.unshift({
		id: crypto.randomUUID(),
		movementId: movement.id,
		status: 'aprovado',
		title: 'Movimentacao aprovada',
		comment: input.comment,
		actor: input.approvedBy,
		createdAt: now
	});

	const equipment = equipmentStore.get(movement.equipmentId);

	if (equipment) {
		equipment.authorizer = input.authorizedBy;
		equipment.updatedAt = now;
		equipment.history.unshift({
			id: crypto.randomUUID(),
			type: 'movimentacao',
			title: 'Movimentacao aprovada',
			details: `Aprovado por ${input.approvedBy} para ${movement.targetLocation}`,
			actor: input.authorizedBy ?? input.approvedBy,
			createdAt: now,
			relatedMovementId: movement.id
		});
	}

	return movement;
}

export function concludeMovement(input: ConcludeMovementInput) {
	const movement = movementStore.get(input.movementId);

	if (!movement) {
		throw new Error('Movimentacao nao encontrada');
	}

	if (movement.status !== 'aprovado') {
		throw new Error('Movimentacao nao esta aprovada');
	}

	const now = new Date().toISOString();

	movement.status = 'concluido';
	movement.updatedAt = now;
	movement.timeline.unshift({
		id: crypto.randomUUID(),
		movementId: movement.id,
		status: 'concluido',
		title: 'Entrega concluida',
		comment: input.comment,
		actor: input.completedBy,
		createdAt: now
	});

	const equipment = equipmentStore.get(movement.equipmentId);

	if (equipment) {
		equipment.status = 'em_uso';
		equipment.location = movement.targetLocation;
		equipment.currentHolder = input.receivedBy;
		equipment.updatedAt = now;
		equipment.history.unshift({
			id: crypto.randomUUID(),
			type: 'status',
			title: 'Movimentacao concluida',
			details: `Entregue para ${input.receivedBy} em ${movement.targetLocation}`,
			actor: input.completedBy,
			createdAt: now,
			relatedMovementId: movement.id
		});
	}

	return movement;
}

export function listMovements(limit = 20) {
	return Array.from(movementStore.values())
		.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
		.slice(0, limit);
}

export function __resetStoreForTests() {
	equipmentStore.clear();
	movementStore.clear();
	seedStore();
}

function seedStore() {
	if (equipmentStore.size > 0) {
		return;
	}

	const now = new Date();

	const seeded: Array<[Equipment, Movement[]?]> = [
		[
			{
				id: crypto.randomUUID(),
				assetTag: 'EQ-1001',
				serialNumber: 'SN-AX4920',
				name: 'Notebook Engenharia Dell 5420',
				category: 'Notebook',
				status: 'em_uso',
				location: 'Curitiba Oficina',
				currentHolder: 'Ana Lima',
				authorizer: 'Carlos Souza',
				purchaseDate: addDays(now, -420).toISOString(),
				purchaseValue: 4500,
				maintenanceCycleDays: 180,
				createdAt: addDays(now, -420).toISOString(),
				updatedAt: addDays(now, -5).toISOString(),
				notes: 'Equipamento principal da equipe de manutencao',
				history: []
			},
			[]
		],
		[
			{
				id: crypto.randomUUID(),
				assetTag: 'EQ-2033',
				serialNumber: 'SN-BR7721',
				name: 'Roteador Cisco Catalyst 9200',
				category: 'Rede',
				status: 'disponivel',
				location: 'Curitiba Almoxarifado',
				currentHolder: 'Roberto Neri',
				authorizer: 'Lucia Dias',
				purchaseDate: addDays(now, -250).toISOString(),
				purchaseValue: 18900,
				maintenanceCycleDays: 365,
				createdAt: addDays(now, -250).toISOString(),
				updatedAt: addDays(now, -3).toISOString(),
				notes: 'Pronto para instalacao em novo site',
				history: []
			},
			[]
		],
		[
			{
				id: crypto.randomUUID(),
				assetTag: 'EQ-4508',
				serialNumber: 'SN-MX8820',
				name: 'Impressora Zebra ZT411',
				category: 'Impressora',
				status: 'em_transito',
				location: 'Curitiba Almoxarifado',
				currentHolder: 'Equipe Logistica',
				authorizer: 'Patricia Melo',
				purchaseDate: addDays(now, -120).toISOString(),
				purchaseValue: 7800,
				maintenanceCycleDays: 120,
				createdAt: addDays(now, -120).toISOString(),
				updatedAt: addDays(now, -1).toISOString(),
				notes: 'Movimentacao urgente para filial Joinville',
				history: []
			},
			[
				{
					id: crypto.randomUUID(),
					equipmentId: '',
					status: 'aprovado',
					originLocation: 'Curitiba Almoxarifado',
					targetLocation: 'Joinville Operacao',
					requestedBy: 'Joao Naves',
					approvedBy: 'Patricia Melo',
					authorizedBy: 'Patricia Melo',
					requestedAt: addDays(now, -2).toISOString(),
					updatedAt: addDays(now, -1).toISOString(),
					expectedReturnAt: addDays(now, 120).toISOString(),
					reason: 'Implantacao nova linha de embalagens',
					timeline: []
				}
			]
		],
		[
			{
				id: crypto.randomUUID(),
				assetTag: 'EQ-7701',
				serialNumber: 'SN-QL1122',
				name: 'Gerador Energia 25kVA',
				category: 'Energia',
				status: 'em_manutencao',
				location: 'Curitiba Oficina',
				currentHolder: 'Equipe Engenharia',
				authorizer: 'Rafael Costa',
				purchaseDate: addDays(now, -780).toISOString(),
				purchaseValue: 54000,
				maintenanceCycleDays: 90,
				createdAt: addDays(now, -780).toISOString(),
				updatedAt: addDays(now, -7).toISOString(),
				notes: 'Substituicao de regulador de tensao',
				history: []
			},
			[]
		]
	];

	for (const [equipment, movements] of seeded) {
		equipment.history.push({
			id: crypto.randomUUID(),
			type: 'cadastro',
			title: 'Cadastro inicial',
			details: `Equipamento criado com status ${equipment.status}`,
			actor: equipment.authorizer ?? equipment.currentHolder,
			createdAt: equipment.createdAt
		});

		equipmentStore.set(equipment.id, equipment);

		for (const movement of movements ?? []) {
			const movementId = movement.id || crypto.randomUUID();

			const seededMovement: Movement = {
				...movement,
				id: movementId,
				equipmentId: equipment.id,
				notes: movement.notes,
				timeline: movement.timeline.length
					? movement.timeline
					: [
							{
								id: crypto.randomUUID(),
								movementId,
								status: 'registrado',
								title: 'Solicitacao criada',
								comment: movement.reason,
								actor: movement.requestedBy,
								createdAt: movement.requestedAt
							},
							{
								id: crypto.randomUUID(),
								movementId,
								status: movement.status,
								title: 'Movimentacao aprovada',
								comment: movement.reason,
								actor: movement.approvedBy ?? movement.authorizedBy ?? movement.requestedBy,
								createdAt: movement.updatedAt
							}
						]
			};

			movementStore.set(movementId, seededMovement);

			equipment.history.unshift({
				id: crypto.randomUUID(),
				type: 'movimentacao',
				title: 'Movimentacao importada',
				details: `Historico importado para ${movement.targetLocation}`,
				actor: movement.approvedBy ?? movement.authorizedBy ?? movement.requestedBy,
				createdAt: movement.updatedAt,
				relatedMovementId: movementId
			});
		}
	}
}

function addDays(base: Date, days: number) {
	const cloned = new Date(base);
	cloned.setDate(base.getDate() + days);
	return cloned;
}
