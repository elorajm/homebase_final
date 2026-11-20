<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Card from '#lib/components/ui/Card.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import StatCard from '#lib/components/ui/StatCard.svelte';
	import CategoryBreakdown from '#lib/components/expenses/CategoryBreakdown.svelte';
	import ExpenseHistory from '#lib/components/expenses/ExpenseHistory.svelte';
	import AddExpenseForm from '#lib/components/expenses/AddExpenseForm.svelte';
	import type { ExpenseDraft } from '#lib/domain/drafts';
	import { monthKey } from '#lib/domain/dates';
	import { formatCurrency, formatMonthTitle } from '#lib/domain/format';
	import { EXPENSE_CATEGORY_LABELS } from '#lib/domain/labels';
	import { categoryTotals, expensesInMonth, totalCents } from '#lib/domain/expenses';
	import type { Expense } from '#lib/domain/types';
	import ReceiptText from '@lucide/svelte/icons/receipt-text';
	import Wallet from '@lucide/svelte/icons/wallet';
	import Tags from '@lucide/svelte/icons/tags';

	let { data }: PageProps = $props();

	let expenses = $state<Expense[]>(untrack(() => data.expenses.map((expense) => ({ ...expense }))));
	let nextPreviewNumber = 1;

	const currencyCode = $derived(data.household.currencyCode);
	const month = $derived(monthKey(data.today));
	const monthTitle = $derived(
		formatMonthTitle(Number(month.slice(0, 4)), Number(month.slice(5, 7)))
	);
	const monthList = $derived(expensesInMonth(expenses, month));
	const total = $derived(totalCents(monthList));
	const totals = $derived(categoryTotals(monthList));
	const largest = $derived(totals[0]);

	function addExpense(draft: ExpenseDraft) {
		expenses = [...expenses, { ...draft, id: `preview-expense-${nextPreviewNumber}` }];
		nextPreviewNumber += 1;
	}
</script>

<svelte:head>
	<title>Expenses · HomeBase</title>
</svelte:head>

<PageHeader
	title="Expenses"
	description="Track shared spending by category. Amounts are shown in {currencyCode}."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Expenses' }]}
/>

<div class="mb-6">
	<PreviewNotice />
</div>

<section aria-labelledby="expense-summary-heading" class="mb-8">
	<h2 id="expense-summary-heading" class="sr-only">Monthly spending summary</h2>
	<div class="grid gap-4 sm:grid-cols-3">
		<StatCard
			label="Spent in {monthTitle}"
			value={formatCurrency(total, currencyCode)}
			hint="{monthList.length} expenses logged"
			icon={Wallet}
		/>
		<StatCard
			label="Expenses logged"
			value={String(monthList.length)}
			hint="Recorded for this month"
			icon={ReceiptText}
			tone="mist"
		/>
		<StatCard
			label="Largest category"
			value={largest ? EXPENSE_CATEGORY_LABELS[largest.category] : 'None yet'}
			hint={largest
				? formatCurrency(largest.totalCents, currencyCode)
				: 'Add an expense to see totals'}
			icon={Tags}
			tone="apricot"
		/>
	</div>
</section>

<div class="grid gap-6 xl:grid-cols-3">
	<div class="flex flex-col gap-6 xl:col-span-2">
		<Card labelledBy="category-heading">
			<h2 id="category-heading" class="mb-5 text-lg font-semibold text-stone-900">
				Category breakdown
			</h2>
			<CategoryBreakdown {totals} overallCents={total} {currencyCode} />
		</Card>

		<Card labelledBy="history-heading">
			<h2 id="history-heading" class="mb-4 text-lg font-semibold text-stone-900">
				Expense history, {monthTitle}
			</h2>
			<ExpenseHistory expenses={monthList} members={data.members} {currencyCode} />
		</Card>
	</div>

	<Card id="add-expense" labelledBy="add-expense-heading">
		<h2 id="add-expense-heading" class="text-lg font-semibold text-stone-900">Log an expense</h2>
		<p class="mt-1 mb-5 text-sm text-stone-600">Record what was paid and who paid it.</p>
		<AddExpenseForm members={data.members} defaultDate={data.today} onAdd={addExpense} />
	</Card>
</div>
