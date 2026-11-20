import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageLoad } from './$types';

/** The home page is the dashboard. The dashboard is part of the (app) group, so its URL is /dashboard. */
export const load: PageLoad = () => {
	redirect(307, resolve('/(app)/dashboard'));
};
