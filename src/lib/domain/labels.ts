import type {
	ExpenseCategory,
	GroceryCategory,
	HouseholdRole,
	InvitationStatus,
	TaskRecurrence
} from './types';

/** Human-readable labels for enumerated values. Keeping them here keeps wording consistent. */

export const GROCERY_CATEGORY_LABELS: Record<GroceryCategory, string> = {
	produce: 'Produce',
	dairy: 'Dairy & eggs',
	pantry: 'Pantry',
	household: 'Household',
	frozen: 'Frozen'
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
	housing: 'Housing',
	groceries: 'Groceries',
	utilities: 'Utilities',
	transportation: 'Transportation',
	health: 'Health',
	entertainment: 'Entertainment',
	other: 'Other'
};

export const RECURRENCE_LABELS: Record<TaskRecurrence, string> = {
	none: 'One time',
	daily: 'Daily',
	weekly: 'Weekly',
	monthly: 'Monthly'
};

export const ROLE_LABELS: Record<HouseholdRole, string> = {
	admin: 'Admin',
	member: 'Member'
};

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
	active: 'Active',
	expired: 'Expired',
	revoked: 'Revoked',
	exhausted: 'All uses used'
};
