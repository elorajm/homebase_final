<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Card from '#lib/components/ui/Card.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import TaskCard from '#lib/components/tasks/TaskCard.svelte';
	import TaskFilterBar from '#lib/components/tasks/TaskFilterBar.svelte';
	import AddTaskForm from '#lib/components/tasks/AddTaskForm.svelte';
	import type { TaskDraft } from '#lib/domain/drafts';
	import { filterTasks, type TaskFilter } from '#lib/domain/tasks';
	import type { Task } from '#lib/domain/types';

	let { data }: PageProps = $props();

	let tasks = $state<Task[]>(untrack(() => data.tasks.map((task) => ({ ...task }))));
	let filter = $state<TaskFilter>('all');
	let nextPreviewNumber = 1;

	const memberById = $derived(new Map(data.members.map((member) => [member.id, member])));
	const visibleTasks = $derived(filterTasks(tasks, filter, data.currentUser.id, data.today));
	const counts = $derived({
		all: filterTasks(tasks, 'all', data.currentUser.id, data.today).length,
		mine: filterTasks(tasks, 'mine', data.currentUser.id, data.today).length,
		upcoming: filterTasks(tasks, 'upcoming', data.currentUser.id, data.today).length,
		completed: filterTasks(tasks, 'completed', data.currentUser.id, data.today).length
	} satisfies Record<TaskFilter, number>);

	const emptyCopy: Record<TaskFilter, { title: string; description: string }> = {
		all: {
			title: 'No tasks yet',
			description: 'Add the first chore to get the household started.'
		},
		mine: {
			title: 'Nothing assigned to you',
			description: 'Tasks assigned to you will appear here.'
		},
		upcoming: { title: 'No upcoming tasks', description: 'Everything open has been handled.' },
		completed: {
			title: 'No completed tasks',
			description: 'Completed tasks appear here once they are checked off.'
		}
	};

	function toggleTask(taskId: string) {
		tasks = tasks.map((task) =>
			task.id === taskId ? { ...task, completed: !task.completed } : task
		);
	}

	function addTask(draft: TaskDraft) {
		tasks = [...tasks, { ...draft, id: `preview-task-${nextPreviewNumber}`, completed: false }];
		nextPreviewNumber += 1;
	}
</script>

<svelte:head>
	<title>Tasks &amp; Chores · HomeBase</title>
</svelte:head>

<PageHeader
	title="Tasks &amp; Chores"
	description="Assign chores, set due dates, and track points. Completing an assigned task earns its points."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Tasks & Chores' }]}
/>

<div class="mb-6">
	<PreviewNotice />
</div>

<div class="grid gap-6 lg:grid-cols-5">
	<section aria-labelledby="task-list-heading" class="flex flex-col gap-4 lg:col-span-3">
		<div class="flex flex-col gap-3">
			<h2 id="task-list-heading" class="text-lg font-semibold text-stone-900">Household tasks</h2>
			<TaskFilterBar {filter} {counts} onChange={(next: TaskFilter) => (filter = next)} />
		</div>

		{#if visibleTasks.length === 0}
			<EmptyState title={emptyCopy[filter].title} description={emptyCopy[filter].description} />
		{:else}
			<ul class="flex flex-col gap-3" aria-label="Tasks, sorted by due date">
				{#each visibleTasks as task (task.id)}
					<li>
						<TaskCard
							{task}
							assignee={memberById.get(task.assigneeId ?? '')}
							today={data.today}
							onToggle={toggleTask}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<Card id="add-task" class="lg:col-span-2" labelledBy="add-task-heading">
		<h2 id="add-task-heading" class="text-lg font-semibold text-stone-900">Add a task</h2>
		<p class="mt-1 mb-5 text-sm text-stone-600">
			Choose who it is for, when it is due, and how many points it is worth.
		</p>
		<AddTaskForm members={data.members} onAdd={addTask} />
	</Card>
</div>
