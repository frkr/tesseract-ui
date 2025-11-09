import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getEquipmentDetail,
	requestMovement,
	requestMovementSchema
} from '$lib/server/equipamentos/store';

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

export const actions: Actions = {
	default: async ({ params, request }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = requestMovementSchema.safeParse({
			...raw,
			equipmentId: params.id
		});

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, {
				success: false,
				errors,
				values: raw
			});
		}

		try {
			const movement = requestMovement(parsed.data);
			throw redirect(303, `/equipamentos/${movement.equipmentId}`);
		} catch (err) {
			return fail(400, {
				success: false,
				errors: {
					general: [(err as Error).message ?? 'Falha ao registrar movimentacao']
				},
				values: raw
			});
		}
	}
};
