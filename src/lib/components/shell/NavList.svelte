<script lang="ts">
	import { resolve } from '$app/paths';
	import { NAV_ITEMS, isCurrentPath } from '#lib/navigation';

	interface Props {
		/** Path of the page being viewed. The matching link is marked as the current page. */
		currentPath: string;
		/** Called after a link is chosen, so the mobile drawer can close. */
		onNavigate?: () => void;
	}

	let { currentPath, onNavigate }: Props = $props();
</script>

<ul class="flex flex-col gap-1">
	{#each NAV_ITEMS as item (item.route)}
		{@const current = isCurrentPath(currentPath, item.route)}
		<li>
			<a
				href={resolve(item.route)}
				aria-current={current ? 'page' : undefined}
				onclick={onNavigate}
				class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors {current
					? 'bg-sage-100 text-sage-900'
					: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'}"
			>
				<item.icon
					class="h-5 w-5 shrink-0 {current
						? 'text-sage-700'
						: 'text-stone-500 group-hover:text-stone-700'}"
					aria-hidden="true"
				/>
				<span>{item.label}</span>
			</a>
		</li>
	{/each}
</ul>
