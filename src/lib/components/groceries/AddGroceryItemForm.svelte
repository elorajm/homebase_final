<script lang="ts">
	import type { GroceryCategory } from '#lib/domain/types';
	import type { GroceryDraft } from '#lib/domain/drafts';
	import FormField from '#lib/components/ui/FormField.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { GROCERY_CATEGORY_LABELS } from '#lib/domain/labels';

	interface Props {
		onAdd: (draft: GroceryDraft) => void;
	}

	let { onAdd }: Props = $props();

	const CATEGORIES: GroceryCategory[] = ['produce', 'dairy', 'pantry', 'household', 'frozen'];

	let name = $state('');
	let quantity = $state('');
	let category = $state<GroceryCategory>('pantry');
	let error = $state<string | undefined>();
	let saved = $state(false);

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		saved = false;
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			error = 'Enter an item name.';
			return;
		}
		if (trimmed.length > 120) {
			error = 'Item names can be up to 120 characters.';
			return;
		}
		error = undefined;
		onAdd({ name: trimmed, quantity: quantity.trim(), category });
		name = '';
		quantity = '';
		saved = true;
	}
</script>

<form
	novalidate
	onsubmit={handleSubmit}
	class="grid gap-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
	aria-describedby="add-item-note"
>
	<FormField id="item-name" label="Item name" {error}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="text"
				bind:value={name}
				required
				maxlength="120"
				autocomplete="off"
				placeholder="For example, Tortillas"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="item-quantity" label="Quantity">
		{#snippet children({ id, describedBy })}
			<input
				{id}
				type="text"
				bind:value={quantity}
				maxlength="40"
				placeholder="2 packs"
				aria-describedby={describedBy}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="item-category" label="Category">
		{#snippet children({ id, describedBy })}
			<select {id} bind:value={category} aria-describedby={describedBy} class={INPUT_CLASS}>
				{#each CATEGORIES as option (option)}
					<option value={option}>{GROCERY_CATEGORY_LABELS[option]}</option>
				{/each}
			</select>
		{/snippet}
	</FormField>

	<button
		type="submit"
		class="inline-flex items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800"
	>
		Add item
	</button>

	<p id="add-item-note" class="text-xs text-stone-600 sm:col-span-4">
		Preview only. The item is added to this list on screen and is not saved.
	</p>

	{#if saved}
		<div class="sm:col-span-4">
			<StatusMessage>Item added to this preview. It is not saved.</StatusMessage>
		</div>
	{/if}
</form>
