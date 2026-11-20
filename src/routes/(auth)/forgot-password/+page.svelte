<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthCard from '#lib/components/auth/AuthCard.svelte';
	import ForgotPasswordForm from '#lib/components/auth/ForgotPasswordForm.svelte';
</script>

<svelte:head>
	<title>Reset your password · HomeBase</title>
</svelte:head>

<AuthCard
	title="Reset your password"
	description="Enter the email address for your account, and we will send a reset link when this feature is connected."
>
	<ForgotPasswordForm />

	<p class="mt-6 border-t border-stone-100 pt-6 text-center text-sm text-stone-700">
		Remembered it?
		<a href={resolve('/(auth)/login')} class="font-semibold text-mist-800 hover:underline">
			Back to sign in
		</a>
	</p>
</AuthCard>
