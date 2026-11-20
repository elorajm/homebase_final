import type { Expense, ExpenseCategory } from './types';
import { monthKey } from './dates';

export interface CategoryTotal {
	category: ExpenseCategory;
	totalCents: number;
	/** Share of the month's total, from 0 to 1. */
	share: number;
}

/** Returns the expenses whose date falls in `month`, given as `YYYY-MM`, newest first. */
export function expensesInMonth(expenses: readonly Expense[], month: string): Expense[] {
	return expenses
		.filter((expense) => monthKey(expense.spentOn) === month)
		.sort((a, b) => (a.spentOn === b.spentOn ? 0 : a.spentOn < b.spentOn ? 1 : -1));
}

export function totalCents(expenses: readonly Expense[]): number {
	return expenses.reduce((sum, expense) => sum + expense.amountCents, 0);
}

/** Totals expenses by category, largest first. Shares sum to 1 when the total is above zero. */
export function categoryTotals(expenses: readonly Expense[]): CategoryTotal[] {
	const totals = new Map<ExpenseCategory, number>();
	for (const expense of expenses) {
		totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amountCents);
	}
	const overall = totalCents(expenses);
	return [...totals.entries()]
		.map(([category, total]) => ({
			category,
			totalCents: total,
			share: overall === 0 ? 0 : total / overall
		}))
		.sort((a, b) => b.totalCents - a.totalCents || a.category.localeCompare(b.category));
}
