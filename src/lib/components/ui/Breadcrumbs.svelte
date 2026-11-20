<script lang="ts" module>
	import type { AppRoute } from '#lib/routes';

	export interface Crumb {
		label: string;
		href?: AppRoute;
	}
</script>

<script lang="ts">
	import { resolve } from '$app/paths';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface Props {
		items: Crumb[];
	}

	let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center gap-1 text-sm text-stone-600">
		{#each items as item, index (item.label)}
			<li class="flex items-center gap-1">
				{#if index > 0}
					<ChevronRight class="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
				{/if}
				{#if item.href && index < items.length - 1}
					<a href={resolve(item.href)} class="rounded-md hover:text-mist-800 hover:underline">
						{item.label}
					</a>
				{:else}
					<span aria-current="page" class="font-medium text-stone-800">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
