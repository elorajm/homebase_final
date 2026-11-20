// Domain types for the HomeBase interface. These mirror the planned database
// design in docs/database.md, using camelCase field names as in docs/api.md.
// Sample data uses these types, and the UI depends only on these types, so the
// data source can change later without rewriting components.

/** Calendar date in `YYYY-MM-DD` form, interpreted in the household's time zone. */
export type IsoDate = string;

export type AvatarTone = 'sage' | 'mist' | 'apricot' | 'stone';
export type HouseholdRole = 'admin' | 'member';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type GroceryCategory = 'produce' | 'dairy' | 'pantry' | 'household' | 'frozen';
export type ExpenseCategory =
	'housing' | 'groceries' | 'utilities' | 'transportation' | 'health' | 'entertainment' | 'other';
export type InvitationStatus = 'active' | 'expired' | 'revoked' | 'exhausted';

export interface Household {
	id: string;
	name: string;
	timeZone: string;
	currencyCode: string;
}

export interface Member {
	id: string;
	displayName: string;
	role: HouseholdRole;
	avatarTone: AvatarTone;
}

export interface CurrentUser {
	id: string;
	displayName: string;
	email: string;
	timeZone: string;
	memberSince: IsoDate;
}

export interface Task {
	id: string;
	title: string;
	description: string;
	assigneeId: string | null;
	priority: TaskPriority;
	pointsValue: number;
	dueDate: IsoDate;
	recurrence: TaskRecurrence;
	completed: boolean;
}

export interface GroceryItem {
	id: string;
	name: string;
	quantity: string;
	category: GroceryCategory;
	purchased: boolean;
}

export interface CalendarEvent {
	id: string;
	title: string;
	date: IsoDate;
	/** `HH:MM` in 24-hour time, or `null` for an all-day event. */
	startTime: string | null;
	/** `HH:MM` in 24-hour time, or `null` for an all-day event. */
	endTime: string | null;
	location: string;
	description: string;
}

export interface Expense {
	id: string;
	description: string;
	amountCents: number;
	category: ExpenseCategory;
	spentOn: IsoDate;
	paidById: string;
}

export interface Invitation {
	id: string;
	createdOn: IsoDate;
	expiresOn: IsoDate;
	maxUses: number;
	useCount: number;
	revokedOn: IsoDate | null;
}

/** A signed point change. Awards are positive; reversals are negative. */
export interface PointTransaction {
	id: string;
	memberId: string;
	points: number;
	taskTitle: string;
	occurredOn: IsoDate;
}

export interface LeaderboardEntry {
	rank: number;
	memberId: string;
	displayName: string;
	avatarTone: AvatarTone;
	points: number;
}
