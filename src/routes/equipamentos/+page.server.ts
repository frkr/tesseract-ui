import type { PageServerLoad } from './$types';
import {
	getSummary,
	listEquipments,
	listMovements,
	type EquipmentStatus,
	type EquipmentFilters
} from '$lib/server/equipamentos/store';

function resolveFilters(searchParams: URLSearchParams): EquipmentFilters {
	const status = searchParams.get('status');
	const filters: EquipmentFilters = {};

	if (searchParams.get('q')) {
		filters.search = searchParams.get('q') ?? undefined;
	}

	if (status && status !== 'todos') {
		filters.status = status as EquipmentStatus;
	} else if (status === 'todos') {
		filters.status = 'todos';
	}

	if (searchParams.get('category')) {
		filters.category = searchParams.get('category') ?? undefined;
	}

	if (searchParams.get('location')) {
		filters.location = searchParams.get('location') ?? undefined;
	}

	if (searchParams.get('holder')) {
		filters.holder = searchParams.get('holder') ?? undefined;
	}

	return filters;
}

export const load: PageServerLoad = async ({ url }) => {
	const filters = resolveFilters(url.searchParams);
	const summary = getSummary();
	const equipments = listEquipments(filters);
	const recentMovements = listMovements(8);

	return {
		summary,
		equipments,
		recentMovements,
		activeFilters: {
			search: filters.search ?? '',
			status: filters.status ?? 'todos',
			category: filters.category ?? '',
			location: filters.location ?? '',
			holder: filters.holder ?? ''
		}
	};
};
