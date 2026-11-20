import type { IsoDate } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface CalendarDay {
	date: IsoDate;
	inMonth: boolean;
}

/** Converts a `Date` to its UTC calendar date. */
export function toIsoDate(date: Date): IsoDate {
	return date.toISOString().slice(0, 10);
}

/** Parses an ISO calendar date as UTC midnight, so no local time zone shifts the day. */
export function parseIsoDate(value: IsoDate): Date {
	return new Date(`${value}T00:00:00Z`);
}

export function addDays(value: IsoDate, days: number): IsoDate {
	return toIsoDate(new Date(parseIsoDate(value).getTime() + days * DAY_MS));
}

/** Returns `YYYY-MM` for an ISO calendar date. */
export function monthKey(value: IsoDate): string {
	return value.slice(0, 7);
}

/**
 * Builds the weeks of a month for a calendar that starts on Sunday.
 * `month` is 1-based (January is 1). Leading and trailing cells belong to adjacent months.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[][] {
	const firstOfMonth = Date.UTC(year, month - 1, 1);
	const leadingDays = new Date(firstOfMonth).getUTCDay();
	const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

	const weeks: CalendarDay[][] = [];
	let week: CalendarDay[] = [];
	for (let cell = 0; cell < totalCells; cell += 1) {
		const dayOffset = cell - leadingDays;
		const date = toIsoDate(new Date(firstOfMonth + dayOffset * DAY_MS));
		week.push({ date, inMonth: dayOffset >= 0 && dayOffset < daysInMonth });
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}
	return weeks;
}

/** Moves a 1-based year and month by a number of months, across year boundaries. */
export function shiftMonth(
	year: number,
	month: number,
	delta: number
): { year: number; month: number } {
	const index = year * 12 + (month - 1) + delta;
	return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}
