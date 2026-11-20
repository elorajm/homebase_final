import type { IsoDate, Task } from './types';

export const TASK_FILTERS = ['all', 'mine', 'upcoming', 'completed'] as const;
export type TaskFilter = (typeof TASK_FILTERS)[number];

export const TASK_FILTER_LABELS: Record<TaskFilter, string> = {
	all: 'All',
	mine: 'Mine',
	upcoming: 'Upcoming',
	completed: 'Completed'
};

/** A task is overdue when it is still open and its due date is before today. */
export function isOverdue(task: Task, today: IsoDate): boolean {
	return !task.completed && task.dueDate < today;
}

/**
 * Selects tasks for a filter.
 * - `mine`: assigned to the current member.
 * - `upcoming`: open and due today or later.
 * - `completed`: marked complete.
 */
export function filterTasks(
	tasks: readonly Task[],
	filter: TaskFilter,
	currentMemberId: string,
	today: IsoDate
): Task[] {
	const selected = tasks.filter((task) => {
		switch (filter) {
			case 'all':
				return true;
			case 'mine':
				return task.assigneeId === currentMemberId;
			case 'upcoming':
				return !task.completed && task.dueDate >= today;
			case 'completed':
				return task.completed;
		}
	});
	return sortByDueDate(selected);
}

/** Sorts tasks by due date, then by title, without changing the input array. */
export function sortByDueDate(tasks: readonly Task[]): Task[] {
	return [...tasks].sort((a, b) => {
		if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
		return a.title.localeCompare(b.title);
	});
}
