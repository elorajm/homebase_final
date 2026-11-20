<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children: Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<section class="rounded-2xl border border-sage-100 bg-white p-6 shadow-sm sm:p-8">
	<h1 class="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
	<p class="mt-2 text-sm text-stone-600">{description}</p>
	<div class="mt-6">
		{@render children()}
	</div>
</section>
