import type { LayoutLoad } from './$types';
import {
	SAMPLE_ACTIVE_HOUSEHOLD_ID,
	SAMPLE_CURRENT_USER,
	SAMPLE_HOUSEHOLDS
} from '#lib/mock/sample-data';

export const load: LayoutLoad = () => {
	const sampleHousehold = SAMPLE_HOUSEHOLDS.find(
		(household) => household.id === SAMPLE_ACTIVE_HOUSEHOLD_ID
	);

	return {
		currentUser: SAMPLE_CURRENT_USER,
		households: SAMPLE_HOUSEHOLDS,
		activeHouseholdId: SAMPLE_ACTIVE_HOUSEHOLD_ID,
		dataNote: `Pages show sample data for ${sampleHousehold?.name ?? 'your household'}.`
	};
};
