<script lang="ts">
	import type { Snippet } from 'svelte';
	import Breadcrumbs, { type Crumb } from './Breadcrumbs.svelte';

	interface Props {
		title: string;
		description?: string;
		breadcrumbs?: Crumb[];
		actions?: Snippet;
	}

	let { title, description, breadcrumbs, actions }: Props = $props();
</script>

<header class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
	<div class="min-w-0">
		{#if breadcrumbs && breadcrumbs.length > 0}
			<Breadcrumbs items={breadcrumbs} />
		{/if}
		<h1 class="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
		{#if description}
			<p class="mt-1 max-w-2xl text-sm text-stone-600 sm:text-base">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex shrink-0 flex-wrap gap-2">{@render actions()}</div>
	{/if}
</header>
