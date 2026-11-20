import { describe, expect, it } from 'vitest';
import { SAMPLE_EVENTS, SAMPLE_TASKS } from '#lib/mock/sample-data';
import { eventsOn, tasksDueOn, upcomingEvents } from './calendar';
import { shiftMonth } from './dates';

describe('shiftMonth', () => {
	it('moves forward and backward across year boundaries', () => {
		expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2026, month: 12 });
		expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
		expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
		expect(shiftMonth(2026, 11, 0)).toEqual({ year: 2026, month: 11 });
	});
});

describe('calendar helpers', () => {
	it('returns the events on a date', () => {
		const onDate = eventsOn(SAMPLE_EVENTS, '2026-11-20');

		expect(onDate.map((event) => event.id)).toEqual(['event-conference']);
	});

	it('returns upcoming events from a date, earliest first, up to the limit', () => {
		const upcoming = upcomingEvents(SAMPLE_EVENTS, '2026-11-20', 3);

		expect(upcoming.map((event) => event.id)).toEqual([
			'event-conference',
			'event-soccer',
			'event-dinner'
		]);
	});

	it('returns tasks due on a date with open tasks before completed ones', () => {
		const due = tasksDueOn(SAMPLE_TASKS, '2026-11-20');

		expect(due.map((task) => task.id)).toEqual([
			'task-dishwasher',
			'task-cat',
			'task-plants',
			'task-vacuum'
		]);
		expect(due.at(-1)?.completed).toBe(true);
	});
});
