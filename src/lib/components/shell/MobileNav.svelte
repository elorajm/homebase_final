<script lang="ts">
	import { untrack } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import type { Household } from '#lib/domain/types';
	import Logo from '#lib/components/Logo.svelte';
	import HouseholdSwitcher from './HouseholdSwitcher.svelte';
	import NavList from './NavList.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		households: Household[];
		activeHouseholdId: string;
		onSelect: (householdId: string) => void;
		note: string;
		currentPath: string;
	}

	let { open, onClose, households, activeHouseholdId, onSelect, note, currentPath }: Props =
		$props();

	const FOCUSABLE =
		'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	let dialog: HTMLElement | undefined = $state();
	let closeButton: HTMLButtonElement | undefined = $state();

	// Move focus into the drawer when it opens, then return it to the control that opened it.
	$effect(() => {
		if (!open) return;
		const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		untrack(() => closeButton)?.focus();
		return () => opener?.focus();
	});

	// Stop the page behind the drawer from scrolling while it is open.
	$effect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			onClose();
			return;
		}
		if (event.key !== 'Tab' || !dialog) return;

		const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
		const first = focusable[0];
		const last = focusable.at(-1);
		if (!first || !last) return;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<button
		type="button"
		tabindex="-1"
		aria-hidden="true"
		class="fixed inset-0 z-40 cursor-default bg-stone-900/40 lg:hidden"
		onclick={onClose}
	></button>

	<div
		bind:this={dialog}
		id="mobile-navigation"
		role="dialog"
		aria-modal="true"
		aria-labelledby="mobile-navigation-title"
		class="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl lg:hidden"
	>
		<div class="flex h-16 items-center justify-between border-b border-sage-100 px-4">
			<h2 id="mobile-navigation-title" class="sr-only">Navigation menu</h2>
			<Logo compact />
			<button
				bind:this={closeButton}
				type="button"
				onclick={onClose}
				class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100"
			>
				<X class="h-5 w-5" aria-hidden="true" />
				<span class="sr-only">Close navigation menu</span>
			</button>
		</div>
		<div class="px-4 pt-4">
			<HouseholdSwitcher {households} {activeHouseholdId} {onSelect} idPrefix="mobile" {note} />
		</div>
		<nav aria-label="Primary" class="flex-1 overflow-y-auto px-3 py-4">
			<NavList {currentPath} onNavigate={onClose} />
		</nav>
	</div>
{/if}
