<script lang="ts">
	import type { AvatarTone } from '#lib/domain/types';
	import { initialsOf } from '#lib/domain/format';
	import { TONE_CLASSES } from './tones';

	interface Props {
		name: string;
		tone?: AvatarTone;
		size?: 'sm' | 'md' | 'lg';
	}

	let { name, tone = 'sage', size = 'md' }: Props = $props();

	const SIZES = {
		sm: 'h-7 w-7 text-xs',
		md: 'h-9 w-9 text-sm',
		lg: 'h-14 w-14 text-lg'
	};
</script>

<!-- The name is shown next to every avatar, so the initials are decorative. -->
<span
	aria-hidden="true"
	class="inline-flex shrink-0 items-center justify-center rounded-full font-semibold {SIZES[
		size
	]} {TONE_CLASSES[tone]}"
>
	{initialsOf(name)}
</span>
