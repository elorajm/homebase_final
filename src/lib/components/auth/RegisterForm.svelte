<script lang="ts">
	import FormField from '#lib/components/ui/FormField.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { describeAuthResult, AUTH_MESSAGES } from '#lib/auth/messages';
	import { placeholderAuthProvider } from '#lib/auth/provider';
	import type { AuthProvider } from '#lib/auth/types';
	import {
		MIN_PASSWORD_LENGTH,
		validateEmail,
		validateFullName,
		validateNewPassword,
		validatePasswordConfirmation
	} from '#lib/auth/validation';

	interface Props {
		provider?: AuthProvider;
	}

	let { provider = placeholderAuthProvider }: Props = $props();

	type FieldName = 'fullName' | 'email' | 'password' | 'confirmation';
	const FIELD_NAMES: FieldName[] = ['fullName', 'email', 'password', 'confirmation'];

	let fullName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmation = $state('');
	let errors = $state<Partial<Record<FieldName, string>>>({});
	let notice = $state<string | undefined>();
	let busy = $state(false);

	async function submit() {
		const checks: Record<FieldName, string | undefined> = {
			fullName: validateFullName(fullName),
			email: validateEmail(email),
			password: validateNewPassword(password),
			confirmation: validatePasswordConfirmation(password, confirmation)
		};
		const found: Partial<Record<FieldName, string>> = {};
		for (const field of FIELD_NAMES) {
			const message = checks[field];
			if (message) found[field] = message;
		}
		errors = found;
		notice = undefined;
		if (Object.keys(errors).length > 0) return;

		busy = true;
		try {
			const result = await provider.register({
				fullName: fullName.trim(),
				email: email.trim(),
				password
			});
			notice = describeAuthResult(result, AUTH_MESSAGES.register);
		} finally {
			busy = false;
		}
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void submit();
	}
</script>

<form
	novalidate
	onsubmit={handleSubmit}
	class="flex flex-col gap-5"
	aria-describedby="register-note"
>
	<FormField id="register-name" label="Full name" error={errors.fullName}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="text"
				bind:value={fullName}
				required
				maxlength="80"
				autocomplete="name"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="register-email" label="Email address" error={errors.email}>
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

	<FormField
		id="register-password"
		label="Password"
		hint="At least {MIN_PASSWORD_LENGTH} characters."
		error={errors.password}
	>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="password"
				bind:value={password}
				required
				autocomplete="new-password"
				aria-describedby={describedBy}
				aria-invalid={invalid}
				class={INPUT_CLASS}
			/>
		{/snippet}
	</FormField>

	<FormField id="register-confirm" label="Confirm password" error={errors.confirmation}>
		{#snippet children({ id, describedBy, invalid })}
			<input
				{id}
				type="password"
				bind:value={confirmation}
				required
				autocomplete="new-password"
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
		Create account
	</button>

	<p id="register-note" class="text-xs text-stone-600">
		Account creation is not connected in this preview. Nothing you type here is sent or stored.
	</p>

	{#if notice}
		<PreviewNotice message={notice} />
	{/if}
</form>
