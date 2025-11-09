import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEquipmentDetail } from '$lib/server/equipamentos/store';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/user/login');
	}

	const detail = getEquipmentDetail(params.id);

	if (!detail) {
		throw error(404, 'Equipamento nao encontrado');
	}

	return {
		equipment: detail.equipment,
		movements: detail.movements
	};
};
