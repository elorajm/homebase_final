<script lang="ts">
	import FormField from '#lib/components/ui/FormField.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { describeAuthResult, AUTH_MESSAGES } from '#lib/auth/messages';
	import { placeholderAuthProvider } from '#lib/auth/provider';
	import type { AuthProvider } from '#lib/auth/types';
	import { validateEmail } from '#lib/auth/validation';

	interface Props {
		provider?: AuthProvider;
	}

	let { provider = placeholderAuthProvider }: Props = $props();

	let email = $state('');
	let error = $state<string | undefined>();
	let notice = $state<string | undefined>();
	let busy = $state(false);

	async function submit() {
		error = validateEmail(email);
		notice = undefined;
		if (error) return;

		busy = true;
		try {
			const result = await provider.requestPasswordReset(email.trim());
			notice = describeAuthResult(result, AUTH_MESSAGES.passwordReset);
		} finally {
			busy = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void submit();
	}
</script>

<form novalidate onsubmit={handleSubmit} class="flex flex-col gap-5" aria-describedby="reset-note">
	<FormField id="reset-email" label="Email address" {error}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="email"
				bind:value={email}
				required
				autocomplete="email"
				placeholder="name@example.com"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<button
		type="submit"
		disabled={busy}
		class="inline-flex w-full items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800 disabled:cursor-not-allowed disabled:opacity-60"
	>
		Reset password
	</button>

	<p id="reset-note" class="text-xs text-stone-600">
		Password reset is not connected in this preview. Nothing you type here is sent or stored.
	</p>

	{#if notice}
		<PreviewNotice message={notice} />
	{/if}
</form>
