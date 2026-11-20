<script lang="ts">
	import Logo from '#lib/components/Logo.svelte';
	import type { LayoutProps } from './$types';

	/** Public authentication pages. They use a centered layout without the application sidebar. */
	let { children }: LayoutProps = $props();
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
>
	Skip to main content
</a>

<div class="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
	<div class="mb-8">
		<Logo />
	</div>
	<main id="main-content" tabindex="-1" class="w-full max-w-md focus:outline-none">
		{@render children()}
	</main>
	<footer class="mt-8 text-center text-xs text-stone-600">
		HomeBase preview · WDD 430 final project
	</footer>
</div>
