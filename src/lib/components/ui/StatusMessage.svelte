<script lang="ts">
	import type { Snippet } from 'svelte';
	import Check from '@lucide/svelte/icons/check';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<p
	role="status"
	class="flex items-start gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm font-medium text-sage-900"
>
	<Check class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
	<span>{@render children()}</span>
</p>
