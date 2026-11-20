<script lang="ts">
	import Info from '@lucide/svelte/icons/info';

	interface Props {
		/** Message shown above forms and interactive views to make clear nothing is saved. */
		message?: string;
	}

	let {
		message = 'This is sample data for the interface preview. Changes stay on this screen and are not saved.'
	}: Props = $props();
</script>

<div
	role="status"
	class="flex items-start gap-3 rounded-xl border border-mist-200 bg-mist-50 px-4 py-3 text-sm text-mist-900"
>
	<Info class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
	<p>{message}</p>
</div>
