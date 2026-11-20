import { describe, expect, it } from 'vitest';
import { SAMPLE_TASKS, SAMPLE_TODAY } from '#lib/mock/sample-data';
import { filterTasks, isOverdue } from './tasks';

const idsOf = (tasks: { id: string }[]) => tasks.map((task) => task.id);

describe('filterTasks', () => {
	it('returns every task for the all filter', () => {
		expect(filterTasks(SAMPLE_TASKS, 'all', 'member-sam', SAMPLE_TODAY)).toHaveLength(
			SAMPLE_TASKS.length
		);
	});

	it('returns only the current member’s tasks, ordered by due date', () => {
		const mine = filterTasks(SAMPLE_TASKS, 'mine', 'member-sam', SAMPLE_TODAY);

		expect(idsOf(mine)).toEqual(['task-recycling', 'task-meals', 'task-furnace']);
	});

	it('returns open tasks due today or later for upcoming, ordered by date then title', () => {
		const upcoming = filterTasks(SAMPLE_TASKS, 'upcoming', 'member-sam', SAMPLE_TODAY);

		expect(idsOf(upcoming)).toEqual([
			'task-dishwasher',
			'task-cat',
			'task-plants',
			'task-lawn',
			'task-fridge',
			'task-recycling',
			'task-meals',
			'task-furnace'
		]);
	});

	it('returns completed tasks only', () => {
		const completed = filterTasks(SAMPLE_TASKS, 'completed', 'member-sam', SAMPLE_TODAY);

		expect(idsOf(completed)).toEqual(['task-car', 'task-vacuum']);
		expect(completed.every((task) => task.completed)).toBe(true);
	});
});

describe('isOverdue', () => {
	it('flags open tasks whose due date has passed', () => {
		const laundry = SAMPLE_TASKS.find((task) => task.id === 'task-laundry');
		const dishwasher = SAMPLE_TASKS.find((task) => task.id === 'task-dishwasher');
		const car = SAMPLE_TASKS.find((task) => task.id === 'task-car');

		expect(laundry && isOverdue(laundry, SAMPLE_TODAY)).toBe(true);
		expect(dishwasher && isOverdue(dishwasher, SAMPLE_TODAY)).toBe(false);
		expect(car && isOverdue(car, SAMPLE_TODAY)).toBe(false);
	});
});
