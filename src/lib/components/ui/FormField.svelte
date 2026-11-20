<script lang="ts" module>
	export interface FieldContext {
		id: string;
		describedBy: string | undefined;
		invalid: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id: string;
		label: string;
		hint?: string;
		error?: string;
		children: Snippet<[FieldContext]>;
	}

	let { id, label, hint, error, children }: Props = $props();

	const hintId = $derived(`${id}-hint`);
	const errorId = $derived(`${id}-error`);
	const describedBy = $derived(
		[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="flex flex-col gap-1.5">
	<label for={id} class="text-sm font-medium text-stone-800">{label}</label>
	{@render children({ id, describedBy, invalid: Boolean(error) })}
	{#if hint}
		<p id={hintId} class="text-xs text-stone-600">{hint}</p>
	{/if}
	{#if error}
		<p id={errorId} class="text-sm font-medium text-apricot-800">{error}</p>
	{/if}
</div>
