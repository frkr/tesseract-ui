import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEquipmentById } from '$lib/stores/equipment';

export const load: PageServerLoad = async ({ params }) => {
	const equipment = getEquipmentById(params.id);

	if (!equipment) {
		throw error(404, 'Equipamento nao encontrado');
	}

	return {
		equipment
	};
};

