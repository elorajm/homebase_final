import { describe, expect, it } from 'vitest';
import { isCurrentPath, NAV_ITEMS } from './navigation';
import { AUTH_ROUTES, publicPathname } from './routes';

describe('isCurrentPath', () => {
	it('matches the page itself and its sub-pages', () => {
		expect(isCurrentPath('/tasks', '/(app)/tasks')).toBe(true);
		expect(isCurrentPath('/tasks/today', '/(app)/tasks')).toBe(true);
	});

	it('does not match a different page that shares a prefix', () => {
		expect(isCurrentPath('/tasksheet', '/(app)/tasks')).toBe(false);
		expect(isCurrentPath('/dashboard', '/(app)/tasks')).toBe(false);
	});
});

describe('route groups keep the public URLs', () => {
	it('serves every navigation item at its existing pathname', () => {
		expect(NAV_ITEMS.map((item) => publicPathname(item.route))).toEqual([
			'/dashboard',
			'/tasks',
			'/groceries',
			'/calendar',
			'/expenses',
			'/leaderboard',
			'/household',
			'/profile'
		]);
	});

	it('serves the authentication pages at /login, /register, and /forgot-password', () => {
		expect(AUTH_ROUTES.map(publicPathname)).toEqual(['/login', '/register', '/forgot-password']);
	});
});
