<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AvatarTone, TaskPriority } from '#lib/domain/types';
	import { PRIORITY_CLASSES } from './tones';

	type Tone = AvatarTone | 'neutral' | 'warning' | 'success';

	interface Props {
		tone?: Tone;
		/** Overrides the default tone colors, used for task priority badges. */
		priority?: TaskPriority;
		children: Snippet;
	}

	let { tone = 'neutral', priority, children }: Props = $props();

	const TONES: Record<Tone, string> = {
		sage: 'bg-sage-100 text-sage-800 ring-sage-300',
		mist: 'bg-mist-100 text-mist-800 ring-mist-300',
		apricot: 'bg-apricot-100 text-apricot-800 ring-apricot-300',
		stone: 'bg-stone-100 text-stone-800 ring-stone-300',
		neutral: 'bg-stone-100 text-stone-700 ring-stone-300',
		warning: 'bg-apricot-100 text-apricot-800 ring-apricot-300',
		success: 'bg-sage-100 text-sage-800 ring-sage-300'
	};

	const classes = $derived(priority ? PRIORITY_CLASSES[priority] : TONES[tone]);
</script>

<span
	class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset {classes}"
>
	{@render children()}
</span>
