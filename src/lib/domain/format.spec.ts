import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatMonthTitle, formatTime, initialsOf } from './format';

describe('formatCurrency', () => {
	it('formats integer cents as US dollars', () => {
		expect(formatCurrency(185000, 'USD')).toBe('$1,850.00');
		expect(formatCurrency(14286, 'USD')).toBe('$142.86');
	});
});

describe('formatDate and formatMonthTitle', () => {
	it('formats a calendar date without a time zone shift', () => {
		expect(formatDate('2026-11-20')).toBe('Fri, Nov 20');
		expect(formatDate('2026-11-20', 'long')).toBe('Friday, November 20, 2026');
	});

	it('formats a month title', () => {
		expect(formatMonthTitle(2026, 11)).toBe('November 2026');
	});
});

describe('formatTime', () => {
	it('converts 24-hour times to 12-hour labels', () => {
		expect(formatTime('16:30')).toBe('4:30 PM');
		expect(formatTime('00:05')).toBe('12:05 AM');
		expect(formatTime('12:00')).toBe('12:00 PM');
	});
});

describe('initialsOf', () => {
	it('uses the first letter of the first two names', () => {
		expect(initialsOf('Sam Rivera')).toBe('SR');
		expect(initialsOf('  madonna ')).toBe('M');
		expect(initialsOf('Mary Jane Watson')).toBe('MJ');
	});
});
