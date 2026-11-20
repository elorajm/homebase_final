<script lang="ts">
	import Avatar from '#lib/components/ui/Avatar.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import { ROLE_LABELS } from '#lib/domain/labels';
	import type { Member } from '#lib/domain/types';

	interface Props {
		members: Member[];
		currentMemberId: string;
	}

	let { members, currentMemberId }: Props = $props();
</script>

<ul class="divide-y divide-stone-100">
	{#each members as member (member.id)}
		<li class="flex items-center justify-between gap-4 py-3">
			<div class="flex min-w-0 items-center gap-3">
				<Avatar name={member.displayName} tone={member.avatarTone} />
				<div class="min-w-0">
					<p class="truncate font-medium text-stone-900">
						{member.displayName}
						{#if member.id === currentMemberId}
							<span class="text-xs font-medium text-sage-800">(you)</span>
						{/if}
					</p>
				</div>
			</div>
			<Badge tone={member.role === 'admin' ? 'sage' : 'neutral'}>{ROLE_LABELS[member.role]}</Badge>
		</li>
	{/each}
</ul>
