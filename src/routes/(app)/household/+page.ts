import type { PageLoad } from './$types';
import {
	SAMPLE_ACTIVE_HOUSEHOLD,
	SAMPLE_CURRENT_USER,
	SAMPLE_INVITATIONS,
	SAMPLE_MEMBERS,
	SAMPLE_TODAY
} from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	today: SAMPLE_TODAY,
	household: SAMPLE_ACTIVE_HOUSEHOLD,
	currentUser: SAMPLE_CURRENT_USER,
	members: SAMPLE_MEMBERS,
	invitations: SAMPLE_INVITATIONS
});
