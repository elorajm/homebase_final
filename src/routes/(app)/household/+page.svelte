<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';
	import Card from '#lib/components/ui/Card.svelte';
	import FormField from '#lib/components/ui/FormField.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PreviewNotice from '#lib/components/ui/PreviewNotice.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { buttonClass } from '#lib/components/ui/button-styles';
	import MemberList from '#lib/components/household/MemberList.svelte';
	import InvitationPanel from '#lib/components/household/InvitationPanel.svelte';
	import type { Invitation } from '#lib/domain/types';

	let { data }: PageProps = $props();

	const TIME_ZONES = [
		'America/Denver',
		'America/Chicago',
		'America/New_York',
		'America/Los_Angeles'
	];
	const CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP'];

	const isAdmin = $derived(
		data.members.find((member) => member.id === data.currentUser.id)?.role === 'admin'
	);

	let householdName = $state<string>(untrack(() => data.household.name));
	let timeZone = $state<string>(untrack(() => data.household.timeZone));
	let currencyCode = $state<string>(untrack(() => data.household.currencyCode));
	let nameError = $state<string | undefined>();
	let saved = $state(false);

	let invitations = $state<Invitation[]>(
		untrack(() => data.invitations.map((invitation) => ({ ...invitation })))
	);

	function saveDetails(event: SubmitEvent) {
		event.preventDefault();
		saved = false;
		const trimmed = householdName.trim();
		if (trimmed.length === 0 || trimmed.length > 80) {
			nameError = 'Enter a household name of 1 to 80 characters.';
			return;
		}
		nameError = undefined;
		householdName = trimmed;
		saved = true;
	}

	function revokeInvitation(invitationId: string) {
		invitations = invitations.map((invitation) =>
			invitation.id === invitationId ? { ...invitation, revokedOn: data.today } : invitation
		);
	}
</script>

<svelte:head>
	<title>Household Settings · HomeBase</title>
</svelte:head>

<PageHeader
	title="Household Settings"
	description="Manage the household name, its members, and invitation codes."
	breadcrumbs={[{ label: 'Home', href: '/(app)/dashboard' }, { label: 'Household Settings' }]}
/>

<div class="mb-6">
	<PreviewNotice
		message="This is sample data for the interface preview. Changes stay on this screen and are not saved."
	/>
</div>

{#if !isAdmin}
	<p class="mb-6 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
		Only household admins can change these settings. Members can view them.
	</p>
{/if}

<div class="grid gap-6 xl:grid-cols-2">
	<Card labelledBy="details-heading">
		<h2 id="details-heading" class="text-lg font-semibold text-stone-900">Household details</h2>
		<form
			novalidate
			onsubmit={saveDetails}
			class="mt-5 grid gap-5 sm:grid-cols-2"
			aria-describedby="details-note"
		>
			<div class="sm:col-span-2">
				<FormField id="household-name" label="Household name" error={nameError}>
					{#snippet children({ id, describedBy, invalid })}
						<input
							{id}
							type="text"
							bind:value={householdName}
							maxlength="80"
							disabled={!isAdmin}
							aria-describedby={describedBy}
							aria-invalid={invalid}
							class={INPUT_CLASS}
						/>
					{/snippet}
				</FormField>
			</div>

			<FormField
				id="household-timezone"
				label="Time zone"
				hint="Used for due dates and the calendar."
			>
				{#snippet children({ id, describedBy })}
					<select
						{id}
						bind:value={timeZone}
						disabled={!isAdmin}
						aria-describedby={describedBy}
						class={INPUT_CLASS}
					>
						{#each TIME_ZONES as zone (zone)}
							<option value={zone}>{zone.replace('_', ' ')}</option>
						{/each}
					</select>
				{/snippet}
			</FormField>

			<FormField id="household-currency" label="Currency" hint="Used for expense totals.">
				{#snippet children({ id, describedBy })}
					<select
						{id}
						bind:value={currencyCode}
						disabled={!isAdmin}
						aria-describedby={describedBy}
						class={INPUT_CLASS}
					>
						{#each CURRENCIES as code (code)}
							<option value={code}>{code}</option>
						{/each}
					</select>
				{/snippet}
			</FormField>

			<div class="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
				<p id="details-note" class="text-xs text-stone-600">
					Preview only. Settings are not saved.
				</p>
				<button type="submit" disabled={!isAdmin} class={buttonClass('primary')}>
					Save details
				</button>
			</div>

			{#if saved}
				<div class="sm:col-span-2">
					<StatusMessage>Details updated on this screen. They are not saved.</StatusMessage>
				</div>
			{/if}
		</form>
	</Card>

	<Card labelledBy="members-heading">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="members-heading" class="text-lg font-semibold text-stone-900">Members</h2>
			<p class="text-sm text-stone-600">{data.members.length} people</p>
		</div>
		<MemberList members={data.members} currentMemberId={data.currentUser.id} />
		<p class="mt-4 text-xs text-stone-600">
			Admins can change roles and remove members. Role changes are available once sign-in is
			connected.
		</p>
	</Card>
</div>

<div class="mt-6">
	<Card labelledBy="invitations-heading">
		<h2 id="invitations-heading" class="text-lg font-semibold text-stone-900">Invitation codes</h2>
		<p class="mt-1 mb-5 text-sm text-stone-600">
			Codes let new people join as members. Codes expire, can be revoked, and are shown only once
			when created.
		</p>
		<InvitationPanel {invitations} today={data.today} onRevoke={revokeInvitation} />
	</Card>
</div>
