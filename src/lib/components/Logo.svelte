<script lang="ts">
	interface Props {
		compact?: boolean;
	}

	let { compact = false }: Props = $props();
</script>

<span class="inline-flex items-center gap-2.5">
	<svg
		viewBox="0 0 32 32"
		aria-hidden="true"
		focusable="false"
		class="{compact ? 'h-7 w-7' : 'h-9 w-9'} shrink-0"
	>
		<rect width="32" height="32" rx="9" class="fill-sage-700" />
		<path
			d="M7 15.5 16 8l9 7.5"
			fill="none"
			stroke="#fbfaf7"
			stroke-width="2.4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M10.5 14.5V24h11v-9.5"
			fill="none"
			stroke="#fbfaf7"
			stroke-width="2.4"
			stroke-linejoin="round"
		/>
		<circle cx="21.5" cy="10.5" r="2.2" class="fill-apricot-400" />
	</svg>
	<span class="font-semibold tracking-tight text-stone-900 {compact ? 'text-base' : 'text-lg'}">
		HomeBase
	</span>
</span>
