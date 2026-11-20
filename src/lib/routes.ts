/**
 * Typed route IDs for `resolve()` from `$app/paths`.
 *
 * Route IDs include route-group segments such as `(app)` and `(auth)`, which are
 * not part of the public URL. `/(app)/tasks` is served at `/tasks`. Using route IDs keeps
 * `resolve()` type-checked against the real routes, so a mistyped link fails `svelte-check`.
 */

/** Signed-in application pages, which use the `(app)` layout with the sidebar shell. */
export type AppRoute =
	| '/(app)/dashboard'
	| '/(app)/tasks'
	| '/(app)/groceries'
	| '/(app)/calendar'
	| '/(app)/expenses'
	| '/(app)/leaderboard'
	| '/(app)/household'
	| '/(app)/profile';

/** Public authentication pages, which use the `(auth)` layout. */
export const AUTH_ROUTES = [
	'/(auth)/login',
	'/(auth)/register',
	'/(auth)/forgot-password'
] as const;

export type AuthRoute = (typeof AUTH_ROUTES)[number];

/** Converts a route ID into its public pathname, such as `/(app)/tasks` into `/tasks`. */
export function publicPathname(route: AppRoute | AuthRoute): string {
	return route.replace(/^\/\((app|auth)\)/, '');
}
