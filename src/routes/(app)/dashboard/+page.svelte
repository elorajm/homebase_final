<script lang="ts">
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import Plus from '@lucide/svelte/icons/plus';
	import ShoppingBasket from '@lucide/svelte/icons/shopping-basket';
	import Users from '@lucide/svelte/icons/users';
	import Wallet from '@lucide/svelte/icons/wallet';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import TaskCard from '#lib/components/tasks/TaskCard.svelte';
	import CategoryBreakdown from '#lib/components/expenses/CategoryBreakdown.svelte';
	import { buttonClass } from '#lib/components/ui/button-styles';
	import { monthKey } from '#lib/domain/dates';
	import { formatCurrency, formatDate, formatMonthTitle, formatTime } from '#lib/domain/format';
	import { tasksDueOn, upcomingEvents } from '#lib/domain/calendar';
	import { categoryTotals, expensesInMonth, totalCents } from '#lib/domain/expenses';
	import { computeLeaderboard } from '#lib/domain/points';
	import type { Task } from '#lib/domain/types';

	let { data }: PageProps = $props();

	// Local copies let the dashboard demonstrate completion without saving anything.
	let tasks = $state<Task[]>(untrack(() => data.tasks.map((task) => ({ ...task }))));

	const firstName = $derived(data.currentUser.displayName.split(' ')[0] ?? '');
	const currencyCode = $derived(data.household.currencyCode);
	const memberById = $derived(new Map(data.members.map((member) => [member.id, member])));

	const dueToday = $derived(tasksDueOn(tasks, data.today));
	const openDueToday = $derived(dueToday.filter((task) => !task.completed).length);
	const events = $derived(upcomingEvents(data.events, data.today, 3));
	const toBuy = $derived(data.groceryItems.filter((item) => !item.purchased));
	const monthExpenses = $derived(expensesInMonth(data.expenses, monthKey(data.today)));
	const monthTotal = $derived(totalCents(monthExpenses));
	const topCategories = $derived(categoryTotals(monthExpenses).slice(0, 3));
	const leaderboard = $derived(computeLeaderboard(data.members, data.transactions).slice(0, 3));
	const monthTitle = $derived(
		formatMonthTitle(Number(data.today.slice(0, 4)), Number(data.today.slice(5, 7)))
	);

	function toggleTask(taskId: string) {
		tasks = tasks.map((task) =>
			task.id === taskId ? { ...task, completed: !task.completed } : task
		);
	}
</script>

<svelte:head>
	<title>Dashboard · HomeBase</title>
</svelte:head>

<PageHeader
	title="Welcome back, {firstName}"
	description="Here is what is happening at {data.household.name} today, {formatDate(
		data.today,
		'long'
	)}."
/>

<nav aria-label="Quick actions" class="mb-8 flex flex-wrap gap-2">
	<a href={resolve('/(app)/tasks#add-task')} class={buttonClass('primary')}>
		<Plus class="h-4 w-4" aria-hidden="true" />
		Add a task
	</a>
	<a href={resolve('/(app)/groceries#add-item')} class={buttonClass('secondary')}>
		Add grocery item
	</a>
	<a href={resolve('/(app)/calendar#add-event')} class={buttonClass('secondary')}>Add event</a>
	<a href={resolve('/(app)/expenses#add-expense')} class={buttonClass('secondary')}>
		Log an expense
	</a>
</nav>

<section aria-labelledby="summary-heading" class="mb-8">
	<h2 id="summary-heading" class="sr-only">Household summary</h2>
	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<StatCard
			label="Members"
			value={String(data.members.length)}
			hint={data.household.name}
			icon={Users}
		/>
		<StatCard
			label="Tasks due today"
			value={String(openDueToday)}
			hint="{openDueToday} open of {dueToday.length} due today"
			icon={ListTodo}
			tone="mist"
		/>
		<StatCard
			label="Items to buy"
			value={String(toBuy.length)}
			hint={data.groceryListName}
			icon={ShoppingBasket}
			tone="apricot"
		/>
		<StatCard
			label="Spent this month"
			value={formatCurrency(monthTotal, currencyCode)}
			hint={monthTitle}
			icon={Wallet}
		/>
	</div>
</section>

<div class="grid gap-6 xl:grid-cols-3">
	<Card class="xl:col-span-2" labelledBy="due-today-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="due-today-heading" class="text-lg font-semibold text-stone-900">Tasks due today</h2>
			<a
				href={resolve('/(app)/tasks')}
				class="inline-flex items-center gap-1 text-sm font-medium text-mist-800 hover:underline"
			>
				All tasks
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		{#if dueToday.length === 0}
			<EmptyState
				title="Nothing due today"
				description="Enjoy the quiet day, or add a task for later in the week."
			/>
		{:else}
			<ul class="flex flex-col gap-3">
				{#each dueToday as task (task.id)}
					<li>
						<TaskCard
							{task}
							assignee={memberById.get(task.assigneeId ?? '')}
							today={data.today}
							onToggle={toggleTask}
							compact
						/>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>

	<Card labelledBy="upcoming-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="upcoming-heading" class="text-lg font-semibold text-stone-900">Upcoming events</h2>
			<a
				href={resolve('/(app)/calendar')}
				class="inline-flex items-center gap-1 text-sm font-medium text-mist-800 hover:underline"
			>
				Calendar
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<ul class="divide-y divide-stone-100">
			{#each events as event (event.id)}
				<li class="py-3">
					<p class="font-medium text-stone-900">{event.title}</p>
					<p class="text-sm text-stone-600">
						{formatDate(event.date)}{#if event.startTime && event.endTime}, {formatTime(
								event.startTime
							)} to {formatTime(event.endTime)}{:else}, all day{/if}
					</p>
				</li>
			{/each}
		</ul>
	</Card>

	<Card labelledBy="grocery-preview-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<div>
				<h2 id="grocery-preview-heading" class="text-lg font-semibold text-stone-900">
					Grocery preview
				</h2>
				<p class="text-sm text-stone-600">{data.groceryListName}</p>
			</div>
			<a
				href={resolve('/(app)/groceries')}
				class="inline-flex items-center gap-1 text-sm font-medium text-mist-800 hover:underline"
			>
				Open list
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<ul class="flex flex-col gap-2">
			{#each toBuy.slice(0, 5) as item (item.id)}
				<li class="flex items-center justify-between gap-3 text-sm">
					<span class="font-medium text-stone-900">{item.name}</span>
					<span class="text-stone-600">{item.quantity}</span>
				</li>
			{/each}
		</ul>
		{#if toBuy.length > 5}
			<p class="mt-3 text-sm text-stone-600">and {toBuy.length - 5} more to buy</p>
		{/if}
	</Card>

	<Card labelledBy="expenses-preview-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<div>
				<h2 id="expenses-preview-heading" class="text-lg font-semibold text-stone-900">
					Monthly spending
				</h2>
				<p class="text-sm text-stone-600">{monthTitle}</p>
			</div>
			<a
				href={resolve('/(app)/expenses')}
				class="inline-flex items-center gap-1 text-sm font-medium text-mist-800 hover:underline"
			>
				Details
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<p class="mb-4 text-2xl font-semibold text-stone-900">
			{formatCurrency(monthTotal, currencyCode)}
		</p>
		<CategoryBreakdown totals={topCategories} overallCents={monthTotal} {currencyCode} />
	</Card>

	<Card labelledBy="leaderboard-preview-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="leaderboard-preview-heading" class="text-lg font-semibold text-stone-900">
				Points leaderboard
			</h2>
			<a
				href={resolve('/(app)/leaderboard')}
				class="inline-flex items-center gap-1 text-sm font-medium text-mist-800 hover:underline"
			>
				Full ranking
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<ol class="flex flex-col gap-3">
			{#each leaderboard as entry (entry.memberId)}
				<li class="flex items-center gap-3">
					<span class="w-6 text-sm font-semibold text-stone-600">{entry.rank}.</span>
					<Avatar name={entry.displayName} tone={entry.avatarTone} size="sm" />
					<span class="min-w-0 flex-1 truncate text-sm font-medium text-stone-900">
						{entry.displayName}
					</span>
					<span class="text-sm font-semibold text-sage-800">{entry.points} pts</span>
				</li>
			{/each}
		</ol>
	</Card>
</div>
