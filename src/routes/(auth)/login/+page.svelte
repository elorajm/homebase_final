<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthCard from '#lib/components/auth/AuthCard.svelte';
	import LoginForm from '#lib/components/auth/LoginForm.svelte';
</script>

<svelte:head>
	<title>Sign in · HomeBase</title>
</svelte:head>

<AuthCard
	title="Sign in to HomeBase"
	description="Welcome back. Enter your email and password to continue."
>
	<LoginForm />

	<p class="mt-6 border-t border-stone-100 pt-6 text-center text-sm text-stone-700">
		New to HomeBase?
		<a href={resolve('/(auth)/register')} class="font-semibold text-mist-800 hover:underline">
			Create an account
		</a>
	</p>
</AuthCard>

<p class="mt-6 text-center text-sm">
	<a href={resolve('/(app)/dashboard')} class="font-medium text-mist-800 hover:underline">
		Browse the sample dashboard without signing in
	</a>
</p>
