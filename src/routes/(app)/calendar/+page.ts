import type { PageLoad } from './$types';
import {
	SAMPLE_CURRENT_USER,
	SAMPLE_EVENTS,
	SAMPLE_MEMBERS,
	SAMPLE_TASKS,
	SAMPLE_TODAY
} from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	today: SAMPLE_TODAY,
	currentUser: SAMPLE_CURRENT_USER,
	members: SAMPLE_MEMBERS,
	events: SAMPLE_EVENTS,
	tasks: SAMPLE_TASKS
});
