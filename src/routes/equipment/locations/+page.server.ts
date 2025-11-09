import type { PageServerLoad } from './$types';
import { MOCK_EQUIPMENT, MOCK_LOCATIONS } from '$lib/stores/equipment';

export const load: PageServerLoad = async () => {
	const withStats = MOCK_LOCATIONS.map((location) => {
		const equipments = MOCK_EQUIPMENT.filter((item) => item.locationId === location.id);
		return {
			...location,
			total: equipments.length,
			ativos: equipments.filter((item) => item.status === 'ativo').length,
			emManutencao: equipments.filter((item) => item.status === 'em_manutencao').length,
			inativos: equipments.filter((item) => item.status === 'inativo').length
		};
	});

	return {
		locations: withStats
	};
};

