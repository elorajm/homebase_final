import type {
	CalendarEvent,
	CurrentUser,
	Expense,
	GroceryItem,
	Household,
	Invitation,
	Member,
	PointTransaction,
	Task
} from '#lib/domain/types';

/**
 * Sample data for the interface preview. Nothing here is saved anywhere. The
 * dates are fixed so that the views and tests are deterministic.
 */

/** The date the sample data treats as "today". */
export const SAMPLE_TODAY = '2026-11-20';

export const SAMPLE_CURRENT_USER: CurrentUser = {
	id: 'member-sam',
	displayName: 'Sam Rivera',
	email: 'sam.rivera@example.com',
	timeZone: 'America/Denver',
	memberSince: '2026-09-01'
};

export const SAMPLE_ACTIVE_HOUSEHOLD: Household = {
	id: 'household-rivera',
	name: 'Rivera House',
	timeZone: 'America/Denver',
	currencyCode: 'USD'
};

export const SAMPLE_HOUSEHOLDS: Household[] = [
	SAMPLE_ACTIVE_HOUSEHOLD,
	{
		id: 'household-oak',
		name: 'Oak Street Duplex',
		timeZone: 'America/Chicago',
		currencyCode: 'USD'
	}
];

export const SAMPLE_ACTIVE_HOUSEHOLD_ID = 'household-rivera';

export const SAMPLE_MEMBERS: Member[] = [
	{ id: 'member-sam', displayName: 'Sam Rivera', role: 'admin', avatarTone: 'sage' },
	{ id: 'member-alex', displayName: 'Alex Rivera', role: 'member', avatarTone: 'mist' },
	{ id: 'member-jordan', displayName: 'Jordan Rivera', role: 'member', avatarTone: 'apricot' },
	{ id: 'member-riley', displayName: 'Riley Rivera', role: 'member', avatarTone: 'stone' }
];

export const SAMPLE_TASKS: Task[] = [
	{
		id: 'task-dishwasher',
		title: 'Empty the dishwasher',
		description: 'Put clean dishes away and load tonight’s dishes.',
		assigneeId: 'member-jordan',
		priority: 'medium',
		pointsValue: 5,
		dueDate: '2026-11-20',
		recurrence: 'daily',
		completed: false
	},
	{
		id: 'task-recycling',
		title: 'Take out recycling',
		description: 'Bins go to the curb by 7 AM on Mondays.',
		assigneeId: 'member-sam',
		priority: 'high',
		pointsValue: 10,
		dueDate: '2026-11-23',
		recurrence: 'weekly',
		completed: false
	},
	{
		id: 'task-vacuum',
		title: 'Vacuum living room',
		description: '',
		assigneeId: 'member-riley',
		priority: 'low',
		pointsValue: 5,
		dueDate: '2026-11-20',
		recurrence: 'none',
		completed: true
	},
	{
		id: 'task-plants',
		title: 'Water the plants',
		description: 'Kitchen herbs and the front porch planters.',
		assigneeId: 'member-alex',
		priority: 'low',
		pointsValue: 3,
		dueDate: '2026-11-20',
		recurrence: 'weekly',
		completed: false
	},
	{
		id: 'task-furnace',
		title: 'Schedule furnace maintenance',
		description: 'Call the service company and confirm a time window.',
		assigneeId: 'member-sam',
		priority: 'medium',
		pointsValue: 20,
		dueDate: '2026-11-28',
		recurrence: 'none',
		completed: false
	},
	{
		id: 'task-fridge',
		title: 'Clean out the fridge',
		description: 'Check dates and wipe the shelves.',
		assigneeId: 'member-alex',
		priority: 'medium',
		pointsValue: 10,
		dueDate: '2026-11-22',
		recurrence: 'monthly',
		completed: false
	},
	{
		id: 'task-lawn',
		title: 'Mow the lawn',
		description: 'Front and back. Edge along the driveway.',
		assigneeId: 'member-jordan',
		priority: 'medium',
		pointsValue: 15,
		dueDate: '2026-11-21',
		recurrence: 'weekly',
		completed: false
	},
	{
		id: 'task-meals',
		title: 'Plan next week’s meals',
		description: 'Post the list on the fridge by Sunday.',
		assigneeId: 'member-sam',
		priority: 'low',
		pointsValue: 5,
		dueDate: '2026-11-25',
		recurrence: 'weekly',
		completed: false
	},
	{
		id: 'task-cat',
		title: 'Feed the cat',
		description: 'Breakfast and dinner. Refill the water bowl.',
		assigneeId: 'member-riley',
		priority: 'low',
		pointsValue: 2,
		dueDate: '2026-11-20',
		recurrence: 'daily',
		completed: false
	},
	{
		id: 'task-laundry',
		title: 'Sort the laundry',
		description: 'Darks, lights, and towels.',
		assigneeId: 'member-riley',
		priority: 'medium',
		pointsValue: 5,
		dueDate: '2026-11-18',
		recurrence: 'none',
		completed: false
	},
	{
		id: 'task-car',
		title: 'Wash the car',
		description: '',
		assigneeId: 'member-alex',
		priority: 'low',
		pointsValue: 10,
		dueDate: '2026-11-14',
		recurrence: 'none',
		completed: true
	}
];

/** Signed point transactions. The leaderboard totals are derived from these rows. */
export const SAMPLE_POINT_TRANSACTIONS: PointTransaction[] = [
	{
		id: 'pt-01',
		memberId: 'member-alex',
		points: 10,
		taskTitle: 'Wash the car',
		occurredOn: '2026-11-14'
	},
	{
		id: 'pt-02',
		memberId: 'member-riley',
		points: 5,
		taskTitle: 'Vacuum living room',
		occurredOn: '2026-11-20'
	},
	{
		id: 'pt-03',
		memberId: 'member-sam',
		points: 5,
		taskTitle: 'Make breakfast',
		occurredOn: '2026-11-19'
	},
	{
		id: 'pt-04',
		memberId: 'member-jordan',
		points: 15,
		taskTitle: 'Mow the lawn',
		occurredOn: '2026-11-15'
	},
	{
		id: 'pt-05',
		memberId: 'member-alex',
		points: 3,
		taskTitle: 'Water the plants',
		occurredOn: '2026-11-18'
	},
	{
		id: 'pt-06',
		memberId: 'member-riley',
		points: 2,
		taskTitle: 'Feed the cat',
		occurredOn: '2026-11-19'
	},
	{
		id: 'pt-07',
		memberId: 'member-sam',
		points: 10,
		taskTitle: 'Take out recycling',
		occurredOn: '2026-11-16'
	},
	{
		id: 'pt-08',
		memberId: 'member-jordan',
		points: 5,
		taskTitle: 'Empty the dishwasher',
		occurredOn: '2026-11-17'
	},
	{
		id: 'pt-09',
		memberId: 'member-riley',
		points: 5,
		taskTitle: 'Sort the laundry',
		occurredOn: '2026-11-11'
	},
	{
		id: 'pt-10',
		memberId: 'member-riley',
		points: -5,
		taskTitle: 'Sort the laundry (reopened)',
		occurredOn: '2026-11-12'
	},
	{
		id: 'pt-11',
		memberId: 'member-alex',
		points: 10,
		taskTitle: 'Clean out the fridge',
		occurredOn: '2026-11-19'
	}
];

export const SAMPLE_GROCERY_LIST_NAME = 'Weekend shop';

export const SAMPLE_GROCERY_ITEMS: GroceryItem[] = [
	{
		id: 'grocery-spinach',
		name: 'Baby spinach',
		quantity: '1 bag',
		category: 'produce',
		purchased: false
	},
	{ id: 'grocery-bananas', name: 'Bananas', quantity: '6', category: 'produce', purchased: true },
	{ id: 'grocery-lemons', name: 'Lemons', quantity: '3', category: 'produce', purchased: false },
	{
		id: 'grocery-oat-milk',
		name: 'Oat milk',
		quantity: '2 cartons',
		category: 'dairy',
		purchased: false
	},
	{
		id: 'grocery-yogurt',
		name: 'Greek yogurt',
		quantity: '1 tub',
		category: 'dairy',
		purchased: true
	},
	{
		id: 'grocery-cheddar',
		name: 'Cheddar cheese',
		quantity: '1 block',
		category: 'dairy',
		purchased: false
	},
	{
		id: 'grocery-oats',
		name: 'Rolled oats',
		quantity: '1 canister',
		category: 'pantry',
		purchased: false
	},
	{ id: 'grocery-pasta', name: 'Pasta', quantity: '2 boxes', category: 'pantry', purchased: true },
	{
		id: 'grocery-peanut-butter',
		name: 'Peanut butter',
		quantity: '1 jar',
		category: 'pantry',
		purchased: false
	},
	{
		id: 'grocery-dish-soap',
		name: 'Dish soap',
		quantity: '1 bottle',
		category: 'household',
		purchased: false
	},
	{
		id: 'grocery-paper-towels',
		name: 'Paper towels',
		quantity: '2 packs',
		category: 'household',
		purchased: true
	},
	{
		id: 'grocery-peas',
		name: 'Frozen peas',
		quantity: '1 bag',
		category: 'frozen',
		purchased: false
	}
];

export const SAMPLE_EVENTS: CalendarEvent[] = [
	{
		id: 'event-conference',
		title: 'Parent-teacher conference',
		date: '2026-11-20',
		startTime: '16:00',
		endTime: '16:30',
		location: 'Riley’s school library',
		description: 'Bring the reading log.'
	},
	{
		id: 'event-soccer',
		title: 'Soccer practice',
		date: '2026-11-21',
		startTime: '17:30',
		endTime: '19:00',
		location: 'Riverside Park fields',
		description: 'Bring water and shin guards.'
	},
	{
		id: 'event-dinner',
		title: 'Family dinner at Grandma Lou’s',
		date: '2026-11-22',
		startTime: '18:00',
		endTime: '20:30',
		location: 'Grandma Lou’s house',
		description: 'Bring a side dish. Dessert is covered.'
	},
	{
		id: 'event-dentist',
		title: 'Dentist appointment for Jordan',
		date: '2026-11-24',
		startTime: '15:00',
		endTime: '15:45',
		location: 'Maple Dental, Suite 200',
		description: ''
	},
	{
		id: 'event-thanksgiving',
		title: 'Thanksgiving planning',
		date: '2026-11-26',
		startTime: null,
		endTime: null,
		location: '',
		description: 'Decide who hosts and split the grocery list.'
	}
];

export const SAMPLE_EXPENSES: Expense[] = [
	{
		id: 'expense-rent-nov',
		description: 'Rent, November',
		amountCents: 185000,
		category: 'housing',
		spentOn: '2026-11-01',
		paidById: 'member-sam'
	},
	{
		id: 'expense-rent-oct',
		description: 'Rent, October',
		amountCents: 185000,
		category: 'housing',
		spentOn: '2026-10-01',
		paidById: 'member-sam'
	},
	{
		id: 'expense-groceries',
		description: 'Weekly grocery run',
		amountCents: 14286,
		category: 'groceries',
		spentOn: '2026-11-18',
		paidById: 'member-alex'
	},
	{
		id: 'expense-electric',
		description: 'Electric bill',
		amountCents: 9840,
		category: 'utilities',
		spentOn: '2026-11-05',
		paidById: 'member-sam'
	},
	{
		id: 'expense-internet',
		description: 'Internet',
		amountCents: 6499,
		category: 'utilities',
		spentOn: '2026-11-03',
		paidById: 'member-sam'
	},
	{
		id: 'expense-gas',
		description: 'Gas refill',
		amountCents: 5210,
		category: 'transportation',
		spentOn: '2026-11-14',
		paidById: 'member-alex'
	},
	{
		id: 'expense-pharmacy',
		description: 'Pharmacy',
		amountCents: 2385,
		category: 'health',
		spentOn: '2026-11-11',
		paidById: 'member-sam'
	},
	{
		id: 'expense-movies',
		description: 'Movie night rentals',
		amountCents: 1898,
		category: 'entertainment',
		spentOn: '2026-11-08',
		paidById: 'member-jordan'
	},
	{
		id: 'expense-pizza',
		description: 'Pizza night',
		amountCents: 3200,
		category: 'entertainment',
		spentOn: '2026-11-15',
		paidById: 'member-alex'
	},
	{
		id: 'expense-school',
		description: 'School supplies',
		amountCents: 4560,
		category: 'other',
		spentOn: '2026-11-17',
		paidById: 'member-alex'
	}
];

export const SAMPLE_INVITATIONS: Invitation[] = [
	{
		id: 'invitation-1',
		createdOn: '2026-11-18',
		expiresOn: '2026-11-25',
		maxUses: 1,
		useCount: 0,
		revokedOn: null
	},
	{
		id: 'invitation-2',
		createdOn: '2026-11-02',
		expiresOn: '2026-11-09',
		maxUses: 2,
		useCount: 1,
		revokedOn: '2026-11-04'
	},
	{
		id: 'invitation-3',
		createdOn: '2026-11-10',
		expiresOn: '2026-11-27',
		maxUses: 1,
		useCount: 1,
		revokedOn: null
	},
	{
		id: 'invitation-4',
		createdOn: '2026-10-01',
		expiresOn: '2026-10-08',
		maxUses: 1,
		useCount: 0,
		revokedOn: null
	}
];
