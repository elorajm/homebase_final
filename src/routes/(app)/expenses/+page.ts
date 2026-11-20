import type { PageLoad } from './$types';
import {
	SAMPLE_ACTIVE_HOUSEHOLD,
	SAMPLE_EXPENSES,
	SAMPLE_MEMBERS,
	SAMPLE_TODAY
} from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	today: SAMPLE_TODAY,
	household: SAMPLE_ACTIVE_HOUSEHOLD,
	members: SAMPLE_MEMBERS,
	expenses: SAMPLE_EXPENSES
});
