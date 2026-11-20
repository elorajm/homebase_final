<script lang="ts">
	import { resolve } from '$app/paths';
	import FormField from '#lib/components/ui/FormField.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { describeAuthResult, AUTH_MESSAGES } from '#lib/auth/messages';
	import { placeholderAuthProvider } from '#lib/auth/provider';
	import type { AuthProvider } from '#lib/auth/types';
	import { validateEmail, validateSignInPassword } from '#lib/auth/validation';

	interface Props {
		/** Replaceable so the Supabase provider can be injected without changing this form. */
		provider?: AuthProvider;
	}

	let { provider = placeholderAuthProvider }: Props = $props();

	let email = $state('');
	let password = $state('');
	let errors = $state<{ email?: string; password?: string }>({});
	let notice = $state<string | undefined>();
	let busy = $state(false);

	async function submit() {
		const next = {
			email: validateEmail(email),
			password: validateSignInPassword(password)
		};
		errors = next;
		notice = undefined;
		if (next.email || next.password) return;

		busy = true;
		try {
			const result = await provider.signIn({ email: email.trim(), password });
			notice = describeAuthResult(result, AUTH_MESSAGES.signIn);
		} finally {
			busy = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void submit();
	}
</script>

<form novalidate onsubmit={handleSubmit} class="flex flex-col gap-5" aria-describedby="login-note">
	<FormField id="login-email" label="Email address" error={errors.email}>
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

	<FormField id="login-password" label="Password" error={errors.password}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="password"
				bind:value={password}
				required
				autocomplete="current-password"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<div class="-mt-2 flex justify-end">
		<a
			href={resolve('/(auth)/forgot-password')}
			class="text-sm font-medium text-mist-800 hover:underline"
		>
			Forgot password?
		</a>
	</div>

	<button
		type="submit"
		disabled={busy}
		class="inline-flex w-full items-center justify-center rounded-xl bg-sage-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sage-800 disabled:cursor-not-allowed disabled:opacity-60"
	>
		Sign in
	</button>

	<p id="login-note" class="text-xs text-stone-600">
		Authentication is not connected in this preview. Nothing you type here is sent or stored.
	</p>

	{#if notice}
		<PreviewNotice message={notice} />
	{/if}
</form>
