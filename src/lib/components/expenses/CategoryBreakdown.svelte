<script lang="ts">
	import ProgressBar from '#lib/components/ui/ProgressBar.svelte';
	import { formatCurrency } from '#lib/domain/format';
	import { EXPENSE_CATEGORY_LABELS } from '#lib/domain/labels';
	import type { CategoryTotal } from '#lib/domain/expenses';

	interface Props {
		totals: CategoryTotal[];
		overallCents: number;
		currencyCode: string;
	}

	let { totals, overallCents, currencyCode }: Props = $props();
</script>

{#if totals.length === 0}
	<p class="text-sm text-stone-600">No spending recorded for this month.</p>
{:else}
	<ul class="flex flex-col gap-4">
		{#each totals as total (total.category)}
			{@const label = EXPENSE_CATEGORY_LABELS[total.category]}
			{@const percent = Math.round(total.share * 100)}
			<li class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-3 text-sm">
					<span class="font-medium text-stone-800">{label}</span>
					<span class="text-stone-700">
						{formatCurrency(total.totalCents, currencyCode)}
						<span class="text-stone-600">· {percent}%</span>
					</span>
				</div>
				<ProgressBar
					label="{label} share of spending"
					value={total.totalCents}
					max={overallCents}
					valueText="{percent} percent of this month's spending"
					tone={total.category === 'housing' ? 'mist' : 'sage'}
				/>
			</li>
		{/each}
	</ul>
{/if}
