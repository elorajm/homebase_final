import type { PageLoad } from './$types';
import {
	SAMPLE_CURRENT_USER,
	SAMPLE_MEMBERS,
	SAMPLE_POINT_TRANSACTIONS
} from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	currentUser: SAMPLE_CURRENT_USER,
	members: SAMPLE_MEMBERS,
	transactions: SAMPLE_POINT_TRANSACTIONS
});
