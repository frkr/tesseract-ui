import type { PageServerLoad } from './$types';
import { buildEquipmentSummary, MOCK_EQUIPMENT, MOCK_LOCATIONS, MOCK_POLICIES } from '$lib/stores/equipment';

export const load: PageServerLoad = async () => {
	const summary = buildEquipmentSummary(MOCK_EQUIPMENT);

	return {
		equipment: MOCK_EQUIPMENT,
		locations: MOCK_LOCATIONS,
		policies: MOCK_POLICIES,
		summary
	};
};

