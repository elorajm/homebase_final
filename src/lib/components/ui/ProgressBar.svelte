<script lang="ts">
	interface Props {
		label: string;
		value: number;
		max: number;
		/** Text used for screen readers, such as "Alex has 23 of 23 points". */
		valueText: string;
		tone?: 'sage' | 'mist' | 'apricot';
	}

	let { label, value, max, valueText, tone = 'sage' }: Props = $props();

	const percent = $derived(max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100)));

	const FILLS = {
		sage: 'bg-sage-500',
		mist: 'bg-mist-500',
		apricot: 'bg-apricot-500'
	};
</script>

<div
	role="progressbar"
	aria-label={label}
	aria-valuemin="0"
	aria-valuemax={max}
	aria-valuenow={value}
	aria-valuetext={valueText}
	class="h-2.5 w-full overflow-hidden rounded-full bg-stone-200"
>
	<div class="h-full rounded-full transition-[width] {FILLS[tone]}" style="width: {percent}%"></div>
</div>
