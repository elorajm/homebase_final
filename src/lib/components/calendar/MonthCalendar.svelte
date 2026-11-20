<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { buildMonthGrid } from '#lib/domain/dates';
	import { formatDate, formatMonthTitle } from '#lib/domain/format';
	import type { CalendarEvent, IsoDate, Task } from '#lib/domain/types';

	interface Props {
		year: number;
		month: number;
		events: CalendarEvent[];
		deadlines: Task[];
		today: IsoDate;
		selectedDate: IsoDate;
		onSelect: (date: IsoDate) => void;
		onPrevious: () => void;
		onNext: () => void;
	}

	let { year, month, events, deadlines, today, selectedDate, onSelect, onPrevious, onNext }: Props =
		$props();

	const WEEKDAYS = [
		{ short: 'Sun', full: 'Sunday' },
		{ short: 'Mon', full: 'Monday' },
		{ short: 'Tue', full: 'Tuesday' },
		{ short: 'Wed', full: 'Wednesday' },
		{ short: 'Thu', full: 'Thursday' },
		{ short: 'Fri', full: 'Friday' },
		{ short: 'Sat', full: 'Saturday' }
	];

	const weeks = $derived(buildMonthGrid(year, month));
	const title = $derived(formatMonthTitle(year, month));

	function describe(date: IsoDate, eventCount: number, deadlineCount: number): string {
		const parts = [formatDate(date, 'long')];
		if (eventCount > 0) parts.push(`${eventCount} ${eventCount === 1 ? 'event' : 'events'}`);
		if (deadlineCount > 0)
			parts.push(`${deadlineCount} task ${deadlineCount === 1 ? 'deadline' : 'deadlines'}`);
		return parts.join(', ');
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center justify-between gap-3">
		<h2 class="text-lg font-semibold text-stone-900" id="calendar-month-title">{title}</h2>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={onPrevious}
				class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
			>
				<ChevronLeft class="h-4 w-4" aria-hidden="true" />
				<span class="sr-only">Previous month</span>
			</button>
			<button
				type="button"
				onclick={onNext}
				class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
			>
				<ChevronRight class="h-4 w-4" aria-hidden="true" />
				<span class="sr-only">Next month</span>
			</button>
		</div>
	</div>

	<table
		class="w-full table-fixed border-separate border-spacing-1"
		aria-labelledby="calendar-month-title"
	>
		<thead>
			<tr>
				{#each WEEKDAYS as day (day.short)}
					<th scope="col" class="pb-1 text-center text-xs font-semibold text-stone-600">
						<abbr title={day.full} class="no-underline">{day.short}</abbr>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each weeks as week, weekIndex (weekIndex)}
				<tr>
					{#each week as day (day.date)}
						{@const eventCount = events.filter((event) => event.date === day.date).length}
						{@const deadlineCount = deadlines.filter((task) => task.dueDate === day.date).length}
						<td class="p-0 align-top">
							<button
								type="button"
								aria-pressed={selectedDate === day.date}
								aria-label={describe(day.date, eventCount, deadlineCount)}
								onclick={() => onSelect(day.date)}
								class="flex h-16 w-full flex-col items-start gap-1 rounded-xl p-1.5 text-left transition-colors sm:h-20 {day.inMonth
									? 'bg-white text-stone-900 hover:bg-sage-50'
									: 'bg-stone-50 text-stone-500 hover:bg-stone-100'} {selectedDate === day.date
									? 'ring-2 ring-sage-700'
									: 'ring-1 ring-stone-100'}"
							>
								<span
									class="inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold {day.date ===
									today
										? 'bg-sage-700 text-white'
										: ''}"
								>
									{Number(day.date.slice(8))}
								</span>
								<span class="mt-auto flex flex-wrap gap-1" aria-hidden="true">
									{#each [...Array(Math.min(eventCount, 3)).keys()] as dot (dot)}
										<span class="h-1.5 w-1.5 rounded-full bg-mist-600"></span>
									{/each}
									{#each [...Array(Math.min(deadlineCount, 3)).keys()] as dot (dot)}
										<span class="h-1.5 w-1.5 rounded-full bg-apricot-500"></span>
									{/each}
								</span>
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<p class="flex flex-wrap items-center gap-4 text-xs text-stone-600">
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2 w-2 rounded-full bg-mist-600" aria-hidden="true"></span>Household event
		</span>
		<span class="inline-flex items-center gap-1.5">
			<span class="h-2 w-2 rounded-full bg-apricot-500" aria-hidden="true"></span>Task deadline
		</span>
	</p>
</div>
