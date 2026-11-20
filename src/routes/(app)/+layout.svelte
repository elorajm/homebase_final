<script lang="ts">
	import AppShell from '#lib/components/shell/AppShell.svelte';
	import type { LayoutProps } from './$types';

	/** The signed-in application shell. Authentication pages live in the (auth) group instead. */
	let { data, children }: LayoutProps = $props();
</script>

<AppShell
	currentUser={data.currentUser}
	households={data.households}
	initialHouseholdId={data.activeHouseholdId}
	dataNote={data.dataNote}
>
	{@render children()}
</AppShell>
