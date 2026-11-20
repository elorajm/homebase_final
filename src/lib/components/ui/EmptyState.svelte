<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children?: Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<div
	class="flex flex-col items-center rounded-2xl border border-dashed border-sage-300 bg-sage-50 px-6 py-10 text-center"
>
	<h3 class="text-base font-semibold text-sage-900">{title}</h3>
	<p class="mt-1 max-w-sm text-sm text-stone-600">{description}</p>
	{#if children}
		<div class="mt-4">{@render children()}</div>
	{/if}
</div>
