<script lang="ts">
	import type { PageProps } from './$types';
	import Trophy from '@lucide/svelte/icons/trophy';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import RankCard from '#lib/components/leaderboard/RankCard.svelte';
	import { formatDate } from '#lib/domain/format';
	import { computeLeaderboard, recentCompletions } from '#lib/domain/points';

	let { data }: PageProps = $props();

	const board = $derived(computeLeaderboard(data.members, data.transactions));
	const leader = $derived(board[0]);
	const leaderPoints = $derived(leader?.points ?? 0);
	const memberById = $derived(new Map(data.members.map((member) => [member.id, member])));
	const recent = $derived(recentCompletions(data.transactions, 6));
</script>

<svelte:head>
	<title>Leaderboard · HomeBase</title>
</svelte:head>

<PageHeader
	title="Leaderboard"
	description="Points are earned by completing assigned tasks. Reopened tasks give their points back."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Leaderboard' }]}
/>

{#if leader}
	<section
		aria-labelledby="leader-heading"
		class="mb-8 flex flex-col gap-4 rounded-2xl border border-apricot-200 bg-apricot-50 p-6 sm:flex-row sm:items-center"
	>
		<span
			class="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-apricot-100 text-apricot-800"
		>
			<Trophy class="h-7 w-7" aria-hidden="true" />
		</span>
		<div class="flex min-w-0 flex-1 items-center gap-4">
			<Avatar name={leader.displayName} tone={leader.avatarTone} size="lg" />
			<div class="min-w-0">
				<h2 id="leader-heading" class="text-lg font-semibold text-stone-900">
					In the lead: {leader.displayName}
				</h2>
				<p class="text-sm text-stone-700">{leader.points} points so far this season</p>
			</div>
		</div>
	</section>
{/if}

<section aria-labelledby="ranking-heading" class="mb-8">
	<h2 id="ranking-heading" class="mb-4 text-lg font-semibold text-stone-900">Ranking</h2>
	<ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each board as entry (entry.memberId)}
			<li>
				<RankCard {entry} {leaderPoints} isCurrentUser={entry.memberId === data.currentUser.id} />
			</li>
		{/each}
	</ul>
</section>

<div class="grid gap-6 xl:grid-cols-3">
	<Card class="xl:col-span-2" labelledBy="recent-heading">
		<h2 id="recent-heading" class="mb-4 text-lg font-semibold text-stone-900">
			Recent completed tasks
		</h2>
		{#if recent.length === 0}
			<EmptyState
				title="No completions yet"
				description="Completed tasks will appear here with the points they earned."
			/>
		{:else}
			<ul class="divide-y divide-stone-100">
				{#each recent as transaction (transaction.id)}
					{@const member = memberById.get(transaction.memberId)}
					<li class="flex items-center justify-between gap-4 py-3">
						<div class="flex min-w-0 items-center gap-3">
							{#if member}
								<Avatar name={member.displayName} tone={member.avatarTone} size="sm" />
							{/if}
							<div class="min-w-0">
								<p class="truncate font-medium text-stone-900">{transaction.taskTitle}</p>
								<p class="text-sm text-stone-600">
									{member?.displayName ?? 'Unknown member'}, {formatDate(transaction.occurredOn)}
								</p>
							</div>
						</div>
						<span class="shrink-0 text-sm font-semibold text-sage-800">
							+{transaction.points} pts
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>

	<Card labelledBy="how-heading">
		<h2 id="how-heading" class="mb-4 text-lg font-semibold text-stone-900">How points work</h2>
		<ul class="flex list-disc flex-col gap-3 pl-5 text-sm text-stone-700">
			<li>Completing a task earns its point value for the member it is assigned to.</li>
			<li>Each scheduled occurrence of a repeating task earns points once.</li>
			<li>Reopening a completed task reverses the points it earned.</li>
			<li>Totals are the sum of these entries, so the ranking always matches the history.</li>
		</ul>
	</Card>
</div>
