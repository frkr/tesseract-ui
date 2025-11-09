import type { PageServerLoad } from './$types';
import { MOCK_EQUIPMENT, buildEquipmentSummary } from '$lib/stores/equipment';

export const load: PageServerLoad = async () => {
	const summary = buildEquipmentSummary(MOCK_EQUIPMENT);

	const csvPreview = [
		['asset_code', 'name', 'status', 'criticality', 'location', 'custodian'].join(','),
		...MOCK_EQUIPMENT.map((item) =>
			[
				item.assetCode,
				item.name,
				item.status,
				item.criticality,
				item.locationName,
				item.custodian ?? ''
			].join(',')
		)
	].join('\n');

	return {
		summary,
		csvPreview
	};
};

