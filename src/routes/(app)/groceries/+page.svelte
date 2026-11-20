<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Card from '#lib/components/ui/Card.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import ProgressBar from '#lib/components/ui/ProgressBar.svelte';
	import GroceryGroup from '#lib/components/groceries/GroceryGroup.svelte';
	import AddGroceryItemForm from '#lib/components/groceries/AddGroceryItemForm.svelte';
	import type { GroceryDraft } from '#lib/domain/drafts';
	import type { GroceryCategory, GroceryItem } from '#lib/domain/types';

	let { data }: PageProps = $props();

	const CATEGORY_ORDER: GroceryCategory[] = ['produce', 'dairy', 'pantry', 'household', 'frozen'];

	let items = $state<GroceryItem[]>(untrack(() => data.items.map((item) => ({ ...item }))));
	let nextPreviewNumber = 1;

	const groups = $derived(
		CATEGORY_ORDER.map((category) => ({
			category,
			items: items.filter((item) => item.category === category)
		})).filter((group) => group.items.length > 0)
	);
	const boughtCount = $derived(items.filter((item) => item.purchased).length);

	function toggleItem(itemId: string) {
		items = items.map((item) =>
			item.id === itemId ? { ...item, purchased: !item.purchased } : item
		);
	}

	function addItem(draft: GroceryDraft) {
		items = [...items, { ...draft, id: `preview-item-${nextPreviewNumber}`, purchased: false }];
		nextPreviewNumber += 1;
	}
</script>

<svelte:head>
	<title>Grocery Lists · HomeBase</title>
</svelte:head>

<PageHeader
	title="Grocery Lists"
	description="Shared shopping for the whole household, grouped by aisle."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Grocery Lists' }]}
/>

<div class="mb-6">
	<PreviewNotice />
</div>

<div class="grid gap-6 lg:grid-cols-5">
	<div class="flex flex-col gap-6 lg:col-span-3">
		<Card labelledBy="list-summary-heading">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 id="list-summary-heading" class="text-lg font-semibold text-stone-900">
						{data.listName}
					</h2>
					<p class="text-sm text-stone-600">{boughtCount} of {items.length} items bought</p>
				</div>
				<div class="w-full sm:w-56">
					<ProgressBar
						label="Items bought in {data.listName}"
						value={boughtCount}
						max={items.length}
						valueText="{boughtCount} of {items.length} items bought"
						tone="mist"
					/>
				</div>
			</div>
		</Card>

		<div class="grid gap-4 md:grid-cols-2">
			{#each groups as group (group.category)}
				<GroceryGroup category={group.category} items={group.items} onToggle={toggleItem} />
			{/each}
		</div>
	</div>

	<Card id="add-item" class="lg:col-span-2" labelledBy="add-item-heading">
		<h2 id="add-item-heading" class="text-lg font-semibold text-stone-900">Add an item</h2>
		<p class="mt-1 mb-5 text-sm text-stone-600">
			Pick a category so the item lands in the right aisle.
		</p>
		<AddGroceryItemForm onAdd={addItem} />
	</Card>
</div>
