<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import { formatCurrency, formatDate } from '#lib/domain/format';
	import { EXPENSE_CATEGORY_LABELS } from '#lib/domain/labels';
	import type { Expense, Member } from '#lib/domain/types';

	interface Props {
		expenses: Expense[];
		members: Member[];
		currencyCode: string;
	}

	let { expenses, members, currencyCode }: Props = $props();

	const membersById = $derived(new Map(members.map((member) => [member.id, member])));
</script>

{#if expenses.length === 0}
	<p class="text-sm text-stone-600">No expenses recorded yet.</p>
{:else}
	<div class="overflow-x-auto">
		<table class="w-full min-w-[36rem] text-left text-sm">
			<caption class="sr-only">Expense history, newest first</caption>
			<thead>
				<tr
					class="border-b border-stone-200 text-xs font-semibold tracking-wide text-stone-600 uppercase"
				>
					<th scope="col" class="py-3 pr-4 font-semibold">Date</th>
					<th scope="col" class="py-3 pr-4 font-semibold">Description</th>
					<th scope="col" class="py-3 pr-4 font-semibold">Category</th>
					<th scope="col" class="py-3 pr-4 font-semibold">Paid by</th>
					<th scope="col" class="py-3 text-right font-semibold">Amount</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-stone-100">
				{#each expenses as expense (expense.id)}
					{@const payer = membersById.get(expense.paidById)}
					<tr>
						<td class="py-3 pr-4 whitespace-nowrap text-stone-700">
							{formatDate(expense.spentOn)}
						</td>
						<td class="py-3 pr-4 font-medium text-stone-900">{expense.description}</td>
						<td class="py-3 pr-4">
							<Badge tone="mist">{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
						</td>
						<td class="py-3 pr-4">
							{#if payer}
								<span class="inline-flex items-center gap-2 text-stone-700">
									<Avatar name={payer.displayName} tone={payer.avatarTone} size="sm" />
									{payer.displayName}
								</span>
							{/if}
						</td>
						<td class="py-3 text-right font-semibold whitespace-nowrap text-stone-900 tabular-nums">
							{formatCurrency(expense.amountCents, currencyCode)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
