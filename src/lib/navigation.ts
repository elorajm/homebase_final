import type { Component } from 'svelte';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import ListTodo from '@lucide/svelte/icons/list-todo';
import ShoppingBasket from '@lucide/svelte/icons/shopping-basket';
import CalendarDays from '@lucide/svelte/icons/calendar-days';
import ReceiptText from '@lucide/svelte/icons/receipt-text';
import Trophy from '@lucide/svelte/icons/trophy';
import House from '@lucide/svelte/icons/house';
import UserRound from '@lucide/svelte/icons/user-round';
import { publicPathname, type AppRoute } from './routes';

export type { AppRoute } from './routes';

export interface NavItem {
	route: AppRoute;
	label: string;
	icon: Component;
}

/** Primary navigation. The order matches the sidebar and the mobile menu. */
export const NAV_ITEMS: NavItem[] = [
	{ route: '/(app)/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ route: '/(app)/tasks', label: 'Tasks & Chores', icon: ListTodo },
	{ route: '/(app)/groceries', label: 'Grocery Lists', icon: ShoppingBasket },
	{ route: '/(app)/calendar', label: 'Calendar', icon: CalendarDays },
	{ route: '/(app)/expenses', label: 'Expenses', icon: ReceiptText },
	{ route: '/(app)/leaderboard', label: 'Leaderboard', icon: Trophy },
	{ route: '/(app)/household', label: 'Household Settings', icon: House },
	{ route: '/(app)/profile', label: 'Profile', icon: UserRound }
];

/** Returns true when `currentPath` (a public pathname) is the item's page or one of its sub-pages. */
export function isCurrentPath(currentPath: string, route: AppRoute): boolean {
	const pathname = publicPathname(route);
	return currentPath === pathname || currentPath.startsWith(`${pathname}/`);
}
