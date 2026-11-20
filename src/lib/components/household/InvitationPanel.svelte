<script lang="ts">
	import FormField from '#lib/components/ui/FormField.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import StatusMessage from '#lib/components/ui/StatusMessage.svelte';
	import { INPUT_CLASS } from '#lib/components/ui/form-styles';
	import { buttonClass } from '#lib/components/ui/button-styles';
	import { formatDate } from '#lib/domain/format';
	import { INVITATION_STATUS_LABELS } from '#lib/domain/labels';
	import { invitationStatus } from '#lib/domain/household';
	import type { Invitation, IsoDate } from '#lib/domain/types';

	interface Props {
		invitations: Invitation[];
		today: IsoDate;
		onRevoke: (invitationId: string) => void;
	}

	let { invitations, today, onRevoke }: Props = $props();

	const EXPIRY_OPTIONS = [1, 7, 14, 30];

	let expiresInDays = $state(7);
	let maxUsesText = $state('1');
	let error = $state<string | undefined>();
	let created = $state(false);

	const STATUS_TONES = {
		active: 'success',
		expired: 'neutral',
		revoked: 'neutral',
		exhausted: 'neutral'
	} as const;

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		created = false;
		const maxUses = Number(maxUsesText);
		if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > 20) {
			error = 'Enter a whole number of uses from 1 to 20.';
			return;
		}
		error = undefined;
		created = true;
	}
</script>

<div class="flex flex-col gap-6">
	<form
		novalidate
		onsubmit={handleSubmit}
		class="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
		aria-describedby="invitation-note"
	>
		<FormField id="invite-expiry" label="Code expires after">
			{#snippet children({ id, describedBy })}
				<select {id} bind:value={expiresInDays} aria-describedby={describedBy} class={INPUT_CLASS}>
					{#each EXPIRY_OPTIONS as days (days)}
						<option value={days}>{days} {days === 1 ? 'day' : 'days'}</option>
					{/each}
				</select>
			{/snippet}
		</FormField>

		<FormField id="invite-uses" label="Maximum uses" {error} hint="From 1 to 20 people.">
			{#snippet children({ id, describedBy, invalid })}
				<input
					{id}
					type="number"
					min="1"
					max="20"
					step="1"
					bind:value={maxUsesText}
					aria-describedby={describedBy}
					aria-invalid={invalid}
					class={INPUT_CLASS}
				/>
			{/snippet}
		</FormField>

		<button type="submit" class={buttonClass('primary')}>Create invitation</button>

		<p id="invitation-note" class="text-xs text-stone-600 sm:col-span-3">
			Preview only. No code is created here. In the finished app, the server creates each code,
			shows it once, and stores only a keyed hash.
		</p>

		{#if created}
			<div class="sm:col-span-3">
				<StatusMessage>
					No invitation was created. This preview does not generate codes.
				</StatusMessage>
			</div>
		{/if}
	</form>

	<div class="overflow-x-auto">
		<table class="w-full min-w-[34rem] text-left text-sm">
			<caption class="sr-only">Invitations for this household</caption>
			<thead>
				<tr
					class="border-b border-stone-200 text-xs font-semibold tracking-wide text-stone-600 uppercase"
				>
					<th scope="col" class="py-3 pr-4">Created</th>
					<th scope="col" class="py-3 pr-4">Expires</th>
					<th scope="col" class="py-3 pr-4">Uses</th>
					<th scope="col" class="py-3 pr-4">Status</th>
					<th scope="col" class="py-3 text-right"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-stone-100">
				{#each invitations as invitation (invitation.id)}
					{@const status = invitationStatus(invitation, today)}
					<tr>
						<td class="py-3 pr-4 whitespace-nowrap text-stone-700">
							{formatDate(invitation.createdOn)}
						</td>
						<td class="py-3 pr-4 whitespace-nowrap text-stone-700">
							{formatDate(invitation.expiresOn)}
						</td>
						<td class="py-3 pr-4 text-stone-700">{invitation.useCount} of {invitation.maxUses}</td>
						<td class="py-3 pr-4">
							<Badge tone={STATUS_TONES[status]}>{INVITATION_STATUS_LABELS[status]}</Badge>
						</td>
						<td class="py-3 text-right">
							{#if status === 'active'}
								<button
									type="button"
									onclick={() => onRevoke(invitation.id)}
									class="rounded-lg px-3 py-1.5 text-sm font-medium text-apricot-800 hover:bg-apricot-50"
								>
									Revoke
									<span class="sr-only">invitation created {formatDate(invitation.createdOn)}</span>
								</button>
							{/if}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="py-6 text-center text-stone-600">No invitations yet.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
