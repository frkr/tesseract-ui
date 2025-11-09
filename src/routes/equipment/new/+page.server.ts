import type { PageServerLoad } from './$types';
import { MOCK_EQUIPMENT, MOCK_LOCATIONS } from '$lib/stores/equipment';

export const load: PageServerLoad = async () => {
	return {
		locations: MOCK_LOCATIONS,
		suggestedCodes: MOCK_EQUIPMENT.map((item) => item.assetCode)
	};
};

