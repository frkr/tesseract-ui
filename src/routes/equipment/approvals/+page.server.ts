import type { PageServerLoad } from './$types';
import { listPendingApprovals, MOCK_APPROVALS } from '$lib/stores/equipment';

export const load: PageServerLoad = async () => {
	const pending = listPendingApprovals();
	const history = MOCK_APPROVALS.filter((approval) => approval.status !== 'pendente');

	return {
		pending,
		history
	};
};

