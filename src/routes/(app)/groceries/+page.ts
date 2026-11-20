import type { PageLoad } from './$types';
import {
	SAMPLE_GROCERY_ITEMS,
	SAMPLE_GROCERY_LIST_NAME,
	SAMPLE_TODAY
} from '#lib/mock/sample-data';

export const load: PageLoad = () => ({
	listName: SAMPLE_GROCERY_LIST_NAME,
	items: SAMPLE_GROCERY_ITEMS,
	today: SAMPLE_TODAY
});
