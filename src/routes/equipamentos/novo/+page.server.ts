import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createEquipment,
	createEquipmentSchema,
	listCategories,
	listLocations
} from '$lib/server/equipamentos/store';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/user/login');
	}

	return {
		categories: listCategories(),
		locations: listLocations()
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const raw = Object.fromEntries(formData);

		const parsed = createEquipmentSchema.safeParse(raw);

		if (!parsed.success) {
			const errors = parsed.error.flatten().fieldErrors;
			return fail(400, {
				success: false,
				errors,
				values: raw
			});
		}

		try {
			const equipment = createEquipment(parsed.data);
			throw redirect(303, `/equipamentos/${equipment.id}`);
		} catch (error) {
			return fail(400, {
				success: false,
				errors: {
					general: [(error as Error).message ?? 'Falha ao cadastrar equipamento']
				},
				values: raw
			});
		}
	}
};
