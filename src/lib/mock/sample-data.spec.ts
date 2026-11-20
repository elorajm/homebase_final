import { describe, expect, it } from 'vitest';
import {
	SAMPLE_CURRENT_USER,
	SAMPLE_EXPENSES,
	SAMPLE_HOUSEHOLDS,
	SAMPLE_MEMBERS,
	SAMPLE_POINT_TRANSACTIONS,
	SAMPLE_TASKS
} from './sample-data';

const memberIds = new Set(SAMPLE_MEMBERS.map((member) => member.id));

describe('sample data integrity', () => {
	it('refers only to members that exist', () => {
		for (const task of SAMPLE_TASKS) {
			expect(task.assigneeId === null || memberIds.has(task.assigneeId)).toBe(true);
		}
		for (const transaction of SAMPLE_POINT_TRANSACTIONS) {
			expect(memberIds.has(transaction.memberId)).toBe(true);
		}
		for (const expense of SAMPLE_EXPENSES) {
			expect(memberIds.has(expense.paidById)).toBe(true);
		}
	});

	it('uses unique identifiers and makes the current user a household admin', () => {
		const householdIds = SAMPLE_HOUSEHOLDS.map((household) => household.id);
		const taskIds = SAMPLE_TASKS.map((task) => task.id);

		expect(new Set(householdIds).size).toBe(householdIds.length);
		expect(new Set(taskIds).size).toBe(taskIds.length);
		expect(SAMPLE_MEMBERS.find((member) => member.id === SAMPLE_CURRENT_USER.id)?.role).toBe(
			'admin'
		);
	});
});
