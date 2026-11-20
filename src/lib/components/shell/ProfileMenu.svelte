<script lang="ts">
	import { resolve } from '$app/paths';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Avatar from '#lib/components/ui/Avatar.svelte';

	interface Props {
		displayName: string;
		email: string;
	}

	let { displayName, email }: Props = $props();

	let open = $state(false);
	let container: HTMLDivElement | undefined = $state();
	let trigger: HTMLButtonElement | undefined = $state();

	function close(returnFocus = false) {
		open = false;
		if (returnFocus) trigger?.focus();
	}

	function handlePointerDown(event: PointerEvent) {
		if (!open || !container) return;
		if (event.target instanceof Node && !container.contains(event.target)) close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') close(true);
	}
</script>

<svelte:window onpointerdown={handlePointerDown} onkeydown={handleKeydown} />

<div class="relative" bind:this={container}>
	<button
		bind:this={trigger}
		type="button"
		aria-haspopup="true"
		aria-expanded={open}
		aria-controls="profile-menu"
		aria-label="Account menu for {displayName}"
		onclick={() => (open = !open)}
		class="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-stone-100"
	>
		<Avatar name={displayName} tone="sage" size="sm" />
		<ChevronDown class="hidden h-4 w-4 text-stone-600 sm:block" aria-hidden="true" />
	</button>

	{#if open}
		<div
			id="profile-menu"
			class="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-stone-200 bg-white p-2 shadow-lg"
		>
			<div class="px-3 py-2">
				<p class="font-semibold text-stone-900">{displayName}</p>
				<p class="text-xs break-all text-stone-600">{email}</p>
			</div>
			<ul class="flex flex-col gap-1 border-t border-stone-100 pt-2">
				<li>
					<a
						href={resolve('/(app)/profile')}
						onclick={() => close()}
						class="block rounded-lg px-3 py-2 text-sm text-stone-800 hover:bg-stone-100"
					>
						Your profile
					</a>
				</li>
				<li>
					<a
						href={resolve('/(app)/household')}
						onclick={() => close()}
						class="block rounded-lg px-3 py-2 text-sm text-stone-800 hover:bg-stone-100"
					>
						Household settings
					</a>
				</li>
			</ul>
			<div class="mt-2 border-t border-stone-100 pt-2">
				<button
					type="button"
					disabled
					class="w-full rounded-lg px-3 py-2 text-left text-sm text-stone-500"
				>
					Sign out
				</button>
				<p class="px-3 pb-1 text-xs text-stone-600">Sign-in is not connected in this preview.</p>
			</div>
		</div>
	{/if}
</div>
