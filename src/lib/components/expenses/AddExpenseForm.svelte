<script lang="ts">
	import type { ExpenseDraft } from '#lib/domain/drafts';
	import { untrack } from 'svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { EXPENSE_CATEGORY_LABELS } from '#lib/domain/labels';
	import type { ExpenseCategory, IsoDate, Member } from '#lib/domain/types';

	interface Props {
		members: Member[];
		defaultDate: IsoDate;
		onAdd: (draft: ExpenseDraft) => void;
	}

	let { members, defaultDate, onAdd }: Props = $props();

	const CATEGORIES: ExpenseCategory[] = [
		'housing',
		'groceries',
		'utilities',
		'transportation',
		'health',
		'entertainment',
		'other'
	];
	const MAX_CENTS = 100_000_000;

	let description = $state('');
	let amountText = $state('');
	let category = $state<ExpenseCategory>('groceries');
	let spentOn = $state<IsoDate>(untrack(() => defaultDate));
	let paidById = $state<string>(untrack(() => members[0]?.id ?? ''));

	let errors = $state<Partial<Record<'description' | 'amount' | 'spentOn', string>>>({});
	let saved = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		saved = false;
		const next: typeof errors = {};
		const trimmed = description.trim();
		const amount = amountText.trim();
		const cents = Math.round(Number(amount) * 100);

		if (trimmed.length === 0) next.description = 'Describe the expense.';
		if (!/^\d+(\.\d{1,2})?$/.test(amount) || cents <= 0 || cents > MAX_CENTS) {
			next.amount = 'Enter an amount greater than zero, with at most two decimal places.';
		}
		if (spentOn === '') next.spentOn = 'Choose the date of the expense.';

		errors = next;
		if (Object.keys(next).length > 0) return;

		onAdd({ description: trimmed, amountCents: cents, category, spentOn, paidById });
		description = '';
		amountText = '';
		saved = true;
	}
</script>

<form
	novalidate
	onsubmit={handleSubmit}
	class="grid gap-5 sm:grid-cols-2"
	aria-describedby="add-expense-note"
>
	<div class="sm:col-span-2">
		<FormField id="expense-description" label="Description" error={errors.description}>
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="text"
					bind:value={description}
					required
					maxlength="200"
					autocomplete="off"
					placeholder="For example, Water bill"
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>
	</div>

	<FormField
		id="expense-amount"
		label="Amount (USD)"
		error={errors.amount}
		hint="For example, 42.50"
	>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="text"
				inputmode="decimal"
				bind:value={amountText}
				required
				autocomplete="off"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="expense-date" label="Date" error={errors.spentOn}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="date"
				bind:value={spentOn}
				required
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="expense-category" label="Category">
		{#snippet children({ id, describedBy })}
			<select {id} bind:value={category} aria-describedby={describedBy} class={INPUT_CLASS}>
				{#each CATEGORIES as option (option)}
					<option value={option}>{EXPENSE_CATEGORY_LABELS[option]}</option>
				{/each}
			</select>
		{/snippet}
	</FormField>

	<FormField id="expense-paid-by" label="Paid by">
		{#snippet children({ id, describedBy })}
			<select {id} bind:value={paidById} aria-describedby={describedBy} class={INPUT_CLASS}>
				{#each members as member (member.id)}
					<option value={member.id}>{member.displayName}</option>
				{/each}
			</select>
		{/snippet}
	</FormField>

	<div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
		<p id="add-expense-note" class="text-xs text-stone-600">
			Preview only. The expense is added to this screen and is not saved.
		</p>
		<button
			type="submit"
			class="inline-flex items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800"
		>
			Add expense
		</button>
	</div>

	{#if saved}
		<div class="sm:col-span-2">
			<StatusMessage>Expense added to this preview. It is not saved.</StatusMessage>
		</div>
	{/if}
</form>
