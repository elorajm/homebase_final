<script lang="ts">
	import { GROCERY_CATEGORY_LABELS } from '#lib/domain/labels';
	import type { GroceryCategory, GroceryItem } from '#lib/domain/types';
	import { CHECKBOX_CLASS } from '#lib/components/ui/form-styles';

	interface Props {
		category: GroceryCategory;
		items: GroceryItem[];
		onToggle: (itemId: string) => void;
	}

	let { category, items, onToggle }: Props = $props();

	const label = $derived(GROCERY_CATEGORY_LABELS[category]);
	const purchasedCount = $derived(items.filter((item) => item.purchased).length);
	const headingId = $derived(`grocery-${category}`);
</script>

<section aria-labelledby={headingId} class="rounded-2xl border border-sage-100 bg-white shadow-sm">
	<div class="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-3">
		<h3 id={headingId} class="text-sm font-semibold tracking-wide text-sage-800 uppercase">
			{label}
		</h3>
		<p class="text-xs font-medium text-stone-600">{purchasedCount} of {items.length} bought</p>
	</div>
	<ul class="divide-y divide-stone-100">
		{#each items as item (item.id)}
			<li class="flex items-center gap-3 px-5 py-3">
				<input
					id="item-{item.id}"
					type="checkbox"
					checked={item.purchased}
					onchange={() => onToggle(item.id)}
					aria-label="Mark {item.name} as {item.purchased ? 'not bought' : 'bought'}"
					class={CHECKBOX_CLASS}
				/>
				<label
					for="item-{item.id}"
					class="flex min-w-0 flex-1 cursor-pointer flex-wrap items-baseline gap-x-2"
				>
					<span
						class="font-medium {item.purchased ? 'text-stone-600 line-through' : 'text-stone-900'}"
					>
						{item.name}
					</span>
					<span class="text-sm text-stone-600">{item.quantity}</span>
				</label>
				<span
					class="shrink-0 text-xs font-medium {item.purchased ? 'text-sage-800' : 'text-stone-500'}"
				>
					{item.purchased ? 'Bought' : 'To buy'}
				</span>
			</li>
		{/each}
	</ul>
</section>
