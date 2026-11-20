import { describe, expect, it } from 'vitest';
import { SAMPLE_EXPENSES } from '#lib/mock/sample-data';
import { categoryTotals, expensesInMonth, totalCents } from './expenses';

describe('expense summaries', () => {
	const november = expensesInMonth(SAMPLE_EXPENSES, '2026-11');

	it('keeps only the requested month, newest first', () => {
		expect(november).toHaveLength(9);
		expect(november[0]?.id).toBe('expense-groceries');
	});

	it('totals the month in integer cents', () => {
		expect(totalCents(november)).toBe(232878);
	});

	it('orders categories by total and shares sum to one', () => {
		const totals = categoryTotals(november);

		expect(totals.map((total) => total.category)).toEqual([
			'housing',
			'utilities',
			'groceries',
			'transportation',
			'entertainment',
			'other',
			'health'
		]);
		const shares = totals.reduce((sum, total) => sum + total.share, 0);
		expect(shares).toBeCloseTo(1, 10);
	});

	it('returns no categories and zero totals when there are no expenses', () => {
		expect(categoryTotals([])).toEqual([]);
		expect(totalCents([])).toBe(0);
	});
});
