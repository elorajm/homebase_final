<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import type { CurrentUser, Household } from '#lib/domain/types';
	import Logo from '#lib/components/Logo.svelte';
	import MobileNav from './MobileNav.svelte';
	import ProfileMenu from './ProfileMenu.svelte';
	import Sidebar from './Sidebar.svelte';

	interface Props {
		currentUser: CurrentUser;
		households: Household[];
		initialHouseholdId: string;
		dataNote: string;
		children: Snippet;
	}

	let { currentUser, households, initialHouseholdId, dataNote, children }: Props = $props();

	// The switcher changes only what the shell displays. Pages keep showing the sample household.
	let activeHouseholdId = $state<string>(untrack(() => initialHouseholdId));
	let mobileOpen = $state(false);
	const currentPath = $derived(page.url.pathname);
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
>
	Skip to main content
</a>

<Sidebar
	{households}
	{activeHouseholdId}
	onSelect={(id: string) => (activeHouseholdId = id)}
	note={dataNote}
	{currentPath}
/>

<MobileNav
	open={mobileOpen}
	onClose={() => (mobileOpen = false)}
	{households}
	{activeHouseholdId}
	onSelect={(id: string) => (activeHouseholdId = id)}
	note={dataNote}
	{currentPath}
/>

<div class="flex min-h-dvh flex-col lg:pl-72">
	<header class="sticky top-0 z-30 border-b border-sage-100 bg-white/95 backdrop-blur">
		<div class="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-2 lg:hidden">
				<button
					type="button"
					aria-controls="mobile-navigation"
					aria-expanded={mobileOpen}
					onclick={() => (mobileOpen = true)}
					class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100"
				>
					<Menu class="h-5 w-5" aria-hidden="true" />
					<span class="sr-only">Open navigation menu</span>
				</button>
				<a href={resolve('/(app)/dashboard')} class="rounded-lg" aria-label="HomeBase dashboard">
					<Logo compact />
				</a>
			</div>
			<p class="hidden text-sm text-stone-600 lg:block">
				Welcome back, {currentUser.displayName.split(' ')[0]}
			</p>
			<ProfileMenu displayName={currentUser.displayName} email={currentUser.email} />
		</div>
	</header>

	<main
		id="main-content"
		tabindex="-1"
		class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8"
	>
		{@render children()}
	</main>

	<footer class="px-4 pb-6 text-center text-xs text-stone-600 sm:px-6">
		HomeBase preview · WDD 430 final project
	</footer>
</div>
