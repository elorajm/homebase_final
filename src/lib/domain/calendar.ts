import type { CalendarEvent, IsoDate, Task } from './types';

/** Orders events by date, then by start time. All-day events come first on their date. */
export function sortEvents(events: readonly CalendarEvent[]): CalendarEvent[] {
	return [...events].sort((a, b) => {
		if (a.date !== b.date) return a.date < b.date ? -1 : 1;
		const aStart = a.startTime ?? '';
		const bStart = b.startTime ?? '';
		if (aStart === bStart) return a.title.localeCompare(b.title);
		return aStart < bStart ? -1 : 1;
	});
}

/** Returns the events on a single date, in display order. */
export function eventsOn(events: readonly CalendarEvent[], date: IsoDate): CalendarEvent[] {
	return sortEvents(events.filter((event) => event.date === date));
}

/** Returns events on or after `fromDate`, in display order, limited to `limit` entries. */
export function upcomingEvents(
	events: readonly CalendarEvent[],
	fromDate: IsoDate,
	limit: number
): CalendarEvent[] {
	return sortEvents(events.filter((event) => event.date >= fromDate)).slice(0, limit);
}

/** Returns the tasks whose due date is `date`, open tasks first, then by title. */
export function tasksDueOn(tasks: readonly Task[], date: IsoDate): Task[] {
	return tasks
		.filter((task) => task.dueDate === date)
		.sort((a, b) => {
			if (a.completed !== b.completed) return a.completed ? 1 : -1;
			return a.title.localeCompare(b.title);
		});
}
