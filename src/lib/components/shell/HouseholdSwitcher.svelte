<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import House from '@lucide/svelte/icons/house';
	import type { Household } from '#lib/domain/types';

	interface Props {
		households: Household[];
		activeHouseholdId: string;
		onSelect: (householdId: string) => void;
		/** Keeps element IDs unique when the switcher appears in more than one place. */
		idPrefix: string;
		note: string;
	}

	let { households, activeHouseholdId, onSelect, idPrefix, note }: Props = $props();

	let expanded = $state(false);

	const activeHousehold = $derived(
		households.find((household) => household.id === activeHouseholdId) ?? households[0]
	);

	function choose(householdId: string) {
		onSelect(householdId);
		expanded = false;
	}
</script>

<div class="relative">
	<button
		type="button"
		aria-expanded={expanded}
		aria-controls="{idPrefix}-household-list"
		onclick={() => (expanded = !expanded)}
		class="flex w-full items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-3 py-2.5 text-left transition-colors hover:bg-sage-100"
	>
		<span
			class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-700 text-white"
		>
			<House class="h-4 w-4" aria-hidden="true" />
		</span>
		<span class="min-w-0 flex-1">
			<span class="block text-xs font-medium text-stone-600">Household</span>
			<span class="block truncate text-sm font-semibold text-stone-900">
				{activeHousehold?.name}
			</span>
		</span>
		<ChevronDown
			class="h-4 w-4 shrink-0 text-stone-600 transition-transform {expanded ? 'rotate-180' : ''}"
			aria-hidden="true"
		/>
	</button>

	{#if expanded}
		<div
			id="{idPrefix}-household-list"
			class="mt-2 rounded-xl border border-stone-200 bg-white p-2 shadow-lg"
		>
			<ul class="flex flex-col gap-1">
				{#each households as household (household.id)}
					<li>
						<button
							type="button"
							aria-current={household.id === activeHouseholdId ? 'true' : undefined}
							onclick={() => choose(household.id)}
							class="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-stone-800 hover:bg-stone-100"
						>
							<span class="truncate">{household.name}</span>
							{#if household.id === activeHouseholdId}
								<Check class="h-4 w-4 shrink-0 text-sage-700" aria-hidden="true" />
								<span class="sr-only">(current)</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
			<p class="mt-2 border-t border-stone-100 px-3 pt-2 text-xs text-stone-600">{note}</p>
		</div>
	{/if}
</div>
