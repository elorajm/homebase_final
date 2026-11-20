<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { buttonClass } from '#lib/components/ui/button-styles';
	import { formatDate } from '#lib/domain/format';

	let { data }: PageProps = $props();

	const TIME_ZONES = [
		'America/Denver',
		'America/Chicago',
		'America/New_York',
		'America/Los_Angeles'
	];

	let displayName = $state<string>(untrack(() => data.currentUser.displayName));
	let timeZone = $state<string>(untrack(() => data.currentUser.timeZone));
	let nameError = $state<string | undefined>();
	let saved = $state(false);

	function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		saved = false;
		const trimmed = displayName.trim();
		if (trimmed.length === 0 || trimmed.length > 50) {
			nameError = 'Enter a display name of 1 to 50 characters.';
			return;
		}
		nameError = undefined;
		displayName = trimmed;
		saved = true;
	}
</script>

<svelte:head>
	<title>Profile · HomeBase</title>
</svelte:head>

<PageHeader
	title="Your Profile"
	description="Your name, time zone, and how you appear to the household."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Profile' }]}
/>

<div class="mb-6">
	<PreviewNotice
		message="This is sample data for the interface preview. Changes stay on this screen and are not saved."
	/>
</div>

<div class="grid gap-6 xl:grid-cols-3">
	<Card class="xl:col-span-2" labelledBy="profile-details-heading">
		<div class="flex flex-col gap-5 sm:flex-row sm:items-center">
			<Avatar name={displayName} tone="sage" size="lg" />
			<div class="min-w-0">
				<h2 id="profile-details-heading" class="text-xl font-semibold text-stone-900">
					{displayName}
				</h2>
				<p class="text-sm text-stone-600">
					Member since {formatDate(data.currentUser.memberSince, 'long')}
				</p>
			</div>
		</div>

		<form
			novalidate
			onsubmit={saveProfile}
			class="mt-6 grid gap-5 sm:grid-cols-2"
			aria-describedby="profile-note"
		>
			<div class="sm:col-span-2">
				<FormField
					id="profile-name"
					label="Display name"
					error={nameError}
					hint="This is the name your household sees."
				>
					{#snippet children({ id, describedBy, invalid })}
						<input
							{id}
							type="text"
							bind:value={displayName}
							maxlength="50"
							autocomplete="name"
							aria-describedby={describedBy}
							aria-invalid={invalid}
							class={INPUT_CLASS}
						/>
					{/snippet}
				</FormField>
			</div>

			<FormField
				id="profile-email"
				label="Email address"
				hint="Email changes will be available once sign-in is connected."
			>
				{#snippet children({ id, describedBy })}
					<input
						{id}
						type="email"
						value={data.currentUser.email}
						readonly
						aria-describedby={describedBy}
						class="{INPUT_CLASS} bg-stone-50 text-stone-700"
					/>
				{/snippet}
			</FormField>

			<FormField id="profile-timezone" label="Your time zone">
				{#snippet children({ id, describedBy })}
					<select {id} bind:value={timeZone} aria-describedby={describedBy} class={INPUT_CLASS}>
						{#each TIME_ZONES as zone (zone)}
							<option value={zone}>{zone.replace('_', ' ')}</option>
						{/each}
					</select>
				{/snippet}
			</FormField>

			<div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
				<p id="profile-note" class="text-xs text-stone-600">
					Preview only. Your profile is not saved.
				</p>
				<button type="submit" class={buttonClass('primary')}>Save profile</button>
			</div>

			{#if saved}
				<div class="sm:col-span-2">
					<StatusMessage>Profile updated on this screen. It is not saved.</StatusMessage>
				</div>
			{/if}
		</form>
	</Card>

	<div class="flex flex-col gap-6">
		<Card labelledBy="households-heading">
			<h2 id="households-heading" class="text-lg font-semibold text-stone-900">Your households</h2>
			<ul class="mt-4 flex flex-col gap-3">
				{#each data.households as household (household.id)}
					<li class="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-3">
						<span class="font-medium text-stone-900">{household.name}</span>
						<Badge tone="sage">Admin</Badge>
					</li>
				{/each}
			</ul>
		</Card>

		<Card labelledBy="sign-in-heading">
			<h2 id="sign-in-heading" class="text-lg font-semibold text-stone-900">
				Password and sign-in
			</h2>
			<p class="mt-2 text-sm text-stone-600">
				Password changes and sign-out will be available once sign-in is connected.
			</p>
			<button type="button" disabled class="{buttonClass('secondary')} mt-4 w-full">
				Change password
			</button>
		</Card>
	</div>
</div>
