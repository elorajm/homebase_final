<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		class?: string;
		labelledBy?: string;
		children: Snippet;
	}

	let { id, class: className = '', labelledBy, children }: Props = $props();
</script>

<section
	{id}
	aria-labelledby={labelledBy}
	class="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm sm:p-6 {className}"
>
	{@render children()}
</section>
