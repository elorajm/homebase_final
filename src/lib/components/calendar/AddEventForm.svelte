<script lang="ts">
	import type { EventDraft } from '#lib/domain/drafts';
	import { untrack } from 'svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { CHECKBOX_CLASS, INPUT_CLASS } from '#lib/components/ui/form-styles';
	import type { IsoDate } from '#lib/domain/types';

	interface Props {
		defaultDate: IsoDate;
		onAdd: (draft: EventDraft) => void;
	}

	let { defaultDate, onAdd }: Props = $props();

	let title = $state('');
	let date = $state<IsoDate>(untrack(() => defaultDate));
	let allDay = $state(false);
	let startTime = $state('18:00');
	let endTime = $state('19:00');
	let location = $state('');
	let description = $state('');

	let errors = $state<Partial<Record<'title' | 'date' | 'time', string>>>({});
	let saved = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		saved = false;
		const next: typeof errors = {};
		const trimmedTitle = title.trim();

		if (trimmedTitle.length === 0) next.title = 'Enter a title for the event.';
		if (date === '') next.date = 'Choose a date.';
		if (!allDay && (startTime === '' || endTime === '' || endTime <= startTime)) {
			next.time = 'Choose a start time, and an end time that is after it.';
		}

		errors = next;
		if (Object.keys(next).length > 0) return;

		onAdd({
			title: trimmedTitle,
			date,
			startTime: allDay ? null : startTime,
			endTime: allDay ? null : endTime,
			location: location.trim(),
			description: description.trim()
		});
		title = '';
		location = '';
		description = '';
		saved = true;
	}
</script>

<form
	novalidate
	onsubmit={handleSubmit}
	class="grid gap-5 sm:grid-cols-2"
	aria-describedby="add-event-note"
>
	<div class="sm:col-span-2">
		<FormField id="event-title" label="Event title" error={errors.title}>
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="text"
					bind:value={title}
					required
					maxlength="120"
					autocomplete="off"
					placeholder="For example, Piano lesson"
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>
	</div>

	<FormField id="event-date" label="Date" error={errors.date}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="date"
				bind:value={date}
				required
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<div class="flex items-end">
		<label class="inline-flex items-center gap-2 text-sm font-medium text-stone-800">
			<input type="checkbox" bind:checked={allDay} class={CHECKBOX_CLASS} />
			All-day event
		</label>
	</div>

	{#if !allDay}
		<FormField id="event-start" label="Starts" error={errors.time}>
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="time"
					bind:value={startTime}
					required
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>

		<FormField id="event-end" label="Ends">
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="time"
					bind:value={endTime}
					required
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>
	{/if}
	{#if errors.time}
		<p class="text-sm font-medium text-apricot-800 sm:col-span-2" role="alert">{errors.time}</p>
	{/if}

	<FormField id="event-location" label="Location (optional)">
		{#snippet children({ id, describedBy })}
			<input
				{id}
				type="text"
				bind:value={location}
				maxlength="120"
				aria-describedby={describedBy}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="event-description" label="Notes (optional)">
		{#snippet children({ id, describedBy })}
			<input
				{id}
				type="text"
				bind:value={description}
				maxlength="2000"
				aria-describedby={describedBy}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
		<p id="add-event-note" class="text-xs text-stone-600">
			Preview only. The event is shown on this screen and is not saved.
		</p>
		<button
			type="submit"
			class="inline-flex items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800"
		>
			Add event
		</button>
	</div>

	{#if saved}
		<div class="sm:col-span-2">
			<StatusMessage>Event added to this preview. It is not saved.</StatusMessage>
		</div>
	{/if}
</form>
