<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Household } from '#lib/domain/types';
	import Logo from '#lib/components/Logo.svelte';
	import HouseholdSwitcher from './HouseholdSwitcher.svelte';
	import NavList from './NavList.svelte';

	interface Props {
		households: Household[];
		activeHouseholdId: string;
		onSelect: (householdId: string) => void;
		note: string;
		currentPath: string;
	}

	let { households, activeHouseholdId, onSelect, note, currentPath }: Props = $props();
</script>

<aside
	class="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col border-r border-sage-100 bg-white lg:flex"
	aria-label="Application sidebar"
>
	<div class="flex h-16 items-center border-b border-sage-100 px-6">
		<a href={resolve('/(app)/dashboard')} class="rounded-lg" aria-label="HomeBase dashboard">
			<Logo />
		</a>
	</div>
	<div class="px-4 pt-4">
		<HouseholdSwitcher {households} {activeHouseholdId} {onSelect} idPrefix="sidebar" {note} />
	</div>
	<nav aria-label="Primary" class="flex-1 overflow-y-auto px-3 py-4">
		<NavList {currentPath} />
	</nav>
	<p class="border-t border-sage-100 px-6 py-4 text-xs text-stone-600">
		Preview build. Sample data only, and nothing is saved.
	</p>
</aside>
