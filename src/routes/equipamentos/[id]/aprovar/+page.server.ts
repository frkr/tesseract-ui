import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	approveMovement,
	approveMovementSchema,
	concludeMovement,
	concludeMovementSchema,
	getEquipmentDetail
} from '$lib/server/equipamentos/store';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/user/login');
	}

	const detail = getEquipmentDetail(params.id);

	if (!detail) {
		throw error(404, 'Equipamento nao encontrado');
	}

	const movementIdFromQuery = url.searchParams.get('mid');
	const pendingMovement =
		detail.movements.find((movement) => movement.id === movementIdFromQuery) ??
		detail.movements.find((movement) => movement.status === 'pendente' || movement.status === 'aprovado');

	return {
		equipment: detail.equipment,
		movements: detail.movements,
		targetMovement: pendingMovement ?? null
	};
};

export const actions: Actions = {
	approve: async ({ request, params }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = approveMovementSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, {
				form: 'approve',
				success: false,
				errors,
				values: raw
			});
		}

		try {
			const movement = approveMovement(parsed.data);
			throw redirect(303, `/equipamentos/${params.id}?mid=${movement.id}`);
		} catch (err) {
			return fail(400, {
				form: 'approve',
				success: false,
				errors: {
					general: [(err as Error).message ?? 'Falha ao aprovar movimentacao']
				},
				values: raw
			});
		}
	},
	conclude: async ({ request, params }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = concludeMovementSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, {
				form: 'conclude',
				success: false,
				errors,
				values: raw
			});
		}

		try {
			const movement = concludeMovement(parsed.data);
			throw redirect(303, `/equipamentos/${params.id}?mid=${movement.id}`);
		} catch (err) {
			return fail(400, {
				form: 'conclude',
				success: false,
				errors: {
					general: [(err as Error).message ?? 'Falha ao concluir movimentacao']
				},
				values: raw
			});
		}
	}
};
