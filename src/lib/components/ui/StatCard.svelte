<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		label: string;
		value: string;
		hint: string;
		icon?: Component;
		tone?: 'sage' | 'mist' | 'apricot';
	}

	let { label, value, hint, icon: Icon, tone = 'sage' }: Props = $props();

	const ICON_TONES = {
		sage: 'bg-sage-100 text-sage-800',
		mist: 'bg-mist-100 text-mist-800',
		apricot: 'bg-apricot-100 text-apricot-800'
	};
</script>

<div class="flex items-start gap-4 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
	{#if Icon}
		<span
			class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl {ICON_TONES[
				tone
			]}"
		>
			<Icon class="h-5 w-5" aria-hidden="true" />
		</span>
	{/if}
	<div class="min-w-0">
		<p class="text-sm font-medium text-stone-600">{label}</p>
		<p class="mt-0.5 text-2xl font-semibold text-stone-900">{value}</p>
		<p class="mt-0.5 text-xs text-stone-600">{hint}</p>
	</div>
</div>
