import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import {
	buildEquipmentSummary,
	createEquipmentStore,
	listHistory,
	MOCK_EQUIPMENT,
	MOCK_HISTORY
} from './equipment';

describe('equipment store helpers', () => {
	it('buildEquipmentSummary aggregates counts', () => {
		const summary = buildEquipmentSummary(MOCK_EQUIPMENT);

		expect(summary.total).toBe(MOCK_EQUIPMENT.length);
		expect(summary.byStatus.ativo).toBeGreaterThan(0);
		expect(summary.byCriticality.media).toBeGreaterThan(0);
	});

	it('createEquipmentStore filters by status and term', () => {
		const store = createEquipmentStore(MOCK_EQUIPMENT);
		store.updateFilters({ status: 'ativo', search: 'Servidor' });

		const filtered = get(store.filteredEquipment);

		expect(filtered.length).toBeGreaterThanOrEqual(1);
		expect(filtered.every((item) => item.status === 'ativo')).toBe(true);
		expect(filtered.every((item) => item.name.includes('Servidor'))).toBe(true);
	});

	it('listHistory filters by equipment id', () => {
		const firstEquipmentId = MOCK_HISTORY[0]?.equipmentId;
		const subset = listHistory(firstEquipmentId);

		expect(subset.length).toBeGreaterThan(0);
		expect(subset.every((event) => event.equipmentId === firstEquipmentId)).toBe(true);
	});
});

