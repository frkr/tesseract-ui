import { describe, beforeEach, expect, it } from 'vitest';
import {
	__resetStoreForTests,
	createEquipment,
	createEquipmentSchema,
	getSummary,
	listEquipments,
	requestMovement,
	requestMovementSchema,
	approveMovement,
	approveMovementSchema,
	concludeMovement,
	concludeMovementSchema
} from './store';

describe('equipamentos store', () => {
	beforeEach(() => {
		__resetStoreForTests();
	});

	it('mantem dados base apos reset', () => {
		const summary = getSummary();
		expect(summary.total).toBeGreaterThanOrEqual(4);
	});

	it('cria novo equipamento e reflete no resumo', () => {
		const raw = {
			assetTag: 'EQ-9999',
			serialNumber: 'SN-TESTE-1',
			name: 'Servidor teste laboratorio',
			category: 'Servidor',
			status: 'disponivel',
			location: 'Curitiba Laboratorio',
			currentHolder: 'Equipe QA'
		};

		const parsed = createEquipmentSchema.parse(raw);
		createEquipment(parsed);

		const summary = getSummary();
		const found = listEquipments().find((item) => item.assetTag === raw.assetTag);

		expect(found).toBeDefined();
		expect(summary.total).toBeGreaterThanOrEqual(5);
	});

	it('fluxo completo de movimentacao altera status', () => {
		const equipment = listEquipments()[0];

		const movementInput = requestMovementSchema.parse({
			equipmentId: equipment.id,
			originLocation: equipment.location,
			targetLocation: 'Joinville Operacao',
			requestedBy: 'Maria Silva',
			reason: 'Uso temporario em projeto piloto'
		});

		const movement = requestMovement(movementInput);
		expect(movement.status).toBe('pendente');

		const approveInput = approveMovementSchema.parse({
			movementId: movement.id,
			approvedBy: 'Joao Gestor',
			authorizedBy: 'Joao Gestor'
		});

		const approved = approveMovement(approveInput);
		expect(approved.status).toBe('aprovado');

		const concludeInput = concludeMovementSchema.parse({
			movementId: movement.id,
			completedBy: 'Carlos Motorista',
			receivedBy: 'Equipe Local'
		});

		const concluded = concludeMovement(concludeInput);
		expect(concluded.status).toBe('concluido');
	});
});
