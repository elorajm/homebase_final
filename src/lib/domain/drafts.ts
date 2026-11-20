import type { CalendarEvent, Expense, GroceryCategory, Task } from './types';

/** Values a form collects before the app assigns an id. */
export type TaskDraft = Omit<Task, 'id' | 'completed'>;
export type EventDraft = Omit<CalendarEvent, 'id'>;
export type ExpenseDraft = Omit<Expense, 'id'>;

export interface GroceryDraft {
	name: string;
	quantity: string;
	category: GroceryCategory;
}
