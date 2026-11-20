<script lang="ts">
	import type { TaskDraft } from '#lib/domain/drafts';
	import FormField from '#lib/components/ui/FormField.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { RECURRENCE_LABELS } from '#lib/domain/labels';
	import { PRIORITY_LABELS } from '#lib/components/ui/tones';
	import type { Member, TaskPriority, TaskRecurrence } from '#lib/domain/types';

	interface Props {
		members: Member[];
		onAdd: (draft: TaskDraft) => void;
	}

	let { members, onAdd }: Props = $props();

	let title = $state('');
	let description = $state('');
	let assigneeId = $state('');
	let dueDate = $state('');
	let priority = $state<TaskPriority>('medium');
	let recurrence = $state<TaskRecurrence>('none');
	let pointsText = $state('5');

	let errors = $state<Partial<Record<'title' | 'dueDate' | 'points', string>>>({});
	let saved = $state(false);

	const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];
	const RECURRENCES: TaskRecurrence[] = ['none', 'daily', 'weekly', 'monthly'];

	function validate(): TaskDraft | null {
		const next: typeof errors = {};
		const trimmedTitle = title.trim();
		const points = Number(pointsText);

		if (trimmedTitle.length === 0) next.title = 'Enter a title for the task.';
		else if (trimmedTitle.length > 120) next.title = 'Titles can be up to 120 characters.';
		if (dueDate === '') next.dueDate = 'Choose a due date.';
		if (pointsText.trim() === '' || !Number.isInteger(points) || points < 0 || points > 100) {
			next.points = 'Enter a whole number of points from 0 to 100.';
		}

		errors = next;
		if (Object.keys(next).length > 0) return null;

		return {
			title: trimmedTitle,
			description: description.trim(),
			assigneeId: assigneeId === '' ? null : assigneeId,
			priority,
			pointsValue: points,
			dueDate,
			recurrence
		};
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const draft = validate();
		saved = false;
		if (!draft) return;
		onAdd(draft);
		title = '';
		description = '';
		assigneeId = '';
		dueDate = '';
		priority = 'medium';
		recurrence = 'none';
		pointsText = '5';
		saved = true;
	}
</script>

<form
	novalidate
	onsubmit={handleSubmit}
	class="grid gap-5 sm:grid-cols-2"
	aria-describedby="add-task-note"
>
	<div class="sm:col-span-2">
		<FormField id="task-title" label="Task title" error={errors.title}>
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="text"
					bind:value={title}
					required
					maxlength="120"
					autocomplete="off"
					placeholder="For example, Vacuum the stairs"
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>
	</div>

	<div class="sm:col-span-2">
		<FormField id="task-description" label="Details (optional)">
			{#snippet children({ id, describedBy })}
				<textarea
					{id}
					bind:value={description}
					rows="3"
					maxlength="2000"
					aria-describedby={describedBy}
					class={INPUT_CLASS}></textarea>
			{/snippet}
		</FormField>
	</div>

	<FormField id="task-assignee" label="Assign to">
		{#snippet children({ id, describedBy })}
			<select {id} bind:value={assigneeId} aria-describedby={describedBy} class={INPUT_CLASS}>
				<option value="">Unassigned</option>
				{#each members as member (member.id)}
					<option value={member.id}>{member.displayName}</option>
				{/each}
			</select>
		{/snippet}
	</FormField>

	<FormField id="task-due" label="Due date" error={errors.dueDate}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="date"
				bind:value={dueDate}
				required
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<fieldset class="flex flex-col gap-2">
		<legend class="text-sm font-medium text-stone-800">Priority</legend>
		<div class="flex flex-wrap gap-2">
			{#each PRIORITIES as option (option)}
				<label
					class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm has-[:checked]:border-sage-700 has-[:checked]:bg-sage-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-mist-300"
				>
					<input
						type="radio"
						name="task-priority"
						value={option}
						bind:group={priority}
						class="text-sage-700 focus:ring-mist-200"
					/>
					{PRIORITY_LABELS[option].replace(' priority', '')}
				</label>
			{/each}
		</div>
	</fieldset>

	<FormField
		id="task-points"
		label="Points"
		hint="Whole number from 0 to 100."
		error={errors.points}
	>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="number"
				min="0"
				max="100"
				step="1"
				inputmode="numeric"
				bind:value={pointsText}
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="task-recurrence" label="Repeats">
		{#snippet children({ id, describedBy })}
			<select {id} bind:value={recurrence} aria-describedby={describedBy} class={INPUT_CLASS}>
				{#each RECURRENCES as option (option)}
					<option value={option}>{RECURRENCE_LABELS[option]}</option>
				{/each}
			</select>
		{/snippet}
	</FormField>

	<div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
		<p id="add-task-note" class="text-xs text-stone-600">
			Preview only. The task is added to this screen and is not saved.
		</p>
		<button
			type="submit"
			class="inline-flex items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800"
		>
			Add task
		</button>
	</div>

	{#if saved}
		<div class="sm:col-span-2">
			<StatusMessage>Task added to this preview. It is not saved.</StatusMessage>
		</div>
	{/if}
</form>
