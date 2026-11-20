<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import { formatDate } from '#lib/domain/format';
	import { isOverdue } from '#lib/domain/tasks';
	import { RECURRENCE_LABELS } from '#lib/domain/labels';
	import { PRIORITY_LABELS } from '#lib/components/ui/tones';
	import type { Member, Task } from '#lib/domain/types';

	interface Props {
		task: Task;
		assignee: Member | undefined;
		today: string;
		onToggle: (taskId: string) => void;
		/** Shows a shorter layout for the dashboard. */
		compact?: boolean;
	}

	let { task, assignee, today, onToggle, compact = false }: Props = $props();

	const overdue = $derived(isOverdue(task, today));
</script>

<article
	aria-labelledby="task-{task.id}-title"
	class="flex items-start gap-4 rounded-2xl border border-sage-100 bg-white p-4 shadow-sm transition-colors {task.completed
		? 'bg-stone-50'
		: ''}"
>
	<input
		id="task-{task.id}-done"
		type="checkbox"
		checked={task.completed}
		onchange={() => onToggle(task.id)}
		aria-label="Mark “{task.title}” as {task.completed ? 'not done' : 'done'}"
		class="mt-1 h-5 w-5 shrink-0 rounded border-stone-400 text-sage-700 focus:ring-2 focus:ring-mist-200"
	/>

	<div class="min-w-0 flex-1">
		<div class="flex flex-wrap items-center gap-2">
			<h3
				id="task-{task.id}-title"
				class="text-base font-semibold text-stone-900 {task.completed
					? 'text-stone-600 line-through'
					: ''}"
			>
				{task.title}
			</h3>
			<Badge priority={task.priority}>
				{PRIORITY_LABELS[task.priority].replace(' priority', '')}
			</Badge>
			{#if overdue}
				<Badge tone="warning">Overdue</Badge>
			{/if}
		</div>

		{#if !compact && task.description}
			<p class="mt-1 text-sm text-stone-600">{task.description}</p>
		{/if}

		<dl class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-700">
			<div class="flex items-center gap-2">
				<dt class="sr-only">Assigned to</dt>
				<dd class="flex items-center gap-2">
					{#if assignee}
						<Avatar name={assignee.displayName} tone={assignee.avatarTone} size="sm" />
						<span>{assignee.displayName}</span>
					{:else}
						<span class="text-stone-600">Unassigned</span>
					{/if}
				</dd>
			</div>
			<div>
				<dt class="inline font-medium text-stone-600">Due</dt>
				<dd class="inline {overdue ? 'font-semibold text-apricot-800' : ''}">
					{formatDate(task.dueDate)}
				</dd>
			</div>
			{#if !compact}
				<div>
					<dt class="inline font-medium text-stone-600">Repeats</dt>
					<dd class="inline">{RECURRENCE_LABELS[task.recurrence]}</dd>
				</div>
			{/if}
			<div>
				<dt class="inline font-medium text-stone-600">Points</dt>
				<dd class="inline font-semibold text-sage-800">{task.pointsValue}</dd>
			</div>
		</dl>
	</div>

	{#if task.completed}
		<span
			class="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-semibold text-sage-800"
		>
			<Check class="h-3.5 w-3.5" aria-hidden="true" />
			Done
		</span>
	{/if}
</article>
