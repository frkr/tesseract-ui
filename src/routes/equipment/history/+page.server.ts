import type { PageServerLoad } from './$types';
import { getEquipmentById, listHistory, MOCK_EQUIPMENT } from '$lib/stores/equipment';

export const load: PageServerLoad = async ({ url }) => {
	const focusId = url.searchParams.get('focus') ?? undefined;
	const events = listHistory(focusId);

	return {
		events,
		focus: focusId ? getEquipmentById(focusId) ?? null : null,
		equipment: MOCK_EQUIPMENT
	};
};

