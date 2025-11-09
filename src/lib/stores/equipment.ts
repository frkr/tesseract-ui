import { derived, get, writable } from 'svelte/store';

export type EquipmentStatus = 'available' | 'allocated' | 'maintenance';
export type MovementType = 'allocation' | 'transfer' | 'return' | 'maintenance';

export interface EquipmentRecord {
	id: string;
	assetTag: string;
	name: string;
	category: string;
	status: EquipmentStatus;
	currentLocation: string;
	custodian: string;
	authorizer: string;
	lastMovementAt: string;
}

export interface EquipmentMovement {
	id: string;
	equipmentId: string;
	equipmentName: string;
	fromLocation: string;
	toLocation: string;
	movedBy: string;
	custodian: string;
	authorizedBy: string;
	movedAt: string;
	type: MovementType;
	notes?: string;
}

interface MoveEquipmentInput {
	equipmentId: string;
	toLocation: string;
	movedBy: string;
	custodian: string;
	authorizedBy: string;
	type: MovementType;
	notes?: string;
	statusOverride?: EquipmentStatus;
}

interface AddEquipmentInput {
	assetTag: string;
	name: string;
	category: string;
	location: string;
	custodian: string;
	authorizer: string;
	status?: EquipmentStatus;
}

const initialEquipment: EquipmentRecord[] = [
	{
		id: 'eq-001',
		assetTag: 'ASSET-001',
		name: 'Dell Latitude 7440',
		category: 'Notebook',
		status: 'allocated',
		currentLocation: 'HQ Floor 3',
		custodian: 'Ana Lima',
		authorizer: 'Carlos Souza',
		lastMovementAt: '2024-11-01T13:45:00.000Z'
	},
	{
		id: 'eq-002',
		assetTag: 'ASSET-002',
		name: 'Honeywell Dolphin CT60',
		category: 'Scanner',
		status: 'available',
		currentLocation: 'Distribution Center',
		custodian: 'Warehouse Team',
		authorizer: 'Julio Martins',
		lastMovementAt: '2024-10-21T09:15:00.000Z'
	},
	{
		id: 'eq-003',
		assetTag: 'ASSET-003',
		name: 'Cisco Catalyst C9300',
		category: 'Network',
		status: 'maintenance',
		currentLocation: 'Service Lab',
		custodian: 'Infra Squad',
		authorizer: 'Maria das Dores',
		lastMovementAt: '2024-11-05T17:30:00.000Z'
	},
	{
		id: 'eq-004',
		assetTag: 'ASSET-004',
		name: 'Samsung Galaxy Tab Active4',
		category: 'Tablet',
		status: 'allocated',
		currentLocation: 'Field Team North',
		custodian: 'Pedro Alves',
		authorizer: 'Beatriz Braga',
		lastMovementAt: '2024-11-04T11:05:00.000Z'
	},
	{
		id: 'eq-005',
		assetTag: 'ASSET-005',
		name: 'Motorola MOTOTRBO R7',
		category: 'Radio',
		status: 'available',
		currentLocation: 'HQ Floor 1',
		custodian: 'Security Team',
		authorizer: 'Claudio Dias',
		lastMovementAt: '2024-10-28T08:00:00.000Z'
	},
	{
		id: 'eq-006',
		assetTag: 'ASSET-006',
		name: 'Brother TD-4550DNWB',
		category: 'Label Printer',
		status: 'allocated',
		currentLocation: 'Logistics East',
		custodian: 'Joao Pedro',
		authorizer: 'Fernanda Costa',
		lastMovementAt: '2024-11-02T15:20:00.000Z'
	}
];

const initialMovements: EquipmentMovement[] = [
	{
		id: 'mov-01',
		equipmentId: 'eq-001',
		equipmentName: 'Dell Latitude 7440',
		fromLocation: 'HQ Floor 1',
		toLocation: 'HQ Floor 3',
		movedBy: 'Ana Lima',
		custodian: 'Ana Lima',
		authorizedBy: 'Carlos Souza',
		movedAt: '2024-11-01T13:45:00.000Z',
		type: 'transfer',
		notes: 'Allocated to design pod'
	},
	{
		id: 'mov-02',
		equipmentId: 'eq-002',
		equipmentName: 'Honeywell Dolphin CT60',
		fromLocation: 'Distribution Center',
		toLocation: 'Distribution Center',
		movedBy: 'Warehouse Team',
		custodian: 'Warehouse Team',
		authorizedBy: 'Julio Martins',
		movedAt: '2024-10-21T09:15:00.000Z',
		type: 'return',
		notes: 'Returned after inventory cycle'
	},
	{
		id: 'mov-03',
		equipmentId: 'eq-003',
		equipmentName: 'Cisco Catalyst C9300',
		fromLocation: 'HQ Data Room',
		toLocation: 'Service Lab',
		movedBy: 'Infra Squad',
		custodian: 'Infra Squad',
		authorizedBy: 'Maria das Dores',
		movedAt: '2024-11-05T17:30:00.000Z',
		type: 'maintenance',
		notes: 'Scheduled firmware upgrade'
	},
	{
		id: 'mov-04',
		equipmentId: 'eq-004',
		equipmentName: 'Samsung Galaxy Tab Active4',
		fromLocation: 'HQ Floor 2',
		toLocation: 'Field Team North',
		movedBy: 'Pedro Alves',
		custodian: 'Pedro Alves',
		authorizedBy: 'Beatriz Braga',
		movedAt: '2024-11-04T11:05:00.000Z',
		type: 'allocation',
		notes: 'Assigned for customer rollout'
	},
	{
		id: 'mov-05',
		equipmentId: 'eq-006',
		equipmentName: 'Brother TD-4550DNWB',
		fromLocation: 'HQ Floor 1',
		toLocation: 'Logistics East',
		movedBy: 'Joao Pedro',
		custodian: 'Joao Pedro',
		authorizedBy: 'Fernanda Costa',
		movedAt: '2024-11-02T15:20:00.000Z',
		type: 'transfer',
		notes: 'Reassigned to new logistics hub'
	}
];

const equipmentStore = writable<EquipmentRecord[]>(initialEquipment);
const movementStore = writable<EquipmentMovement[]>(initialMovements);

function createId(prefix: string) {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `${prefix}-${crypto.randomUUID()}`;
	}
	return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function resolveStatus(type: MovementType, override?: EquipmentStatus): EquipmentStatus {
	if (override) {
		return override;
	}

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

export function addEquipment(input: AddEquipmentInput) {
	const now = new Date().toISOString();
	const record: EquipmentRecord = {
		id: createId('eq'),
		assetTag: input.assetTag,
		name: input.name,
		category: input.category,
		status: input.status ?? 'available',
		currentLocation: input.location,
		custodian: input.custodian,
		authorizer: input.authorizer,
		lastMovementAt: now
	};

	equipmentStore.update((items) => [record, ...items]);

	movementStore.update((movements) => [
		{
			id: createId('mov'),
			equipmentId: record.id,
			equipmentName: record.name,
			fromLocation: 'N/A',
			toLocation: input.location,
			movedBy: input.custodian,
			custodian: input.custodian,
			authorizedBy: input.authorizer,
			movedAt: now,
			type: 'allocation',
			notes: 'Initial registration'
		},
		...movements
	]);
}

export function moveEquipment(input: MoveEquipmentInput) {
	const now = new Date().toISOString();

	equipmentStore.update((items) =>
		items.map((item) => {
			if (item.id !== input.equipmentId) {
				return item;
			}

			const nextStatus = resolveStatus(input.type, input.statusOverride);

			return {
				...item,
				status: nextStatus,
				currentLocation: input.toLocation,
				custodian: input.custodian,
				authorizer: input.authorizedBy,
				lastMovementAt: now
			};
		})
	);

	const equipment = getEquipmentById(input.equipmentId);

	movementStore.update((movements) => [
		{
			id: createId('mov'),
			equipmentId: input.equipmentId,
			equipmentName: equipment?.name ?? 'Unknown',
			fromLocation: equipment?.currentLocation ?? 'Unknown',
			toLocation: input.toLocation,
			movedBy: input.movedBy,
			custodian: input.custodian,
			authorizedBy: input.authorizedBy,
			movedAt: now,
			type: input.type,
			notes: input.notes
		},
		...movements
	]);
}

function getEquipmentById(id: string) {
	return get(equipmentStore).find((item) => item.id === id);
}

export const equipmentList = {
	subscribe: equipmentStore.subscribe
};

export const equipmentMovements = {
	subscribe: movementStore.subscribe
};

export const equipmentStats = derived(equipmentStore, (items) => {
	const total = items.length;
	const available = items.filter((item) => item.status === 'available').length;
	const allocated = items.filter((item) => item.status === 'allocated').length;
	const maintenance = items.filter((item) => item.status === 'maintenance').length;

	const lastUpdated = items
		.map((item) => item.lastMovementAt)
		.sort((a, b) => (a < b ? 1 : -1))[0];

	return {
		total,
		available,
		allocated,
		maintenance,
		lastUpdated
	};
});

export const equipmentLocations = derived(equipmentStore, (items) => {
	const unique = new Set<string>();
	items.forEach((item) => {
		if (item.currentLocation) {
			unique.add(item.currentLocation);
		}
	});
	return Array.from(unique).sort();
});

export const equipmentCategories = derived(equipmentStore, (items) => {
	const unique = new Set<string>();
	items.forEach((item) => {
		if (item.category) {
			unique.add(item.category);
		}
	});
	return Array.from(unique).sort();
});
