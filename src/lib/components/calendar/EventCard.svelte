<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock';
	import { formatDate, formatTime } from '#lib/domain/format';
	import type { CalendarEvent } from '#lib/domain/types';

	interface Props {
		event: CalendarEvent;
	}

	let { event }: Props = $props();

	const timeLabel = $derived(
		event.startTime && event.endTime
			? `${formatTime(event.startTime)} to ${formatTime(event.endTime)}`
			: 'All day'
	);
</script>

<article
	aria-labelledby="event-{event.id}-title"
	class="rounded-2xl border border-mist-100 bg-white p-5 shadow-sm"
>
	<p class="text-xs font-semibold tracking-wide text-mist-800 uppercase">
		{formatDate(event.date, 'long')}
	</p>
	<h3 id="event-{event.id}-title" class="mt-1 text-base font-semibold text-stone-900">
		{event.title}
	</h3>
	<ul class="mt-3 flex flex-col gap-1.5 text-sm text-stone-700">
		<li class="flex items-center gap-2">
			<Clock class="h-4 w-4 shrink-0 text-stone-600" aria-hidden="true" />
			<span>{timeLabel}</span>
		</li>
		{#if event.location}
			<li class="flex items-center gap-2">
				<MapPin class="h-4 w-4 shrink-0 text-stone-600" aria-hidden="true" />
				<span>{event.location}</span>
			</li>
		{/if}
	</ul>
	{#if event.description}
		<p class="mt-3 border-t border-stone-100 pt-3 text-sm text-stone-600">{event.description}</p>
	{/if}
</article>
