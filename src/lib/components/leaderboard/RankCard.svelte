<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import ProgressBar from '#lib/components/ui/ProgressBar.svelte';
	import type { LeaderboardEntry } from '#lib/domain/types';

	interface Props {
		entry: LeaderboardEntry;
		leaderPoints: number;
		isCurrentUser: boolean;
	}

	let { entry, leaderPoints, isCurrentUser }: Props = $props();

	const PLACE_LABELS: Record<number, string> = { 1: '1st place', 2: '2nd place', 3: '3rd place' };
	const share = $derived(leaderPoints <= 0 ? 0 : Math.round((entry.points / leaderPoints) * 100));
</script>

<article
	aria-labelledby="rank-{entry.memberId}-name"
	class="flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm {isCurrentUser
		? 'border-sage-400 ring-1 ring-sage-300'
		: 'border-sage-100'}"
>
	<div class="flex items-center gap-4">
		<span
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-base font-bold text-stone-800"
		>
			<span aria-hidden="true">{entry.rank}</span>
			<span class="sr-only">{PLACE_LABELS[entry.rank] ?? `Rank ${entry.rank}`}</span>
		</span>
		<Avatar name={entry.displayName} tone={entry.avatarTone} size="lg" />
		<div class="min-w-0 flex-1">
			<h3 id="rank-{entry.memberId}-name" class="truncate text-base font-semibold text-stone-900">
				{entry.displayName}
				{#if isCurrentUser}
					<span class="ml-1 text-xs font-medium text-sage-800">(you)</span>
				{/if}
			</h3>
			<p class="text-sm text-stone-600">
				<span class="text-2xl font-semibold text-stone-900">{entry.points}</span> points
			</p>
		</div>
	</div>
	<ProgressBar
		label="Progress toward the leader for {entry.displayName}"
		value={entry.points}
		max={leaderPoints}
		valueText="{entry.points} points, {share} percent of the leader’s total"
		tone={entry.rank === 1 ? 'apricot' : 'sage'}
	/>
</article>
