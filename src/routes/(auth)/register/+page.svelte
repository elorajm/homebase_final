<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthCard from '#lib/components/auth/AuthCard.svelte';
	import RegisterForm from '#lib/components/auth/RegisterForm.svelte';
</script>

<svelte:head>
	<title>Create an account · HomeBase</title>
</svelte:head>

<AuthCard title="Create your account" description="Set up a HomeBase account for your household.">
	<RegisterForm />

	<p class="mt-6 border-t border-stone-100 pt-6 text-center text-sm text-stone-700">
		Already have an account?
		<a href={resolve('/(auth)/login')} class="font-semibold text-mist-800 hover:underline">
			Sign in
		</a>
	</p>
</AuthCard>
