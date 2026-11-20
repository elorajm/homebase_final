import type { IsoDate } from './types';
import { parseIsoDate } from './dates';

/** Formats an integer amount of cents as a currency string, such as `$1,234.50`. */
export function formatCurrency(cents: number, currencyCode: string): string {
	return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(
		cents / 100
	);
}

/** Formats a calendar date without applying any local time zone, such as `Fri, Nov 20`. */
export function formatDate(value: IsoDate, style: 'short' | 'long' = 'short'): string {
	const options: Intl.DateTimeFormatOptions =
		style === 'long'
			? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
			: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' };
	return new Intl.DateTimeFormat('en-US', options).format(parseIsoDate(value));
}

/** Formats a year and 1-based month as a title, such as `November 2026`. */
export function formatMonthTitle(year: number, month: number): string {
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	}).format(new Date(Date.UTC(year, month - 1, 1)));
}

/** Converts a 24-hour `HH:MM` time into a 12-hour label, such as `4:30 PM`. */
export function formatTime(value: string): string {
	const [hourText = '0', minute = '00'] = value.split(':');
	const hour = Number(hourText);
	const suffix = hour >= 12 ? 'PM' : 'AM';
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	return `${displayHour}:${minute} ${suffix}`;
}

/** Returns the initials for a display name, such as `SR` for `Sam Rivera`. */
export function initialsOf(displayName: string): string {
	return displayName
		.split(/\s+/)
		.filter((part) => part.length > 0)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('');
}
