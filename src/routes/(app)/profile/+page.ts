import type { PageLoad } from './$types';
import { SAMPLE_CURRENT_USER, SAMPLE_HOUSEHOLDS } from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	currentUser: SAMPLE_CURRENT_USER,
	households: SAMPLE_HOUSEHOLDS
});
