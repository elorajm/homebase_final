import { describe, expect, it } from 'vitest';
import { addDays, buildMonthGrid, monthKey, parseIsoDate, toIsoDate } from './dates';

describe('buildMonthGrid', () => {
	it('starts November 2026 on Sunday and fills five full weeks', () => {
		const weeks = buildMonthGrid(2026, 11);

		expect(weeks).toHaveLength(5);
		expect(weeks.every((week) => week.length === 7)).toBe(true);
		expect(weeks[0]?.[0]).toEqual({ date: '2026-11-01', inMonth: true });
		expect(weeks[4]?.[1]).toEqual({ date: '2026-11-30', inMonth: true });
		expect(weeks[4]?.[2]).toEqual({ date: '2026-12-01', inMonth: false });
	});

	it('pads June 2026, which starts on a Monday, with May days', () => {
		const weeks = buildMonthGrid(2026, 6);

		expect(weeks[0]?.[0]).toEqual({ date: '2026-05-31', inMonth: false });
		expect(weeks[0]?.[1]).toEqual({ date: '2026-06-01', inMonth: true });
		expect(weeks.flat().filter((day) => day.inMonth)).toHaveLength(30);
	});
});

describe('date arithmetic', () => {
	it('moves across month and year boundaries using calendar days', () => {
		expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
		expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
		expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
	});

	it('round-trips ISO dates without shifting the day', () => {
		expect(toIsoDate(parseIsoDate('2026-11-20'))).toBe('2026-11-20');
	});

	it('returns the YYYY-MM month key', () => {
		expect(monthKey('2026-11-20')).toBe('2026-11');
	});
});
