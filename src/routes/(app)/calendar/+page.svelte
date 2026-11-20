<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Card from '#lib/components/ui/Card.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import MonthCalendar from '#lib/components/calendar/MonthCalendar.svelte';
	import EventCard from '#lib/components/calendar/EventCard.svelte';
	import AddEventForm from '#lib/components/calendar/AddEventForm.svelte';
	import type { EventDraft } from '#lib/domain/drafts';
	import { monthKey, shiftMonth } from '#lib/domain/dates';
	import { eventsOn, tasksDueOn, upcomingEvents } from '#lib/domain/calendar';
	import { formatDate, formatTime } from '#lib/domain/format';
	import type { CalendarEvent, IsoDate } from '#lib/domain/types';

	let { data }: PageProps = $props();

	let events = $state<CalendarEvent[]>(untrack(() => data.events.map((event) => ({ ...event }))));
	let nextPreviewNumber = 1;

	// The view starts on the month that contains today, and moves month by month.
	let view = $state<{ year: number; month: number }>(
		untrack(() => ({
			year: Number(data.today.slice(0, 4)),
			month: Number(data.today.slice(5, 7))
		}))
	);
	let selectedDate = $state<IsoDate>(untrack(() => data.today));

	const viewMonthKey = $derived(`${view.year}-${String(view.month).padStart(2, '0')}`);
	const monthDeadlines = $derived(
		data.tasks.filter((task) => monthKey(task.dueDate) === viewMonthKey)
	);
	const selectedEvents = $derived(eventsOn(events, selectedDate));
	const selectedDeadlines = $derived(tasksDueOn(data.tasks, selectedDate));
	const upcoming = $derived(upcomingEvents(events, data.today, 4));

	function moveMonth(delta: number) {
		const next = shiftMonth(view.year, view.month, delta);
		view = next;
		selectedDate = `${next.year}-${String(next.month).padStart(2, '0')}-01`;
	}

	function addEvent(draft: EventDraft) {
		events = [...events, { ...draft, id: `preview-event-${nextPreviewNumber}` }];
		nextPreviewNumber += 1;
	}
</script>

<svelte:head>
	<title>Calendar · HomeBase</title>
</svelte:head>

<PageHeader
	title="Household Calendar"
	description="Events and task deadlines for everyone in the household."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Calendar' }]}
/>

<div class="mb-6">
	<PreviewNotice />
</div>

<div class="grid gap-6 xl:grid-cols-3">
	<div class="flex flex-col gap-6 xl:col-span-2">
		<Card labelledBy="month-heading">
			<h2 id="month-heading" class="sr-only">Monthly view</h2>
			<MonthCalendar
				year={view.year}
				month={view.month}
				{events}
				deadlines={monthDeadlines}
				today={data.today}
				{selectedDate}
				onSelect={(date: IsoDate) => (selectedDate = date)}
				onPrevious={() => moveMonth(-1)}
				onNext={() => moveMonth(1)}
			/>
		</Card>

		<Card labelledBy="agenda-heading">
			<h2 id="agenda-heading" class="text-lg font-semibold text-stone-900">
				{formatDate(selectedDate, 'long')}
			</h2>
			<div class="mt-4 flex flex-col gap-4">
				{#if selectedEvents.length === 0 && selectedDeadlines.length === 0}
					<EmptyState
						title="Nothing scheduled"
						description="Choose another day, or add an event below."
					/>
				{/if}
				{#if selectedEvents.length > 0}
					<ul class="grid gap-4 md:grid-cols-2">
						{#each selectedEvents as event (event.id)}
							<li><EventCard {event} /></li>
						{/each}
					</ul>
				{/if}
				{#if selectedDeadlines.length > 0}
					<div>
						<h3 class="text-sm font-semibold text-stone-800">Task deadlines</h3>
						<ul class="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-100 bg-white">
							{#each selectedDeadlines as task (task.id)}
								<li class="flex items-center justify-between gap-3 px-4 py-3 text-sm">
									<span
										class="font-medium {task.completed
											? 'text-stone-600 line-through'
											: 'text-stone-900'}"
									>
										{task.title}
									</span>
									<span class="text-stone-600">{task.completed ? 'Done' : 'Due'}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</Card>
	</div>

	<div class="flex flex-col gap-6">
		<Card labelledBy="upcoming-events-heading">
			<h2 id="upcoming-events-heading" class="text-lg font-semibold text-stone-900">
				Upcoming events
			</h2>
			<ul class="mt-4 flex flex-col gap-3">
				{#each upcoming as event (event.id)}
					<li class="rounded-xl bg-mist-50 px-4 py-3">
						<p class="font-medium text-stone-900">{event.title}</p>
						<p class="text-sm text-stone-600">
							{formatDate(event.date)}{#if event.startTime && event.endTime}, {formatTime(
									event.startTime
								)}{:else}, all day{/if}
						</p>
					</li>
				{:else}
					<li class="text-sm text-stone-600">No upcoming events.</li>
				{/each}
			</ul>
			<p class="mt-4 text-xs text-stone-600">Sample events are listed for November 2026.</p>
		</Card>

		<Card id="add-event" labelledBy="add-event-heading">
			<h2 id="add-event-heading" class="text-lg font-semibold text-stone-900">Add an event</h2>
			<p class="mt-1 mb-5 text-sm text-stone-600">
				Add a dentist visit, a game, or a family dinner.
			</p>
			<AddEventForm defaultDate={selectedDate} onAdd={addEvent} />
		</Card>
	</div>
</div>
